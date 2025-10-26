/** @format */

// styles/loginStyles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  background: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  input: { marginBottom: 15 },
  imagelogo: {
    marginBottom: 5,
    alignSelf: "center",
    width: 200,
    height: 200,
    resizeMode: "contain",
    backgroundColor: "rgba(255,255,255,0.8)", // putih 60% transparan
    borderRadius: 20, // opsional biar agak rounded
    padding: 10, // kasih jarak biar logo nggak nempel tepi background
  },
});
