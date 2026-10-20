
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  lightColors,
  darkColors,
} from "../theme/colors";

import type { ThemeColors } from "../theme/colors";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "rahatye_theme";

interface ThemeStore {
  theme: ThemeMode;
  colors: ThemeColors;
  isThemeLoaded: boolean;

  loadTheme: () => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>(
  (set, get) => ({
    theme: "light",
    colors: lightColors,
    isThemeLoaded: false,

    loadTheme: async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(
          THEME_STORAGE_KEY
        );

        const mode: ThemeMode =
          savedTheme === "dark" ? "dark" : "light";

        set({
          theme: mode,
          colors: mode === "dark" ? darkColors : lightColors,
          isThemeLoaded: true,
        });
      } catch (error) {
        console.error("Tema yüklenemedi:", error);
        set({ isThemeLoaded: true });
      }
    },

    setTheme: async (mode) => {
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        mode
      );

      set({
        theme: mode,
        colors: mode === "dark" ? darkColors : lightColors,
      });
    },

    toggleTheme: async () => {
      const nextTheme =
        get().theme === "light" ? "dark" : "light";

      await get().setTheme(nextTheme);
    },
  })
);
