/** @format */

import MonthYearPickerModal from "@/src/component/MonthYearPickerModal";
import { useSalesOrderContext } from "@/src/context/App/SalesOrderContext";
import { formatDateIDN, formatNumber } from "@/src/library/Utility";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Card, FAB, Text } from "react-native-paper";

const SalesTable = () => {
  const {
    setIsForm,
    selectedDate,
    setSelectedDate,
    setSelectMonth,
    setSelectYear,
    salesorderList,
    page,
    setPage,
    totalPage,
    total,
  } = useSalesOrderContext();
  const [showPicker, setShowPicker] = useState(false);
  const renderItemOrder = ({ item, index }) => (
    <Card style={{ paddingHorizontal: 3, marginBottom: 5 }}>
      <Card.Content style={{ paddingHorizontal: 2 }}>
        <View
          style={{
            flexDirection: "row", //  bikin elemen sejajar kiri-kanan
            justifyContent: "space-between", //  beri jarak maksimal di antara elemen
            alignItems: "center", //  sejajarkan vertikal di tengah
            backgroundColor: "lightblue",

            paddingHorizontal: 2,
            borderRadius: 4, // opsional biar rapi
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: 16,
              backgroundColor: "lightblue",
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            Sales Order :{" "}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: 16,
              backgroundColor: "lightblue",
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            {item.no_sales_order}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            Order Date :{" "}
            <Text style={{ fontWeight: "bold" }}>
              {formatDateIDN(item.tanggal_order)}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            Customer :{" "}
            <Text style={{ fontWeight: "bold" }}>{item.customer_name}</Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            Payment Term :{" "}
            <Text style={{ fontWeight: "bold" }}>{item.payment_term_name}</Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>Nominal</Text>
          <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>
            {formatNumber(item.total_pembayaran)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>Status</Text>
          <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>
            {item.state_label}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 15 }}>
        <Button
          mode="contained-tonal"
          onPress={() => setShowPicker(true)}
          style={{
            marginTop: 10,
            borderRadius: 10,
          }}
          icon={"calendar-month"}
        >
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Button>

        <MonthYearPickerModal
          visible={showPicker}
          onDismiss={() => setShowPicker(false)}
          onConfirm={(date) => {
            setSelectedDate(date);
            setSelectMonth(date.getMonth() + 1);
            setSelectYear(date.getFullYear());
          }}
        />
      </View>
      <View style={{ maxHeight: 700 }}>
        <FlatList
          data={salesorderList}
          renderItem={renderItemOrder}
          style={{ marginTop: 5, marginHorizontal: 10 }}
          keyExtractor={(item, index) =>
            item.id?.toString() || item.no_sales_order || index.toString()
          }
        />
      </View>

      <FAB
        icon="plus-circle-outline"
        color="white"
        size="30"
        onPress={() => setIsForm(true)}
        style={{
          position: "absolute",
          bottom: 50,
          right: 20,

          backgroundColor: "blue",
          zIndex: 10,
          elevation: 5,
        }}
      />
    </View>
  );
};

export default SalesTable;
