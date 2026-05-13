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
const ITEM_SIZE = SCREEN_WIDTH / 3 - 24; // dikurangi margin

const menuItems = [
  {
    id: "1",
    title: "Sales Order",
    icon: "🛒",
    route: "/sales/",
    role: "district sales manager,sales manager,sales executive",
  },
  {
    id: "2",
    title: "Planning & Actuals",
    icon: "📊",
    route: "/planing/",
    role: "district sales manager,sales manager,sales executive",
  },
  {
    id: "3",
    title: "Activity Tracking",
    icon: "🛻",
    route: "/fieldservice/",
    role: "district sales manager,sales manager,sales executive",
  },
  {
    id: "4",
    title: "Demo Management",
    icon: "🗓️",
    route: "/demomanagement/",
    role: "district sales manager,sales manager,sales executive",
  },
  {
    id: "5",
    title: "Costumer",
    icon: "👥",
    route: "/customer",
    role: "district sales manager,sales manager,sales executive",
  },
  {
    id: "6",
    title: "Collection",
    icon: "🧾",
    route: "/invoice/",
    role: "district sales manager,sales manager,sales executive",
  },
  {
    id: "7",
    title: "Approval Sales Order",
    icon: "📋",
    route: "/approval/",
    role: "district sales manager,sales manager,president director",
  },
];

export default function ExploreScreen() {
  const { user } = useAuth();
  const jobTitle = user?.job_title?.toLowerCase() ?? "";

  const filteredMenu = menuItems.filter(
    (item) => item.role.split(",").includes(jobTitle) || item.role === "all",
  );

  return (
    <FlatList
      backgroundColor={""}
      showsVerticalScrollIndicator={true}
      data={filteredMenu}
      numColumns={3} // grid 2 kolom
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
    fontSize: 35,
    marginBottom: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
