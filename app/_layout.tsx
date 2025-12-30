/** @format */

import { useColorScheme } from "@/hooks/use-color-scheme";
import { FieldServiceContextProvider } from "@/src/context/App/FieldServiceContext";
import { SalesOrderContextProvider } from "@/src/context/App/SalesOrderContext";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { registerTranslation } from "react-native-paper-dates";
import "react-native-reanimated";

import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 🔠 Bahasa Indonesia untuk date picker
registerTranslation("id", {
  save: "Simpan",
  selectSingle: "Pilih tanggal",
  selectMultiple: "Pilih beberapa tanggal",
  selectRange: "Pilih rentang tanggal",
  notAccordingToDateFormat: (inputFormat) =>
    `Format tanggal harus ${inputFormat}`,
  mustBeHigherThan: (date) => `Harus setelah ${date}`,
  mustBeLowerThan: (date) => `Harus sebelum ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Harus antara ${startDate} dan ${endDate}`,
  dateIsDisabled: "Tanggal tidak bisa dipilih",
  previous: "Sebelumnya",
  next: "Berikutnya",
  typeInDate: "Ketik tanggal",
  pickDateFromCalendar: "Pilih dari kalender",
  close: "Tutup",
});

export const unstable_settings = {
  anchor: "SSI",
};

// =============================
// 1️⃣ Root utama
// =============================
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  const navTheme = colorScheme === "dark" ? NavDarkTheme : NavDefaultTheme;

  return (
    <ThemeProvider value={navTheme}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          {/* Letakkan AuthProvider di sini */}
          <AuthProvider>
            <SalesOrderContextProvider>
              <FieldServiceContextProvider>
                <AppContent />
              </FieldServiceContextProvider>
            </SalesOrderContextProvider>
            <StatusBar style="auto" />
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// =============================
// 2️⃣ Komponen dengan proteksi login
// =============================
function AppContent() {
  const { token, loading } = useAuth();
  const router = useRouter();

  // Jika belum login → arahkan ke halaman login
  useEffect(() => {
    if (!loading) {
      if (!token) router.replace("/login");
    }
  }, [token, loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: true, title: "Shriram Seed Sales" }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="sales"
        options={{ headerShown: true, title: "Sales Order" }}
      />
      <Stack.Screen
        name="fieldservice/index"
        options={{ headerShown: true, title: "Field Service" }}
      />
      <Stack.Screen
        name="customer/index"
        options={{ headerShown: true, title: "Customer" }}
      />
      <Stack.Screen
        name="invoice/index"
        options={{ headerShown: true, title: "Collection" }}
      />
      <Stack.Screen
        name="demomanagement/index"
        options={{ headerShown: true, title: "Demo Management" }}
      />
      <Stack.Screen
        name="planing"
        options={{ headerShown: true, title: "Planning and Actuals" }}
      />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
      <Stack.Screen
        name="fieldservicedtl"
        options={{ headerShown: true, title: "Detail Field Service" }}
      />
    </Stack>
  );
}
