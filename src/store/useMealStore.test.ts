
import {
  describe,
  test,
  expect,
  beforeEach,
  jest,
} from "@jest/globals";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMealStore } from "./useMealStore";
import type { MealLog } from "../types/meal";

jest.mock(
  "@react-native-async-storage/async-storage",
  () =>
    require(
      "@react-native-async-storage/async-storage/jest/async-storage-mock"
    )
);

describe("Meal Store Tests", () => {
  let testMeal: MealLog;

  beforeEach(async () => {
    await AsyncStorage.clear();

    useMealStore.setState({
      meals: [],
      isLoading: false,
      syncingIds: [],
    });

    testMeal = {
      id: "test-meal-1",
      mealName: "Tavuk ve pilav",
      category: "lunch" as MealLog["category"],
      triggerTags: [],
      symptoms: [],
      severity: 2,
      createdAt: "2026-10-20T10:00:00.000Z",
      syncStatus: "pending",
    };
  });

  test("Yeni öğün eklenmeli", async () => {
    await useMealStore.getState().addMeal(testMeal);

    const meals = useMealStore.getState().meals;

    expect(meals).toHaveLength(1);
    expect(meals[0].mealName).toBe("Tavuk ve pilav");
    expect(meals[0].syncStatus).toBe("pending");
  });

  test("Öğün düzenlenmeli ve ID korunmalı", async () => {
    await useMealStore.getState().addMeal(testMeal);

    await useMealStore.getState().updateMeal({
      ...testMeal,
      mealName: "Sebzeli pilav",
      severity: 4,
    });

    const meals = useMealStore.getState().meals;

    expect(meals).toHaveLength(1);
    expect(meals[0].id).toBe("test-meal-1");
    expect(meals[0].mealName).toBe("Sebzeli pilav");
    expect(meals[0].severity).toBe(4);
    expect(meals[0].syncStatus).toBe("pending");
  });

  test("Öğün silinmeli", async () => {
    await useMealStore.getState().addMeal(testMeal);

    await useMealStore.getState().deleteMeal(
      "test-meal-1"
    );

    expect(useMealStore.getState().meals).toHaveLength(0);
  });

  test("Öğün AsyncStorage'a kaydedilmeli", async () => {
    await useMealStore.getState().addMeal(testMeal);

    const stored = await AsyncStorage.getItem(
      "rahatye_meal_logs"
    );

    expect(stored).not.toBeNull();

    const parsed: MealLog[] = JSON.parse(stored!);

    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe("test-meal-1");
  });
});
