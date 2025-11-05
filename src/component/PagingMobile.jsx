/** @format */

import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { IconButton } from "react-native-paper";

const PagingMobile = ({ currentPage = 1, totalPage = 1, onPageChange }) => {
  const [jumpPage, setJumpPage] = useState("");

  const handleJump = () => {
    const page = parseInt(jumpPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPage) {
      onPageChange(page);
      setJumpPage("");
    }
  };

  return (
    <View style={styles.row}>
      {/* Tombol ke halaman sebelumnya */}
      <IconButton
        icon="chevron-left"
        mode="contained-tonal"
        size={28}
        onPress={() => {
          if (currentPage > 1) onPageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
      />

      {/* Info halaman */}
      <View style={styles.pageContainer}>
        <View style={styles.currentPageBadge}>
          <Text style={styles.currentPageText}>{currentPage}</Text>
        </View>
        <Text style={styles.totalPageText}> / {totalPage}</Text>
      </View>

      {/* Tombol ke halaman berikutnya */}
      <IconButton
        icon="chevron-right"
        mode="contained-tonal"
        size={28}
        onPress={() => {
          if (currentPage < totalPage) onPageChange(currentPage + 1);
        }}
        disabled={currentPage === totalPage}
      />

      {/* Input halaman */}
      <TextInput
        style={styles.input}
        placeholder="Page"
        value={jumpPage}
        keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
        onChangeText={setJumpPage}
        onSubmitEditing={handleJump}
        returnKeyType="done"
      />

      {/* Tombol “Go” */}
      <IconButton
        icon="arrow-right-bold"
        mode="contained"
        size={28}
        onPress={handleJump}
        disabled={!jumpPage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: 70,
    height: 40,
    borderRadius: 8,
    textAlign: "center",
    marginHorizontal: 5,
  },
  pageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  currentPageBadge: {
    backgroundColor: "#E3F2FD", // biru muda
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  currentPageText: {
    color: "#1976D2", // biru utama
    fontWeight: "bold",
    fontSize: 16,
  },
  totalPageText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    marginLeft: 4,
  },
});

export default PagingMobile;
