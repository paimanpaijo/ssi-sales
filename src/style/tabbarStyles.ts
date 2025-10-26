/** @format */

import { Platform, StyleSheet } from "react-native";
export default StyleSheet.create({
  position: "absolute",
  bottom: 20,
  left: 20,
  right: 20,
  elevation: 10, // shadow Android
  backgroundColor: "white",
  borderRadius: 30,
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
});
