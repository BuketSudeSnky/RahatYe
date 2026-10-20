
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

import { useMealStore } from "./src/store/useMealStore";
import { colors } from "./src/theme/colors";

type Screen = "form" | "history";

export default function App() {

  const [activeScreen, setActiveScreen] =
    useState<Screen>("form");

  const [editingMeal, setEditingMeal] =
    useState<MealLog | null>(null);

  const loadMeals = useMealStore(
    (state) => state.loadMeals
  );

  useEffect(() => {
    loadMeals().catch((error) => {
      console.error("Öğünler yüklenemedi:", error);
    });
  }, [loadMeals]);

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

  const handleHistory = () => {
    setActiveScreen("history");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

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
          {/* YENİ ÖĞÜN */}
          <Pressable
            onPress={handleNewMeal}
            accessibilityRole="button"
            style={styles.tab}
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

          {/* GEÇMİŞ */}
          <Pressable
            onPress={handleHistory}
            accessibilityRole="button"
            style={styles.tab}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
