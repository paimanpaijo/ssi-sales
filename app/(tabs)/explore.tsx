/** @format */
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = SCREEN_WIDTH / 4 - 24; // dikurangi margin

const menuItems = [
  { id: "1", title: "Sales Order", icon: "🛒", route: "/sales/", role: "all" },
  {
    id: "2",
    title: "Planning and Actuals",
    icon: "📊",
    route: "/planing/",
    role: "all",
  },
  {
    id: "3",
    title: "Activity Tracking",
    icon: "📦",
    route: "/fieldservice/",
    role: "all",
  },
  { id: "4", title: "Costumer", icon: "👥", route: "/customer", role: "all" },
  {
    id: "5",
    title: "Collection",
    icon: "🧾",
    route: "/invoice/",
    role: "all",
  },
  {
    id: "6",
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
    width: ITEM_SIZE,
    height: ITEM_SIZE + 10,
    margin: 12,
    padding: 5,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
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
