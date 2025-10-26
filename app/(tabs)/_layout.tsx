/** @format */

import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";

export default function TabsLayout() {
  return (
    <PaperProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#4A90E2", // Warna aktif
          tabBarInactiveTintColor: "#999", // Warna nonaktif
          tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
          tabBarStyle: styles.tabBar, // pakai custom style di bawah
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            headerShown: true,
            headerTitle: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />
        {/* 👇 Tambahkan ini */}
        <Tabs.Screen
          name="explore"
          options={{
            headerShown: true,
            title: "Main Menu",
            headerTitle: "Main Menu",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="menu" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerShown: true,
            title: "Profile",
            headerTitle: "Profile",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="logout"
          options={{
            headerShown: false,
            title: "Logout",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="logout" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 35,
    left: 20,
    right: 20,
    elevation: 10, // shadow Android
    backgroundColor: "white",
    borderRadius: 20,
    height: 65,
    shadowColor: "#000", // shadow iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 8,
    borderTopWidth: 0,
    ...Platform.select({
      ios: {
        paddingBottom: 10,
      },
      android: {
        paddingBottom: 5,
      },
    }),
  },
});
