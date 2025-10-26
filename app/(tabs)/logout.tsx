/** @format */
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function LogoutScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // langsung munculkan konfirmasi saat user masuk ke screen ini
    Alert.alert("Konfirmasi", "Yakin ingin logout?", [
      {
        text: "Batal",
        style: "cancel",
        onPress: () => {
          // kembali ke dashboard (atau screen sebelumnya)
          router.back();
        },
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          // ganti route ke login (sesuaikan path loginmu)
          router.replace("/login");
        },
      },
    ]);
  }, []);

  // UI sementara saat proses logout berlangsung (jika diperlukan)
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
