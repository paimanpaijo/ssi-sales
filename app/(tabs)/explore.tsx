/** @format */
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

const menuItems = [
  { id: "1", title: "Sales Order", icon: "📊", route: "/sales/", role: "all" },
  {
    id: "2",
    title: "Activity Tracking",
    icon: "📦",
    route: "/fieldservice/",
    role: "all",
  },
  { id: "3", title: "Customer", icon: "👥", route: "/customer", role: "all" },
  {
    id: "4",
    title: "Approved PO",
    icon: "📋",
    route: "/check",
    role: "district sales manager",
  },
];

export default function ExploreScreen() {
  const { user } = useAuth();
  const jobTitle = user?.job_title?.toLowerCase() ?? "";

  const filteredMenu = menuItems.filter(
    (item) => item.role === jobTitle || item.role === "all"
  );

  return (
    <FlatList
      backgroundColor={""}
      showsVerticalScrollIndicator={true}
      data={filteredMenu}
      numColumns={4} // grid 2 kolom
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(item.route)}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 1,
  },
  card: {
    flex: 1,
    margin: 12,
    padding: 5,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // shadow android
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  icon: {
    fontSize: 15,
    marginBottom: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
