/** @format */

import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

export default function MonthYearPickerModal({
  visible,
  onDismiss,
  onConfirm,
}) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
          Select Month and Year
        </Text>

        <Text>Month</Text>
        <FlatList
          data={months}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSelectedMonth(index)}
              style={{
                padding: 10,
                margin: 5,
                backgroundColor:
                  selectedMonth === index ? "#6200ee" : "#f0f0f0",
                borderRadius: 8,
                width: "30%",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: selectedMonth === index ? "#fff" : "#000" }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Text style={{ marginTop: 15 }}>Year</Text>
        <FlatList
          data={years}
          keyExtractor={(item) => item.toString()}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedYear(item)}
              style={{
                padding: 10,
                margin: 5,
                backgroundColor: selectedYear === item ? "#6200ee" : "#f0f0f0",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: selectedYear === item ? "#fff" : "#000" }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            onPress={() => {
              const selectedDate = new Date(selectedYear, selectedMonth);
              onConfirm(selectedDate);
              onDismiss();
            }}
          >
            OK
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
