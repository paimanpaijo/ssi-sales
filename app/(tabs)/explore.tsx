/** @format */
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

const menuItems = [
  { id: "1", title: "Sales Order", icon: "📊", route: "/sales/" },
  { id: "2", title: "Activity Tracking", icon: "📦", route: "/fieldservice/" },
  { id: "3", title: "Customer", icon: "👥", route: "/customers" },
  // { id: "5", title: "Reports", icon: "📑", route: "//report" },
];

export default function ExploreScreen() {
  return (
    <FlatList
      backgroundColor={""}
      showsVerticalScrollIndicator={true}
      data={menuItems}
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
