
import React, { useMemo } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import type { ThemeColors } from "../theme/colors";
import { typography } from "../theme/typography";
import { useThemeStore } from "../store/useThemeStore";

type Option<T extends string> = {
  label: string;
  value: T;
};

interface SelectionChipsProps<T extends string> {
  title: string;
  options: Option<T>[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
  multiple?: boolean;
}

export default function SelectionChips<T extends string>({
  title,
  options,
  selectedValues,
  onChange,
  multiple = true,
}: SelectionChipsProps<T>) {
  // AKTİF TEMA
  const colors = useThemeStore((state) => state.colors);

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  // SEÇİM İŞLEMİ
  const handleSelect = (value: T) => {
    const isSelected = selectedValues.includes(value);

    if (multiple) {
      if (isSelected) {
        onChange(
          selectedValues.filter((item) => item !== value)
        );
      } else {
        onChange([...selectedValues, value]);
      }
    } else {
      onChange([value]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(
            option.value
          );

          return (
            <Pressable
              key={option.value}
              onPress={() =>
                handleSelect(option.value)
              }
              accessibilityRole={
                multiple ? "checkbox" : "radio"
              }
              accessibilityState={{
                checked: isSelected,
              }}
              style={[
                styles.chip,
                isSelected && styles.selectedChip,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected &&
                    styles.selectedChipText,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// DİNAMİK TEMA STİLLERİ
const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
    },

    title: {
      fontSize: typography.body,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },

    optionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    chip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: colors.chipBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },

    selectedChip: {
      backgroundColor: colors.selectedBackground,
      borderColor: colors.primary,
    },

    chipText: {
      fontSize: typography.caption,
      color: colors.secondaryText,
    },

    selectedChipText: {
      color: colors.text,
      fontWeight: "600",
    },
  });
