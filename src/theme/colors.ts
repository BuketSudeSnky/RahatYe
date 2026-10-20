
export const lightColors = {
  primary: "#2E8B57",
  primaryDark: "#206B43",

  accent: "#F59E42",
  accentDark: "#D97726",
  accentLight: "#FFF0DB",

  background: "#FFFCF7",
  surface: "#FFFFFF",

  text: "#26382D",
  secondaryText: "#647267",

  border: "#E4E9DF",

  chipBackground: "#F3F5F1",
  selectedBackground: "#DDF3E5",

  error: "#D64545",
};

export const darkColors: typeof lightColors = {
  primary: "#399E68",
  primaryDark: "#2E8B57",

  accent: "#F59E42",
  accentDark: "#D97726",
  accentLight: "#443322",

  background: "#121C17",
  surface: "#1D2A22",

  text: "#EAF3EC",
  secondaryText: "#A5B8A9",

  border: "#34483B",

  chipBackground: "#29392F",
  selectedBackground: "#284936",

  error: "#FF7777",
};

export const colors = lightColors;

export type ThemeColors = typeof lightColors;
