/** @format */
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  GestureResponderEvent,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { IconButton } from "react-native-paper";

type FormHeaderProps = {
  title: string;
  onSave: () => void | Promise<void>;
  onClose: () => void;
  backgroundColor?: string;
  textColor?: string;
  // keamanan opsional
  confirmOnClose?: boolean; // jika true, akan minta konfirmasi sebelum menutup
  confirmOnSave?: boolean; // jika true, akan minta konfirmasi sebelum menyimpan
  disableWhileLoading?: boolean; // default true: men-disable tombol saat loading
  debounceMs?: number; // minimal interval antar klik (default 800ms)
};

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  onSave,
  onClose,
  backgroundColor = "#0d6efd",
  textColor = "#ffffff",
  confirmOnClose = false,
  confirmOnSave = false,
  disableWhileLoading = true,
  debounceMs = 800,
}) => {
  const [loading, setLoading] = useState(false);
  const lastPressRef = useRef<number>(0);

  // Animasi mount (fade + slide up)
  const animOpacity = useRef(new Animated.Value(0)).current;
  const animTranslateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(animTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [animOpacity, animTranslateY]);

  // helper debounce (prevent double tap)
  const allowPress = () => {
    const now = Date.now();
    if (now - lastPressRef.current < debounceMs) return false;
    lastPressRef.current = now;
    return true;
  };

  // wrapper for onSave to support both sync and async + optional confirm
  const handleSave = async (e?: GestureResponderEvent) => {
    if (!allowPress()) return;
    if (confirmOnSave) {
      Alert.alert("Konfirmasi", "Simpan perubahan?", [
        { text: "Batal", style: "cancel" },
        { text: "Simpan", onPress: () => runSave() },
      ]);
      return;
    }
    await runSave();
  };

  const runSave = async () => {
    try {
      const result = onSave();
      if (disableWhileLoading) setLoading(true);
      // detect Promise
      if (result && typeof (result as any).then === "function") {
        await result;
      }
      // jika sync, nothing to await
    } catch (err) {
      // tangani error: tampilkan alert sederhana (bisa disesuaikan)
      console.error("onSave error:", err);
      Alert.alert(
        "Error",
        (err && (err as Error).message) || "Gagal menyimpan"
      );
    } finally {
      if (disableWhileLoading) setLoading(false);
    }
  };

  const handleClose = (e?: GestureResponderEvent) => {
    if (!allowPress()) return;
    if (confirmOnClose) {
      Alert.alert("Konfirmasi", "Tutup tanpa menyimpan?", [
        { text: "Batal", style: "cancel" },
        { text: "Tutup", onPress: () => onClose() },
      ]);
      return;
    }
    onClose();
  };

  // tombol di-disable saat loading (opsional)
  const buttonsDisabled = disableWhileLoading && loading;

  return (
    <Animated.View
      style={{
        transform: [{ translateY: animTranslateY }],
        opacity: animOpacity,
        backgroundColor,
        paddingVertical: 6,
        paddingHorizontal: 12,

        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // shadow untuk iOS / elevation untuk Android
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
      }}
      accessible
      accessibilityRole="header"
      accessibilityLabel={`Header: ${title}`}
    >
      {/* Judul */}
      <Text
        style={{
          color: textColor,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {title}
      </Text>

      {/* Tombol kanan */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Save area: shows spinner when loading */}
        <PressableScale
          onPress={handleSave}
          disabled={buttonsDisabled}
          accessibilityLabel="Simpan"
          testID="formheader-save"
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <View>
              <IconButton
                icon="content-save"
                iconColor="blue"
                size={16}
                disabled={buttonsDisabled}
                style={{
                  backgroundColor: "white",
                  margin: 4,
                  opacity: buttonsDisabled ? 0.6 : 1,
                }}
              />
              {loading ? (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: 6,
                    // small indicator overlay
                  }}
                >
                  <ActivityIndicator size="small" />
                </View>
              ) : null}
            </View>

            <Text
              style={{
                color: textColor,
                fontWeight: "bold",
                fontSize: 10,
                textAlign: "center",
                marginTop: -6,
                opacity: buttonsDisabled ? 0.7 : 1,
              }}
            >
              Save
            </Text>
          </View>
        </PressableScale>

        {/* Close */}
        <PressableScale
          onPress={handleClose}
          disabled={buttonsDisabled}
          accessibilityLabel="Tutup"
          testID="formheader-close"
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <IconButton
              icon="close"
              iconColor="grey"
              size={16}
              disabled={buttonsDisabled}
              style={{
                backgroundColor: "white",
                margin: 4,
                opacity: buttonsDisabled ? 0.6 : 1,
              }}
            />
            <Text
              style={{
                color: textColor,
                fontWeight: "bold",
                fontSize: 10,
                textAlign: "center",
                marginTop: -6,
                opacity: buttonsDisabled ? 0.7 : 1,
              }}
            >
              Close
            </Text>
          </View>
        </PressableScale>
      </View>
    </Animated.View>
  );
};

export default FormHeader;

/**
 * PressableScale
 * - Komponen kecil untuk efek scale saat press (menggunakan Animated)
 * - Mencegah interaksi bila disabled
 */
type PressableScaleProps = {
  children: React.ReactNode;
  onPress?: (e?: GestureResponderEvent) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  onPress,
  disabled = false,
  accessibilityLabel,
  testID,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 7,
      tension: 90,
    }).start();
  };
  const onPressOut = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 90,
    }).start();
  };

  const handlePress = (e?: GestureResponderEvent) => {
    if (disabled) return;
    onPress && onPress(e);
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={handlePress}
      accessible={!disabled}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      disabled={disabled}
    >
      <Animated.View
        style={{ transform: [{ scale }], opacity: disabled ? 0.85 : 1 }}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
