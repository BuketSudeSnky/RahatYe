
import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import CustomAlert from "../components/CustomAlert";
import type { AlertType } from "../components/CustomAlert";

import { useMealStore } from "../store/useMealStore";
import { useThemeStore } from "../store/useThemeStore";

import {
  MEAL_CATEGORIES,
  TRIGGER_TAGS,
  SYMPTOMS,
} from "../constants/mealOptions";

import type {
  MealLog,
  SyncStatus,
} from "../types/meal";

import type { ThemeColors } from "../theme/colors";
import { typography } from "../theme/typography";

interface MealHistoryScreenProps {
  onEditMeal: (meal: MealLog) => void;
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  deleteId: string | null;
}

export default function MealHistoryScreen({
  onEditMeal,
}: MealHistoryScreenProps) {

  const meals = useMealStore((state) => state.meals);
  const isLoading = useMealStore((state) => state.isLoading);
  const syncingIds = useMealStore(
    (state) => state.syncingIds
  );
  const retrySync = useMealStore(
    (state) => state.retrySync
  );
  const deleteMeal = useMealStore(
    (state) => state.deleteMeal
  );

  const colors = useThemeStore((state) => state.colors);

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  const [retryingId, setRetryingId] = useState<
    string | null
  >(null);

  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);


  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: "",
    message: "",
    type: "info",
    deleteId: null,
  });

  const sortedMeals = useMemo(
    () =>
      [...meals].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [meals]
  );


  const getLabels = (
    values: string[],
    options: { label: string; value: string }[]
  ) =>
    values.map(
      (value) =>
        options.find(
          (option) => option.value === value
        )?.label ?? value
    );

  // SENKRONİZASYON DURUMU
  const getStatusLabel = (status?: SyncStatus) => {
    switch (status) {
      case "synced":
        return "Senkronize";
      case "failed":
        return "Başarısız";
      default:
        return "Bekliyor";
    }
  };

  const showAlert = (
    title: string,
    message: string,
    type: AlertType,
    deleteId: string | null = null
  ) => {
    setAlertState({
      visible: true,
      title,
      message,
      type,
      deleteId,
    });
  };


  const closeAlert = () => {
    setAlertState((previous) => ({
      ...previous,
      visible: false,
      deleteId: null,
    }));
  };

 
  const handleRetry = async (id: string) => {
    if (
      syncingIds.includes(id) ||
      retryingId === id
    ) {
      return;
    }

    setRetryingId(id);

    try {
      await retrySync(id);

      showAlert(
        "Başarılı",
        "Öğün başarıyla senkronize edildi.",
        "success"
      );
    } catch (error) {
      showAlert(
        "Tekrar Başarısız",
        "Sunucuya bağlanılamadı. Daha sonra tekrar deneyebilirsin.",
        "error"
      );
    } finally {
      setRetryingId(null);
    }
  };

  
  const handleDelete = (id: string) => {
    if (deletingId !== null) return;

    showAlert(
      "Öğünü Sil",
      "Bu öğünü silmek istediğine emin misin? Bu işlem geri alınamaz.",
      "warning",
      id
    );
  };


  const confirmDelete = async () => {
    const id = alertState.deleteId;

    if (!id || deletingId !== null) return;

    closeAlert();
    setDeletingId(id);

    try {
      await deleteMeal(id);
    } catch (error) {
      showAlert(
        "Hata",
        "Öğün silinemedi. Lütfen tekrar dene.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };


  const renderMeal = ({
    item,
  }: {
    item: MealLog;
  }) => {
    const categoryLabel =
      MEAL_CATEGORIES.find(
        (option) =>
          option.value === item.category
      )?.label ?? item.category;

    const tags = getLabels(
      item.triggerTags,
      TRIGGER_TAGS
    );

    const symptoms = getLabels(
      item.symptoms,
      SYMPTOMS
    );

    const isSyncing = syncingIds.includes(item.id);
    const isRetrying = retryingId === item.id;
    const isDeleting = deletingId === item.id;
    const isBusy =
      isSyncing || isRetrying || isDeleting;

    return (
      <View style={styles.card}>
        {/* KART BAŞLIĞI */}
        <View style={styles.cardHeader}>
          <Text style={styles.mealName}>
            {item.mealName}
          </Text>

          <View
            style={[
              styles.statusBadge,
              item.syncStatus === "synced"
                ? styles.syncedBadge
                : item.syncStatus === "failed"
                ? styles.failedBadge
                : styles.pendingBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusLabel(item.syncStatus)}
            </Text>
          </View>
        </View>

        {/* TARİH */}
        <Text style={styles.date}>
          {new Date(
            item.createdAt
          ).toLocaleString("tr-TR")}
        </Text>

        {/* KATEGORİ */}
        <Text style={styles.detail}>
          Kategori: {categoryLabel}
        </Text>

        {/* TETİKLEYİCİ ETİKETLER */}
        <Text style={styles.detail}>
          Etiketler:{" "}
          {tags.length
            ? tags.join(", ")
            : "Yok"}
        </Text>

        {/* SEMPTOMLAR */}
        <Text style={styles.detail}>
          Semptomlar:{" "}
          {symptoms.length
            ? symptoms.join(", ")
            : "Yok"}
        </Text>

        {/* ŞİDDET */}
        <View style={styles.severityBadge}>
          <Text style={styles.severityText}>
            Şiddet: {item.severity}/5
          </Text>
        </View>

        {/* TEKRAR DENE */}
        {item.syncStatus !== "synced" && (
          <Pressable
            onPress={() =>
              handleRetry(item.id)
            }
            disabled={isBusy}
            accessibilityRole="button"
            style={[
              styles.retryButton,
              isBusy &&
                styles.disabledButton,
            ]}
          >
            {isSyncing || isRetrying ? (
              <ActivityIndicator
                color="#FFFFFF"
                size="small"
              />
            ) : (
              <Text style={styles.retryText}>
                Tekrar Dene
              </Text>
            )}
          </Pressable>
        )}

        {/* DÜZENLE */}
        <Pressable
          onPress={() =>
            onEditMeal(item)
          }
          disabled={isBusy}
          accessibilityRole="button"
          style={[
            styles.editButton,
            isBusy &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.editText}>
            Düzenle
          </Text>
        </Pressable>

        {/* SİL */}
        <Pressable
          onPress={() =>
            handleDelete(item.id)
          }
          disabled={isBusy}
          accessibilityRole="button"
          style={[
            styles.deleteButton,
            isBusy &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.deleteText}>
            {isDeleting ? "Siliniyor..." : "Sil"}
          </Text>
        </Pressable>
      </View>
    );
  };

  
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          color={colors.primary}
        />

        <Text style={styles.emptyText}>
          Kayıtlar yükleniyor...
        </Text>
      </View>
    );
  }

  
  return (
    <View style={styles.screen}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={sortedMeals}
        keyExtractor={(item) => item.id}
        renderItem={renderMeal}
        ListHeaderComponent={
          <Text style={styles.heading}>
            Öğün Geçmişi
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              Henüz kayıtlı öğün bulunmuyor.
            </Text>
          </View>
        }
      />

      {/* DARK / LIGHT UYUMLU ALERT */}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
        onConfirm={
          alertState.deleteId !== null
            ? confirmDelete
            : undefined
        }
        confirmText={
          alertState.deleteId !== null
            ? "Sil"
            : "Tamam"
        }
        cancelText="Vazgeç"
        destructive={alertState.deleteId !== null}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      padding: 20,
      paddingBottom: 40,
      flexGrow: 1,
    },

    heading: {
      fontSize: typography.title,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 20,
    },

    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    },

    mealName: {
      fontSize: typography.subtitle,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
    },

    date: {
      fontSize: typography.small,
      color: colors.secondaryText,
      marginTop: 6,
      marginBottom: 12,
    },

    detail: {
      fontSize: typography.caption,
      color: colors.text,
      marginBottom: 6,
    },

    severityBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.accentLight,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 8,
    },

    severityText: {
      color: colors.accent,
      fontWeight: "600",
    },

    statusBadge: {
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },

    syncedBadge: {
      backgroundColor: colors.selectedBackground,
    },

    failedBadge: {
      backgroundColor: colors.accentLight,
    },

    pendingBadge: {
      backgroundColor: colors.chipBackground,
    },

    statusText: {
      fontSize: typography.small,
      fontWeight: "600",
      color: colors.text,
    },

    retryButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 14,
    },

    retryText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },

    editButton: {
      backgroundColor: colors.selectedBackground,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 14,
      borderWidth: 1,
      borderColor: colors.primary,
    },

    editText: {
      color: colors.text,
      fontWeight: "600",
    },

    deleteButton: {
      backgroundColor: colors.accentLight,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.accent,
    },

    deleteText: {
      color: colors.accent,
      fontWeight: "600",
    },

    disabledButton: {
      opacity: 0.6,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },

    emptyText: {
      color: colors.secondaryText,
      textAlign: "center",
      marginTop: 8,
    },
  });
