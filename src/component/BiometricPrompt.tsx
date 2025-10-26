/**
 * BiometricPrompt.tsx
 *
 * Component: modal prompt that asks the user to enable biometric login after a successful login.
 * Usage:
 *  - Import in your LoginScreen: `import BiometricPrompt from '@/src/components/BiometricPrompt'`
 *  - Keep a state `const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);`
 *  - After successful login (when useAuth.login resolves), set `setShowBiometricPrompt(true)`.
 *  - Render: `<BiometricPrompt visible={showBiometricPrompt} onClose={() => setShowBiometricPrompt(false)} />`
 *
 * Behavior:
 *  - Checks device biometric availability and enrollment using expo-local-authentication.
 *  - Requires that a token already exists in SecureStore (AuthContext persists it on login).
 *  - If user accepts, stores a flag `biometric_enabled_v1 = '1'` in SecureStore.
 *  - If user denies or device unsupported, shows an appropriate message.
 *
 * @format
 */

import { useAuth } from "@/src/context/AuthContext";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Paragraph, Portal, Text } from "react-native-paper";

const BIO_KEY = "biometric_enabled_v1";
const TOKEN_KEY = "token_v1";

export default function BiometricPrompt({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { token } = useAuth();
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (mounted) {
          setAvailable(!!hasHardware);
          setEnrolled(!!isEnrolled);
          if (!hasHardware) setMessage("Perangkat tidak mendukung biometrik.");
          else if (!isEnrolled)
            setMessage("Belum ada sidik jari / FaceID terdaftar.");
          else setMessage(null);
        }
      } catch (err) {
        if (mounted) setMessage("Terjadi kesalahan memeriksa biometrik");
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [visible]);

  const enableBiometric = async () => {
    try {
      // must have token (user logged in)
      if (!token) {
        setMessage("Session tidak ditemukan. Silakan login ulang.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Konfirmasi untuk mengaktifkan biometric",
        fallbackLabel: "Gunakan password",
      });

      if (!result.success) {
        setMessage("Autentikasi biometrik gagal atau dibatalkan.");
        return;
      }

      // set flag
      await SecureStore.setItemAsync(BIO_KEY, "1");
      // ensure token is present (AuthContext already saved it)
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!stored) {
        // save token object if needed; AuthContext should have persisted already
        // but we try to be safe and re-persist token with ts if possible
        await SecureStore.setItemAsync(
          TOKEN_KEY,
          JSON.stringify({ token, ts: Math.floor(Date.now() / 1000) })
        );
      }

      onClose();
    } catch (err) {
      setMessage("Gagal mengaktifkan biometric.");
    }
  };

  const disableBiometric = async () => {
    try {
      await SecureStore.deleteItemAsync(BIO_KEY);
      onClose();
    } catch (err) {
      setMessage("Gagal menonaktifkan biometric.");
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View>
          <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
            Aktifkan Login Biometrik
          </Text>
          <Paragraph style={{ marginBottom: 12 }}>
            Dengan mengaktifkan login biometrik, Anda dapat masuk lebih cepat
            menggunakan sidik jari atau FaceID pada perangkat ini.
          </Paragraph>

          {checking ? (
            <Paragraph>Memeriksa ketersediaan perangkat...</Paragraph>
          ) : (
            <>
              {message && <Paragraph>{message}</Paragraph>}

              <View style={{ marginTop: 12 }}>
                <Button
                  mode="contained"
                  onPress={enableBiometric}
                  disabled={!available || !enrolled}
                  style={{ marginBottom: 8 }}
                >
                  Aktifkan Biometrik
                </Button>
                <Button mode="outlined" onPress={disableBiometric}>
                  Tidak, Nanti Saja
                </Button>
              </View>
            </>
          )}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});
