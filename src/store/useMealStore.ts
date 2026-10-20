
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { MealLog, SyncStatus } from "../types/meal";
import { mockPostMeal } from "../services/mockApi";

const STORAGE_KEY = "rahatye_meal_logs";

interface MealStore {
  meals: MealLog[];
  isLoading: boolean;
  syncingIds: string[];

  loadMeals: () => Promise<void>;
  addMeal: (meal: MealLog) => Promise<void>;
  syncMeal: (id: string) => Promise<void>;
  retrySync: (id: string) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  updateMeal: (meal: MealLog) => Promise<void>;
}

export const useMealStore = create<MealStore>((set, get) => {
  
  const saveMeals = async (meals: MealLog[]) => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(meals)
    );

    set({ meals });
  };


  const updateSyncStatus = async (
    id: string,
    status: SyncStatus
  ) => {
    const updatedMeals = get().meals.map((meal) =>
      meal.id === id
        ? { ...meal, syncStatus: status }
        : meal
    );

    await saveMeals(updatedMeals);
  };

  return {
    meals: [],
    isLoading: false,
    syncingIds: [],

    loadMeals: async () => {
      set({ isLoading: true });

      try {
        const storedMeals = await AsyncStorage.getItem(
          STORAGE_KEY
        );

        const meals: MealLog[] = storedMeals
          ? JSON.parse(storedMeals)
          : [];

        set({ meals });
      } catch (error) {
        console.error("Kayıtlar yüklenemedi:", error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    addMeal: async (meal) => {
      const newMeal: MealLog = {
        ...meal,
        syncStatus: "pending",
      };

      const updatedMeals = [newMeal, ...get().meals];

    
      await saveMeals(updatedMeals);
    },

    syncMeal: async (id) => {
      
      if (get().syncingIds.includes(id)) return;

      const meal = get().meals.find((item) => item.id === id);
      if (!meal) return;

      set((state) => ({
        syncingIds: [...state.syncingIds, id],
      }));

      try {
        await updateSyncStatus(id, "pending");

        await mockPostMeal(meal);

        await updateSyncStatus(id, "synced");
      } catch (error) {
        console.error("Senkronizasyon başarısız:", error);

        try {
          await updateSyncStatus(id, "failed");
        } catch (storageError) {
          console.error(
            "Senkronizasyon durumu kaydedilemedi:",
            storageError
          );
        }

        throw error;
      } finally {
        set((state) => ({
          syncingIds: state.syncingIds.filter(
            (item) => item !== id
          ),
        }));
      }
    },

    retrySync: async (id) => {
      await get().syncMeal(id);
    },
    deleteMeal: async (id) => {

  if (get().syncingIds.includes(id)) {
    throw new Error("Senkronizasyon devam ediyor.");
  }

  const updatedMeals = get().meals.filter(
    (meal) => meal.id !== id
  );
  await saveMeals(updatedMeals);
},

updateMeal: async (updatedMeal) => {
  const existingMeal = get().meals.find(
    (meal) => meal.id === updatedMeal.id
  );

  if (!existingMeal) {
    throw new Error("Düzenlenecek öğün bulunamadı.");
  }

  if (get().syncingIds.includes(updatedMeal.id)) {
    throw new Error("Senkronizasyon devam ediyor.");
  }

  const updatedMeals = get().meals.map((meal) =>
    meal.id === updatedMeal.id
      ? {
          ...updatedMeal,
          id: existingMeal.id,
          createdAt: existingMeal.createdAt,
          syncStatus: "pending" as const,
        }
      : meal
  );

  await saveMeals(updatedMeals);
},

  };
});
