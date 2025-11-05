/** @format */

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  background: {
    flex: 1,
    height: "50%",
    width: "100%",

    resizeMode: "cover",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});
