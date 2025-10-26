/** @format */

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212", // biar gelap elegan
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardText: {
    marginTop: 8,
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
