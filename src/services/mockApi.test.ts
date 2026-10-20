
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";

import { mockPostMeal } from "./mockApi";
import type { MealLog } from "../types/meal";

describe("Mock API Tests", () => {
  const testMeal: MealLog = {
    id: "test-1",
    mealName: "Tavuk ve pilav",
    category: "home_cooked",
    triggerTags: [],
    symptoms: [],
    severity: 2,
    createdAt: new Date().toISOString(),
    syncStatus: "pending",
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test("Başarılı API isteği doğru yanıt döndürmeli", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    const request = mockPostMeal(testMeal);

    await jest.advanceTimersByTimeAsync(1500);

    await expect(request).resolves.toEqual({
      success: true,
      message: "Öğün başarıyla senkronize edildi.",
    });

    expect(console.log).toHaveBeenCalledWith(
      "Mock POST /api/logs:",
      testMeal
    );
  });

  test("Başarısız API isteği hata fırlatmalı", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.05);

    const request = mockPostMeal(testMeal);

    // Reddedilen Promise'i önceden yakala
    const result = expect(request).rejects.toThrow(
      "Sunucuya bağlanılamadı."
    );

    await jest.advanceTimersByTimeAsync(1500);

    await result;
  });

  test("API isteği 1500 ms gecikmeli çalışmalı", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    let completed = false;

    const request = mockPostMeal(testMeal).then(() => {
      completed = true;
    });

    await jest.advanceTimersByTimeAsync(1499);

    expect(completed).toBe(false);

    await jest.advanceTimersByTimeAsync(1);

    await request;

    expect(completed).toBe(true);
  });
});
