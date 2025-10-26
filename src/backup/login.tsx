/** @format */

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import loginStyles from "../style/loginStyles";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fingerprint, setFingerprint] = useState(false);
  const [faceID, setFaceID] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }
    // Ganti halaman → masuk ke Dashboard
    router.replace("/(tabs)");
  };
  // 🔹 Fingerprint / FaceID login
  const handleBiometricAuth = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      alert("Perangkat tidak mendukung autentikasi biometrik");
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      alert("Belum ada sidik jari / FaceID terdaftar di perangkat");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Biometric Authentication",
      fallbackLabel: "Password Authentication",
    });

    if (result.success) {
      router.replace("/(tabs)"); // sukses → masuk dashboard
    } else {
      alert("authentication failed");
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
            <Text
              variant="headlineSmall"
              style={{ marginBottom: 20, color: "white", textAlign: "center" }}
            >
              Shriram Seeds Indonesia™
            </Text>

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
            >
              Login
            </Button>
            {/* Tombol login sidik jari */}
            {/* <Button
              mode="outlined"
              icon="fingerprint"
              onPress={handleBiometricAuth}
              style={{ marginTop: 10, backgroundColor: "white" }}
            >
              Login dengan Sidik Jari
            </Button> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
