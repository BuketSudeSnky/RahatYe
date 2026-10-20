
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

import { useMealStore } from "../store/useMealStore";

import {
  MEAL_CATEGORIES,
  TRIGGER_TAGS,
  SYMPTOMS,
} from "../constants/mealOptions";

import type {
  MealLog,
  SyncStatus,
} from "../types/meal";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

interface MealHistoryScreenProps {
  onEditMeal: (meal: MealLog) => void;
}

export default function MealHistoryScreen({
  onEditMeal,
}: MealHistoryScreenProps) {
  const meals = useMealStore((state) => state.meals);
  const isLoading = useMealStore((state) => state.isLoading);
  const syncingIds = useMealStore((state) => state.syncingIds);
  const retrySync = useMealStore((state) => state.retrySync);
  const deleteMeal = useMealStore((state) => state.deleteMeal);

  const [retryingId, setRetryingId] = useState<string | null>(
    null
  );

  const sortedMeals = [...meals].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  const getLabels = (
    values: string[],
    options: { label: string; value: string }[]
  ) =>
    values.map(
      (value) =>
        options.find((option) => option.value === value)?.label ??
        value
    );

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

  // BAŞARISIZ SENKRONİZASYONU TEKRAR DENE
  const handleRetry = async (id: string) => {
    if (syncingIds.includes(id) || retryingId === id) {
      return;
    }

    setRetryingId(id);

    try {
      await retrySync(id);

      Alert.alert(
        "Başarılı",
        "Öğün başarıyla senkronize edildi."
      );
    } catch (error) {
      Alert.alert(
        "Tekrar Başarısız",
        "Sunucuya bağlanılamadı. Daha sonra tekrar deneyebilirsin."
      );
    } finally {
      setRetryingId(null);
    }
  };

  // ÖĞÜN SİLME
  const handleDelete = (id: string) => {
    Alert.alert(
      "Öğünü Sil",
      "Bu öğünü silmek istediğine emin misin? Bu işlem geri alınamaz.",
      [
        {
          text: "Vazgeç",
          style: "cancel",
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMeal(id);
            } catch (error) {
              Alert.alert(
                "Hata",
                "Öğün silinemedi. Lütfen tekrar dene."
              );
            }
          },
        },
      ]
    );
  };

  // ÖĞÜN KARTI
  const renderMeal = ({ item }: { item: MealLog }) => {
    const categoryLabel =
      MEAL_CATEGORIES.find(
        (option) => option.value === item.category
      )?.label ?? item.category;

    const tags = getLabels(item.triggerTags, TRIGGER_TAGS);
    const symptoms = getLabels(item.symptoms, SYMPTOMS);

    const isSyncing = syncingIds.includes(item.id);
    const isRetrying = retryingId === item.id;
    const isBusy = isSyncing || isRetrying;

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
          {new Date(item.createdAt).toLocaleString("tr-TR")}
        </Text>

        {/* KATEGORİ */}
        <Text style={styles.detail}>
          Kategori: {categoryLabel}
        </Text>

        {/* TETİKLEYİCİ ETİKETLER */}
        <Text style={styles.detail}>
          Etiketler:{" "}
          {tags.length ? tags.join(", ") : "Yok"}
        </Text>

        {/* SEMPTOMLAR */}
        <Text style={styles.detail}>
          Semptomlar:{" "}
          {symptoms.length ? symptoms.join(", ") : "Yok"}
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
            onPress={() => handleRetry(item.id)}
            disabled={isBusy}
            accessibilityRole="button"
            style={[
              styles.retryButton,
              isBusy && styles.disabledButton,
            ]}
          >
            {isBusy ? (
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
          onPress={() => onEditMeal(item)}
          disabled={isBusy}
          accessibilityRole="button"
          style={[
            styles.editButton,
            isBusy && styles.disabledButton,
          ]}
        >
          <Text style={styles.editText}>
            Düzenle
          </Text>
        </Pressable>

        {/* SİL */}
        <Pressable
          onPress={() => handleDelete(item.id)}
          disabled={isBusy}
          accessibilityRole="button"
          style={[
            styles.deleteButton,
            isBusy && styles.disabledButton,
          ]}
        >
          <Text style={styles.deleteText}>
            Sil
          </Text>
        </Pressable>
      </View>
    );
  };

  // YÜKLENME EKRANI
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />

        <Text style={styles.emptyText}>
          Kayıtlar yükleniyor...
        </Text>
      </View>
    );
  }

  // ÖĞÜN GEÇMİŞİ LİSTESİ
  return (
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
  );
}

const styles = StyleSheet.create({
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
    color: colors.primaryDark,
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
    color: colors.accentDark,
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
    color: colors.primaryDark,
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
    color: colors.accentDark,
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
