/** @format */

import { Dimensions, StyleSheet } from "react-native";
import { MD2Colors } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = (screenWidth - 48) / 2;
const formStyles = StyleSheet.create({
  scrollContainer: {
    padding: 5,
    paddingBottom: 1,
    marginBottom: 1,
    backgroundColor: "#fff",
  },
  safecontainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  inputContainer: {
    backgroundColor: "transparent",
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
  },
  input: {
    borderRadius: 5,
    height: 40,
    backgroundColor: "white",
    marginBottom: 10,
  },
  TitleCard: {
    color: "white",
    fontWeight: "bold",
  },

  HeaderCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // warna garis
    paddingBottom: 1, // biar ada jarak antara border dan konten
    marginBottom: 1,
    backgroundColor: MD2Colors.green900,
    textColor: "white", // jarak bawah dari komponen setelahnya
  },

  ButtonSave: {
    backgroundColor: MD2Colors.green900,
    color: "yellow",
    fontWeight: "bold",
    borderRadius: 10,
    marginTop: 10,
  },
  ButtonCancel: {
    marginTop: 10,
    backgroundColor: MD2Colors.red900,
    borderRadius: 10,
    fontWeight: "bold",
    color: "white",
  },
  ButtonWarning: {
    marginTop: 10,
    backgroundColor: MD2Colors.yellow900,

    borderRadius: 5,
  },
  ButtonInfo: {
    marginTop: 10,
    backgroundColor: MD2Colors.blue900,
    color: "yellow",

    borderRadius: 10,
  },
  CardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // warna garis
    paddingBottom: 1, // biar ada jarak antara border dan konten
    marginBottom: 1,
    backgroundColor: MD2Colors.green900,
    textColor: "white", // jarak bawah dari komponen setelahnya
  },
  CardHeaderBlue: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // warna garis
    paddingBottom: 1, // biar ada jarak antara border dan konten
    marginBottom: 1,
    backgroundColor: MD2Colors.blue900,
    textColor: "white", // jarak bawah dari komponen setelahnya
  },
  CardHeaderOrange: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // warna garis
    paddingBottom: 1, // biar ada jarak antara border dan konten
    marginBottom: 1,
    backgroundColor: MD2Colors.orange900,
    textColor: "white", // jarak bawah dari komponen setelahnya
  },
  CardHeaderGreen: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // warna garis
    paddingBottom: 1, // biar ada jarak antara border dan konten
    marginBottom: 1,
    backgroundColor: MD2Colors.green500,
    textColor: "white", // jarak bawah dari komponen setelahnya
  },
  CardHeaderRed: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // warna garis
    paddingBottom: 1, // biar ada jarak antara border dan konten
    marginBottom: 1,
    backgroundColor: MD2Colors.red900,
    textColor: "white",
  },
  CardHeaderBlack: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // warna garis
    paddingBottom: 1, // biar ada jarak antara border dan konten
    marginBottom: 1,
    backgroundColor: "#000",
    textColor: "white",
  },
  CardContent: {
    backgroundColor: MD2Colors.white,
    margin: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 2,
    elevation: 10,
    borderTopWidth: 0,
  },
  HomeContainer: {
    padding: 5,
    marginTop: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  HomeCardWrap: {
    marginBottom: 16,
    backgroundColor: "#fff",
    width: CARD_WIDTH,
  },
  HomeCard: {
    borderRadius: 16,
    elevation: 4,
  },
  HomeCardContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    backgroundColor: MD2Colors.brown50,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2, // Meningkatkan opacity shadow
    shadowOffset: {
      width: 0,
      height: 15, // Meningkatkan offset vertikal
    },
    shadowRadius: 20, // Meningkatkan radius shadow
    elevation: 15, // Meningkatkan elevation untuk Android
    borderTopWidth: 0,
    // Tambahan untuk efek lebih dramatis:
    transform: [{ translateY: -3 }], // Sedikit mengangkat komponen
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)", // Border putih transparan
  },
  HomeLabel: {
    margin: 5,
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    backgroundColor: MD2Colors.brown50,
  },
  fab: {
    position: "absolute",
    right: 16,
    fontWeight: "bold",
    bottom: 100,
    backgroundColor: MD2Colors.green700,
    borderRadius: 50,
    width: 56,
    height: 56,
  },
  panel: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 120, // buat ruang agar tidak tertutup FAB
  },
  Card: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 80, // Tinggi minimum
    maxHeight: 200, // Tinggi maksimum (opsional)
    textAlignVertical: "top",

    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  wrapper: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
    paddingBottom: 10, // Biar gak ketutupan FAB
  },
  Header: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: MD2Colors.white,
    backgroundColor: MD2Colors.blue900,
    marginBottom: 10,
  },
  SubHeader: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: MD2Colors.white,
    backgroundColor: MD2Colors.green900,
    textTransform: "capitalize",
    marginBottom: 10,
  },
  SubHeaderLight: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: MD2Colors.white,
    backgroundColor: MD2Colors.green300,
    textTransform: "capitalize",
    marginBottom: 10,
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 10,
    height: 25,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginHorizontal: 5,
    width: "100%",
    flexShrink: 1, // agar tidak memaksa tetap di satu baris
    flexWrap: "wrap", //
    color: "black",
  },
  labelNoWrap: {
    fontSize: 16,
    marginHorizontal: 5,
    color: "black",
    //
  },
  LabelBold: {
    fontSize: 15,
    marginHorizontal: 5,
    fontWeight: "bold",
    color: "black",
  },
  RowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",

    backgroundColor: "#fff",
    marginHorizontal: 0,
  },
  ComponentColomnNumeric: {
    width: "30%",
    flex: 1,
    height: 40,
    marginHorizontal: 5,

    marginRight: 2,
    textAlign: "right",
    backgroundColor: "#fff",
  },
  ComponentColomnText: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  RowLabel: {
    fontSize: 16,

    marginRight: 10,
  },
  text: {
    color: MD2Colors.black,
  },
  Numeric: {
    height: 40,
    marginHorizontal: 5,
    marginBottom: 10,
    marginRight: 2,
    textAlign: "right",
    backgroundColor: "#fff",
  },
  Note: {
    backgroundColor: "#fff",
    minHeight: 100,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 1,
    marginVertical: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: 80,
    height: 80,
    tintColor: "#888",
  },
  instructions: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    padding: 5,
    color: "yellow",
    backgroundColor: MD2Colors.blue800,
    opacity: 0.8,
    fontWeight: "bold",
  },
  spinner: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  radioGroupContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "space-evenly",
  },
  radioButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 30,
  },

  radioText: {
    fontSize: 13,
    marginLeft: 3,
  },
  listitem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 5,
    marginBottom: 1,
  },
  selectedItem: {
    backgroundColor: "#4caf50",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
  fabBlue: {
    position: "absolute",
    bottom: 110,
    right: 20,

    backgroundColor: "blue",
    zIndex: 10,
    elevation: 5,
  },
  rowTab: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "space-between",
    marginRight: 0,

    alignItems: "center",
  },
  row: {
    flexDirection: "row",

    marginRight: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    backgroundColor: "#007AFF",
  },
});

export default formStyles;
