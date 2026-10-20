
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";

import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import MealFormScreen from "./src/screen/MealFormScreen";
import MealHistoryScreen from "./src/screen/MealHistoryScreen";

import type { MealLog } from "./src/types/meal";
import type { ThemeColors } from "./src/theme/colors";

import { useMealStore } from "./src/store/useMealStore";
import { useThemeStore } from "./src/store/useThemeStore";

type Screen = "form" | "history";

export default function App() {
  const [activeScreen, setActiveScreen] =
    useState<Screen>("form");

  const [editingMeal, setEditingMeal] =
    useState<MealLog | null>(null);

  // Öğün kayıtları
  const loadMeals = useMealStore(
    (state) => state.loadMeals
  );

  // Tema yönetimi
  const theme = useThemeStore((state) => state.theme);
  const colors = useThemeStore((state) => state.colors);
  const loadTheme = useThemeStore(
    (state) => state.loadTheme
  );
  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme
  );

  const styles = createStyles(colors);

  useEffect(() => {
    loadMeals().catch((error) => {
      console.error("Öğünler yüklenemedi:", error);
    });

    loadTheme().catch((error) => {
      console.error("Tema yüklenemedi:", error);
    });
  }, [loadMeals, loadTheme]);

  const handleEditMeal = (meal: MealLog) => {
    setEditingMeal(meal);
    setActiveScreen("form");
  };

  const handleEditComplete = () => {
    setEditingMeal(null);
    setActiveScreen("history");
  };

  const handleNewMeal = () => {
    setEditingMeal(null);
    setActiveScreen("form");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar
  barStyle={
    theme === "dark"
      ? "light-content"
      : "dark-content"
  }
/>

        {/* ÜST BAŞLIK */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Rahat Ye
          </Text>

          <Pressable
            onPress={() => {
              toggleTheme().catch((error) => {
                console.error("Tema değiştirilemedi:", error);
              });
            }}
            style={styles.themeButton}
            accessibilityRole="button"
            accessibilityLabel="Temayı değiştir"
          >
            <Text style={styles.themeIcon}>
              {theme === "light" ? "🌙" : "☀️"}
            </Text>
          </Pressable>
        </View>

        {/* EKRAN İÇERİĞİ */}
        <View style={styles.content}>
          {activeScreen === "form" ? (
            <MealFormScreen
              key={editingMeal?.id ?? "new"}
              editingMeal={editingMeal}
              onEditComplete={handleEditComplete}
            />
          ) : (
            <MealHistoryScreen
              onEditMeal={handleEditMeal}
            />
          )}
        </View>

        {/* ALT MENÜ */}
        <View style={styles.tabBar}>
          <Pressable
            onPress={handleNewMeal}
            style={styles.tab}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.tabText,
                activeScreen === "form" &&
                  styles.activeTab,
              ]}
            >
              Yeni Öğün
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveScreen("history")}
            style={styles.tab}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.tabText,
                activeScreen === "history" &&
                  styles.activeTab,
              ]}
            >
              Geçmiş
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.primary,
    },

    themeButton: {
      padding: 10,
      backgroundColor: colors.chipBackground,
      borderRadius: 20,
    },

    themeIcon: {
      fontSize: 22,
    },

    content: {
      flex: 1,
    },

    tabBar: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingBottom: 14,
    },

    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
    },

    tabText: {
      fontSize: 15,
      color: colors.secondaryText,
      fontWeight: "500",
    },

    activeTab: {
      color: colors.primary,
      fontWeight: "700",
    },
  });
