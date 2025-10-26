/** @format */

import { useColorScheme } from "@/hooks/use-color-scheme";
import { FieldServiceContextProvider } from "@/src/context/App/FieldServiceContext";
import { SalesOrderContextProvider } from "@/src/context/App/SalesOrderContext";
import { AuthProvider } from "@/src/context/AuthContext";
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { registerTranslation } from "react-native-paper-dates";
import "react-native-reanimated";

// <-- Tambahan import:
import React from "react";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // pilih tema paper sesuai colorScheme
  const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  // Jika mau sinkron dengan navigation theme (opsional)
  const navTheme = colorScheme === "dark" ? NavDarkTheme : NavDefaultTheme;

  return (
    // React Navigation theme provider (opsional)
    <ThemeProvider value={navTheme}>
      {/* SafeAreaProvider untuk handling notch/statusbar */}
      <SafeAreaProvider>
        {/* PaperProvider harus di ROOT sebelum komponen Paper apa pun */}
        <PaperProvider theme={paperTheme}>
          {/* Context auth & app di dalam PaperProvider */}
          <AuthProvider>
            <SalesOrderContextProvider>
              <FieldServiceContextProvider>
                <Stack>
                  <Stack.Screen
                    name="login"
                    options={{ headerShown: true, title: "Shriram Seed Sales" }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="sales"
                    options={{
                      headerShown: true,
                      title: "Sales Order",
                    }}
                  />
                  <Stack.Screen
                    name="fieldservice/index"
                    options={{
                      headerShown: true,
                      title: "Field Service",
                    }}
                  />
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal", title: "Modal" }}
                  />
                </Stack>
              </FieldServiceContextProvider>
            </SalesOrderContextProvider>
            <StatusBar style="auto" />
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
