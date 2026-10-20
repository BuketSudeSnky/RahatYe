import type {
  MealCategory,
  TriggerTag,
  Symptom,
} from "../types/meal";

type Option<T extends string> = {
  label: string;
  value: T;
};

export const MEAL_CATEGORIES: Option<MealCategory>[] = [
  { label: "Ev Yemeği", value: "home_cooked" },
  { label: "Restoran", value: "restaurant" },
  { label: "Paketli Ürün", value: "packaged" },
  { label: "Fast Food", value: "fast_food" },
  { label: "Atıştırmalık", value: "snack" },
  { label: "İçecek", value: "beverage" },
];

export const TRIGGER_TAGS: Option<TriggerTag>[] = [
  { label: "Acılı", value: "spicy" },
  { label: "Süt Ürünü", value: "dairy" },
  { label: "Gluten", value: "gluten" },
  { label: "Kızartma", value: "fried" },
  { label: "Yağlı", value: "fatty" },
  { label: "Kafeinli", value: "caffeinated" },
  { label: "Gazlı İçecek", value: "carbonated" },
  { label: "Asitli", value: "acidic" },
  { label: "Yüksek Şeker", value: "high_sugar" },
  { label: "Baklagil", value: "legumes" },
];

export const SYMPTOMS: Option<Symptom>[] = [
  { label: "Şişkinlik", value: "bloating" },
  { label: "Reflü", value: "reflux" },
  { label: "Mide Krampı", value: "stomach_cramp" },
  { label: "Bulantı", value: "nausea" },
  { label: "Mide Yanması", value: "heartburn" },
  { label: "Gaz", value: "gas" },
  { label: "İshal", value: "diarrhea" },
  { label: "Kabızlık", value: "constipation" },
  { label: "Karın Ağrısı", value: "abdominal_pain" },
  { label: "Hazımsızlık", value: "indigestion" },
];