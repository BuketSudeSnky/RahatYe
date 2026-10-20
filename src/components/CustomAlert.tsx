
import React, { useMemo } from "react";

import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { useThemeStore } from "../store/useThemeStore";
import type { ThemeColors } from "../theme/colors";

export type AlertType = "success" | "error" | "warning" | "info";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export default function CustomAlert({
  visible,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
  confirmText = "Tamam",
  cancelText = "Vazgeç",
  destructive = false,
}: CustomAlertProps) {
  const colors = useThemeStore((state) => state.colors);

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  const icons: Record<AlertType, string> = {
    success: "✓",
    error: "!",
    warning: "!",
    info: "i",
  };

  const iconColor =
    type === "success"
      ? colors.primary
      : type === "error"
      ? colors.error
      : type === "warning"
      ? colors.accent
      : colors.primary;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* DURUM SİMGESİ */}
          <View
            style={[
              styles.iconCircle,
              { borderColor: iconColor },
            ]}
          >
            <Text
              style={[
                styles.iconText,
                { color: iconColor },
              ]}
            >
              {icons[type]}
            </Text>
          </View>

          {/* BAŞLIK */}
          <Text style={styles.title}>
            {title}
          </Text>

          {/* AÇIKLAMA */}
          <Text style={styles.message}>
            {message}
          </Text>

          {/* BUTONLAR */}
          <View style={styles.buttonRow}>
            {onConfirm && (
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>
                  {cancelText}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleConfirm}
              accessibilityRole="button"
              style={[
                styles.confirmButton,
                destructive && {
                  backgroundColor: colors.error,
                },
              ]}
            >
              <Text style={styles.confirmText}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },

    dialog: {
      width: "100%",
      maxWidth: 380,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    iconCircle: {
      width: 54,
      height: 54,
      borderRadius: 27,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },

    iconText: {
      fontSize: 28,
      fontWeight: "700",
    },

    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 10,
    },

    message: {
      fontSize: 14,
      color: colors.secondaryText,
      textAlign: "center",
      lineHeight: 21,
      marginBottom: 24,
    },

    buttonRow: {
      flexDirection: "row",
      gap: 10,
      width: "100%",
    },

    cancelButton: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      backgroundColor: colors.chipBackground,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },

    cancelText: {
      color: colors.text,
      fontWeight: "600",
    },

    confirmButton: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
    },

    confirmText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },
  });
