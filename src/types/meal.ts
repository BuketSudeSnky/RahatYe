export type MealCategory =
  | "home_cooked"
  | "restaurant"
  | "packaged"
  | "fast_food"
  | "snack"
  | "beverage";

export type TriggerTag =
  | "spicy"
  | "dairy"
  | "gluten"
  | "fried"
  | "fatty"
  | "caffeinated"
  | "carbonated"
  | "acidic"
  | "high_sugar"
  | "legumes";

export type Symptom =
  | "bloating"
  | "reflux"
  | "stomach_cramp"
  | "nausea"
  | "heartburn"
  | "gas"
  | "diarrhea"
  | "constipation"
  | "abdominal_pain"
  | "indigestion";

export type Severity = 1 | 2 | 3 | 4 | 5;

export type SyncStatus = "pending" | "synced" | "failed";

export interface MealLog {
  id: string;
  mealName: string;
  category: MealCategory;
  triggerTags: TriggerTag[];
  symptoms: Symptom[];
  severity: Severity;
  createdAt: string;
  syncStatus?: SyncStatus;
}