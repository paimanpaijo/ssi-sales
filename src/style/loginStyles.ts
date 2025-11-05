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
    backgroundColor: "rgba(1,4,7,0.5)",
  },
  input: { marginBottom: 15 },
  imagelogo: {
    marginVertical: 30,
    alignSelf: "center",
    width: 200,
    height: 200,
    resizeMode: "contain",
    backgroundColor: "rgba(255,255,255,1)", // putih 60% transparan
    borderRadius: 20, // opsional biar agak rounded
    padding: 3, // kasih jarak biar logo nggak nempel tepi background
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    color: "white",
    fontWeight: "bold",
  },
});
