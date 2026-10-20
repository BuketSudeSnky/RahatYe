
import type { MealLog } from "../types/meal";

const API_DELAY = 1500;
const FAILURE_RATE = 0.1;


export interface MockApiResponse {
  success: boolean;
  message: string;
}

export const mockPostMeal = async (
  meal: MealLog
): Promise<MockApiResponse> => {

  await new Promise<void>((resolve) => {
    setTimeout(resolve, API_DELAY);
  });


  const shouldFail = Math.random() < FAILURE_RATE;

  if (shouldFail) {
    throw new Error("Sunucuya bağlanılamadı.");
  }

  console.log("Mock POST /api/logs:", meal);

  return {
    success: true,
    message: "Öğün başarıyla senkronize edildi.",
  };
};
