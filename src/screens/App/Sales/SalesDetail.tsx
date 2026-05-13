/** @format */

import { getSalesDetail } from "@/src/api/transaksi/SalesAPI";
import { useSalesOrderContext } from "@/src/context/App/SalesOrderContext";
import { formatDateForDisplayWIB, formatNumber } from "@/src/library/Utility";
import React, { useEffect } from "react";
import { Alert, Text, View } from "react-native";
import { Card, IconButton, MD2Colors, TextInput } from "react-native-paper";

const SalesDetail = () => {
  const {
    selectItem,
    setSalesDetail,
    salesDetail,
    setIsFormDetail,
    setSelectItem,
  } = useSalesOrderContext();
  console.log(selectItem);
  useEffect(() => {
    if (!selectItem) {
      return;
    }
    getSalesDetail(selectItem.id).then((res) => {
      console.log(res);
      setSalesDetail(res.order_lines);
    });
  }, []);
  return (
    <Card
      style={{ paddingHorizontal: 0, marginBottom: 10, marginHorizontal: 5 }}
    >
      <Card.Title
        title={
          <Text
            numberOfLines={0} // biar teks boleh lebih dari 1 baris
            style={{
              fontWeight: "bold",
              color: "white",
              fontSize: 16,
              backgroundColor: "blue",
              flexShrink: 1,
              flexWrap: "wrap", // penting: biar teks panjang turun ke bawah
              width: "100%",
            }}
          >
            {selectItem.no_sales_order.toUpperCase()}
          </Text>
        }
        right={(props) => (
          <IconButton
            {...props}
            icon="close"
            iconColor="white"
            onPress={() => {
              Alert.alert("Confirmation", "Are you sure you want to close?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Close",
                  onPress: () => {
                    setIsFormDetail(false);
                    setSalesDetail([]);
                    setSelectItem(null);
                  },
                },
              ]);
            }}
          />
        )}
        style={{
          backgroundColor: "blue",
          alignContent: "center",
          marginHorizontal: 1,
          justifyContent: "center",
          paddingHorizontal: 1,
        }}
      />
      <Card.Content style={{ paddingHorizontal: 10, marginBottom: 5 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontWeight: "bold", color: "black" }}>
            Customer: {selectItem.customer_name.toUpperCase()}
          </Text>
          <Text style={{ color: "black" }}>
            Payment Term : {selectItem.payment_term_name}
          </Text>
          <Text style={{ color: "black" }}>
            Created Date: {formatDateForDisplayWIB(selectItem.tanggal_order)}
          </Text>
          <Text style={{ fontWeight: "bold", color: "black" }}>
            Amount Total: Rp. {formatNumber(selectItem.total_pembayaran)}
          </Text>
          <Text style={{ color: "black" }}>
            Price List: {selectItem.price_list}
          </Text>
          <Text>Status : {selectItem.state_label.toUpperCase()}</Text>

          <TextInput
            label="Note"
            mode="outlined"
            disabled
            multiline
            numberOfLines={3}
            style={{ backgroundColor: "white", marginBottom: 10, height: 80 }}
            value={selectItem.note || ""}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",

            paddingVertical: 10,
            paddingHorizontal: 10,
            marginHorizontal: -10,
            backgroundColor: MD2Colors.blue900,
          }}
        >
          <Text
            style={{
              color: "white",
              width: "25%",
              textAlign: "center",
              fontSize: 13.5,
              fontWeight: "bold",
            }}
          >
            Product
          </Text>
          <Text
            style={{
              color: "white",
              width: "17%",
              textAlign: "center",
              fontSize: 13.5,
              fontWeight: "bold",
            }}
          >
            Price
          </Text>
          <Text
            style={{
              color: "white",
              width: "15%",
              textAlign: "center",
              fontSize: 13.5,
              fontWeight: "bold",
            }}
          >
            Qty
          </Text>
          <Text
            style={{
              color: "white",
              width: "8%",
              textAlign: "center",
              fontSize: 13.5,
              fontWeight: "bold",
            }}
          >
            Disc
          </Text>

          <Text
            style={{
              color: "white",
              width: "35%",
              textAlign: "center",
              fontSize: 13.5,
              fontWeight: "bold",
            }}
          >
            Net Price
          </Text>
        </View>
        {salesDetail.map((line) => (
          <View
            key={line.id}
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",

              paddingVertical: 10,
              paddingHorizontal: 10,
              marginHorizontal: -10,
              borderBottomColor: MD2Colors.grey500,
              borderBottomWidth: 1,
              backgroundColor: "#eeeaea",
            }}
          >
            <Text
              style={{
                color: "black",
                width: "25%",
                textAlign: "left",
                fontSize: 13.5,
                fontWeight: "bold",
              }}
            >
              {line.product_id[1]}
            </Text>
            <Text
              style={{
                color: "black",
                width: "17%",
                textAlign: "right",
                fontSize: 13.5,
              }}
            >
              {formatNumber(line.price_unit)}
            </Text>
            <Text
              style={{
                color: "black",
                width: "15%",
                textAlign: "right",
                fontSize: 13.5,
              }}
            >
              {formatNumber(line.product_uom_qty)}
            </Text>
            <Text
              style={{
                color: "black",
                width: "8%",
                textAlign: "right",
                fontSize: 13.5,
              }}
            >
              {formatNumber(line.discount)}%
            </Text>

            <Text
              style={{
                color: "black",
                width: "26%",
                textAlign: "right",
                fontSize: 13.5,
              }}
            >
              {formatNumber(line.price_total / line.product_uom_qty)}
            </Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

export default SalesDetail;
