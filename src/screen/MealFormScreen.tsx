
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import SelectionChips from "../components/SelectionChips";

import {
  MEAL_CATEGORIES,
  TRIGGER_TAGS,
  SYMPTOMS,
} from "../constants/mealOptions";

import type {
  MealCategory,
  TriggerTag,
  Symptom,
  Severity,
  MealLog,
} from "../types/meal";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { useMealStore } from "../store/useMealStore";

// FORMUN ALACAĞI PROPS
interface MealFormScreenProps {
  editingMeal: MealLog | null;
  onEditComplete: () => void;
}

export default function MealFormScreen({
  editingMeal,
  onEditComplete,
}: MealFormScreenProps) {
  // DÜZENLEME MODU KONTROLÜ
  const isEditing = editingMeal !== null;

  // FORM STATE
  const [mealName, setMealName] = useState(
    editingMeal?.mealName ?? ""
  );

  const [category, setCategory] = useState<MealCategory[]>(
    editingMeal ? [editingMeal.category] : []
  );

  const [triggerTags, setTriggerTags] = useState<TriggerTag[]>(
    editingMeal ? [...editingMeal.triggerTags] : []
  );

  const [symptoms, setSymptoms] = useState<Symptom[]>(
    editingMeal ? [...editingMeal.symptoms] : []
  );

  const [severity, setSeverity] = useState<Severity>(
    editingMeal?.severity ?? 1
  );

  const [isSaving, setIsSaving] = useState(false);

  // ZUSTAND FONKSİYONLARI
  const addMeal = useMealStore((state) => state.addMeal);
  const updateMeal = useMealStore((state) => state.updateMeal);
  const syncMeal = useMealStore((state) => state.syncMeal);

  // FORM DOĞRULAMA
  const isValid =
    mealName.trim().length > 0 && category.length > 0;

  // FORMU TEMİZLE
  const resetForm = () => {
    setMealName("");
    setCategory([]);
    setTriggerTags([]);
    setSymptoms([]);
    setSeverity(1);
  };

  // KAYDET / GÜNCELLE
  const handleSubmit = async () => {
    if (!isValid || isSaving) return;

    setIsSaving(true);

    // DÜZENLEME İŞLEMİ
    if (editingMeal) {
      const updatedMeal: MealLog = {
        ...editingMeal,
        mealName: mealName.trim(),
        category: category[0],
        triggerTags: [...triggerTags],
        symptoms: [...symptoms],
        severity,
      };

      try {
        await updateMeal(updatedMeal);

        Alert.alert(
          "Başarılı",
          "Öğün başarıyla güncellendi."
        );

        onEditComplete();
      } catch (error) {
        Alert.alert(
          "Güncelleme Hatası",
          "Öğün güncellenemedi. Lütfen tekrar dene."
        );
      } finally {
        setIsSaving(false);
      }

      return;
    }

    // YENİ ÖĞÜN OLUŞTURMA
    const newMeal: MealLog = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,
      mealName: mealName.trim(),
      category: category[0],
      triggerTags: [...triggerTags],
      symptoms: [...symptoms],
      severity,
      createdAt: new Date().toISOString(),
    };

    // ÖNCE CİHAZA KAYDET
    try {
      await addMeal(newMeal);
    } catch (error) {
      Alert.alert(
        "Kayıt Hatası",
        "Öğün cihazına kaydedilemedi. Lütfen tekrar dene."
      );

      setIsSaving(false);
      return;
    }

    // YEREL KAYIT BAŞARILIYSA FORMU TEMİZLE
    resetForm();

    // MOCK API İLE SENKRONİZASYON
    try {
      await syncMeal(newMeal.id);

      Alert.alert(
        "Başarılı",
        "Öğün kaydedildi ve senkronize edildi."
      );
    } catch (error) {
      Alert.alert(
        "Senkronizasyon Başarısız",
        "Öğünün cihazına kaydedildi ancak sunucuya gönderilemedi. Geçmiş ekranından tekrar deneyebilirsin."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* BAŞLIK */}
      <Text style={styles.heading}>
        {isEditing ? "Öğünü Düzenle" : "Yeni Öğün"}
      </Text>

      <Text style={styles.description}>
        {isEditing
          ? "Öğün bilgilerini güncelleyebilirsin."
          : "Ne yedin, nasıl hissettin?"}
      </Text>

      {/* YEMEK ADI */}
      <Text style={styles.label}>Yemek Adı</Text>

      <TextInput
        style={styles.input}
        placeholder="Örn. Tavuklu makarna"
        placeholderTextColor={colors.secondaryText}
        value={mealName}
        onChangeText={setMealName}
        maxLength={100}
        editable={!isSaving}
      />

      {/* YEMEK KATEGORİSİ */}
      <SelectionChips
        title="Yemek Kategorisi"
        options={MEAL_CATEGORIES}
        selectedValues={category}
        onChange={setCategory}
        multiple={false}
      />

      {/* TETİKLEYİCİ ETİKETLER */}
      <SelectionChips
        title="Tetikleyici Etiketler"
        options={TRIGGER_TAGS}
        selectedValues={triggerTags}
        onChange={setTriggerTags}
        multiple={true}
      />

      {/* SEMPTOMLAR */}
      <SelectionChips
        title="Semptomlar"
        options={SYMPTOMS}
        selectedValues={symptoms}
        onChange={setSymptoms}
        multiple={true}
      />

      {/* RAHATSIZLIK ŞİDDETİ */}
      <Text style={styles.label}>
        Rahatsızlık Şiddeti
      </Text>

      <View style={styles.severityContainer}>
        {([1, 2, 3, 4, 5] as Severity[]).map(
          (level) => (
            <Pressable
              key={level}
              onPress={() => setSeverity(level)}
              disabled={isSaving}
              accessibilityRole="radio"
              accessibilityState={{
                checked: severity === level,
              }}
              style={[
                styles.severityButton,
                severity === level &&
                  styles.selectedSeverity,
              ]}
            >
              <Text
                style={[
                  styles.severityText,
                  severity === level &&
                    styles.selectedSeverityText,
                ]}
              >
                {level}
              </Text>
            </Pressable>
          )
        )}
      </View>

      <Text style={styles.hint}>
        1 = Çok hafif, 5 = Çok şiddetli
      </Text>

      {/* KAYDET / GÜNCELLE BUTONU */}
      <Pressable
        onPress={handleSubmit}
        disabled={!isValid || isSaving}
        accessibilityRole="button"
        accessibilityState={{
          disabled: !isValid || isSaving,
        }}
        style={[
          styles.submitButton,
          (!isValid || isSaving) &&
            styles.disabledButton,
        ]}
      >
        {isSaving ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
            <Text style={styles.submitText}>
              {isEditing
                ? "Güncelleniyor..."
                : "Gönderiliyor..."}
            </Text>
          </View>
        ) : (
          <Text style={styles.submitText}>
            {isEditing
              ? "Değişiklikleri Kaydet"
              : "Öğünü Kaydet"}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 48,
  },

  heading: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.primaryDark,
    marginBottom: 6,
  },

  description: {
    fontSize: typography.caption,
    color: colors.secondaryText,
    marginBottom: 28,
  },

  label: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: typography.body,
    color: colors.text,
    marginBottom: 24,
  },

  severityContainer: {
    flexDirection: "row",
    gap: 10,
  },

  severityButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accentLight,
  },

  selectedSeverity: {
    backgroundColor: colors.accent,
    borderColor: colors.accentDark,
  },

  severityText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.accentDark,
  },

  selectedSeverityText: {
    color: "#FFFFFF",
  },

  hint: {
    fontSize: typography.small,
    color: colors.secondaryText,
    marginTop: 8,
    marginBottom: 28,
  },

  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.45,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: typography.body,
    fontWeight: "600",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
