/** @format */
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function LogoutScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    Alert.alert("Konfirmasi", "Yakin ingin logout?", [
      { text: "Batal", style: "cancel", onPress: () => router.back() },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout(); // panggil fungsi logout dari context
          router.replace("/login"); // kembali ke login screen
        },
      },
    ]);
  }, []);

  return null; // tidak perlu UI apa pun, langsung prompt alert
}
