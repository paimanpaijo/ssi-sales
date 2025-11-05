/** @format */

import BiometricPrompt from "@/src/component/BiometricPrompt";
import { useAuth } from "@/src/context/AuthContext";
import loginStyles from "@/src/style/loginStyles";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";

const TOKEN_KEY = "token_v1"; // must match AuthContext
const BIO_KEY = "biometric_enabled_v1";
const TOKEN_TTL_SECONDS = 60 * 60; // 1 hour (same as AuthContext)

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // biometric UI
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  // snackbar
  const [snackMsg, setSnackMsg] = useState<string | null>(null);
  const [snackVisible, setSnackVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setBioAvailable(!!hasHardware && !!isEnrolled);

        const enabled = await SecureStore.getItemAsync(BIO_KEY);
        setBioEnabled(enabled === "1");
      } catch (err) {
        console.warn("biometric check error", err);
      }
    })();
  }, []);

  const validate = () => {
    if (!email || !password) {
      showSnack("Silakan isi email dan password.");
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      showSnack("Format email tidak valid.");
      return false;
    }
    return true;
  };

  const showSnack = (msg: string) => {
    setSnackMsg(msg);
    setSnackVisible(true);
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const tok = await login(email.trim(), password);
      // login() in AuthContext persists token
      showSnack("Login sukses");
      // open biometric enable prompt
      setShowBiometricPrompt(true);
      // navigate after small delay so modal can show (or you can navigate immediately and let modal be handled elsewhere)
      // we will navigate immediately to dashboard as the user is authenticated
      router.replace("/(tabs)");
    } catch (err) {
      console.error(err);
      showSnack("Login gagal — periksa email/password.");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      setLoading(true);
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        showSnack("Perangkat tidak mendukung autentikasi biometrik");
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        showSnack("Belum ada sidik jari / FaceID terdaftar di perangkat");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login menggunakan biometrik",
        fallbackLabel: "Gunakan password",
      });

      if (!result.success) {
        showSnack("Autentikasi biometrik gagal atau dibatalkan.");
        return;
      }

      // read stored token JSON
      const raw = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!raw) {
        showSnack("Tidak menemukan sesi. Silakan login manual.");
        return;
      }

      let parsed: { token: string; ts: number } | null = null;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        parsed = null;
      }

      if (!parsed || !parsed.token || !parsed.ts) {
        showSnack("Token tidak valid. Silakan login manual.");
        return;
      }

      // check TTL
      const age = Math.floor(Date.now() / 1000) - parsed.ts;
      if (age >= TOKEN_TTL_SECONDS) {
        // expired
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        showSnack("Sesi kedaluwarsa. Silakan login ulang.");
        return;
      }

      // token valid -> navigate
      showSnack("Login biometrik sukses");
      router.replace("/(tabs)");
    } catch (err) {
      console.error("biometric login error", err);
      showSnack("Terjadi kesalahan saat autentikasi biometrik.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/b89.webp")}
      style={loginStyles.background}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={loginStyles.scrollContainer}>
          <View style={loginStyles.formContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={loginStyles.imagelogo}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={loginStyles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              autoFocus
              left={<TextInput.Icon icon="email" />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={loginStyles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={{ marginTop: 8, backgroundColor: "blue" }}
              labelStyle={{ color: "white" }}
            >
              Login
            </Button>

            {/* Show biometric button if enabled and available */}
            {bioAvailable && bioEnabled && (
              <Button
                mode="outlined"
                icon="fingerprint"
                onPress={handleBiometricAuth}
                style={{ marginTop: 10, backgroundColor: "white" }}
                disabled={loading}
              >
                Login dengan Sidik Jari / FaceID
              </Button>
            )}

            <BiometricPrompt
              visible={showBiometricPrompt}
              onClose={() => setShowBiometricPrompt(false)}
            />
            <View style={loginStyles.footer}>
              <Text variant="bodySmall" style={{ color: "white" }}>
                Versi 1.0
              </Text>
              <Text variant="bodySmall" style={{ color: "white" }}>
                &copy; 2025 Shriram Seed Indonesia™
              </Text>
            </View>
          </View>
        </ScrollView>

        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={3000}
        >
          {snackMsg}
        </Snackbar>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
