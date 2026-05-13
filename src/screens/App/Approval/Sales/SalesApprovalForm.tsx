/** @format */

import { getCustomerList } from "@/src/api/master/CustomerAPI";
import { getSalesDetail } from "@/src/api/transaksi/SalesAPI";
import SelectModalInput from "@/src/component/SelectModalInput";
import { useApprovalContext } from "@/src/context/App/ApprovalContext";
import { useAuth } from "@/src/context/AuthContext";
import { formatDateForDisplayWIB, formatNumber } from "@/src/library/Utility";
import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import {
  Card,
  IconButton,
  MD2Colors,
  MD3Colors,
  Text,
} from "react-native-paper";

function SalesApprovalForm() {
  const {
    itemSelected,
    setItemSelected,
    setIsForm,

    handleApprove,
    handleNotApprove,
    setDealer,
    dealer,
    note,
    setNote,
  } = useApprovalContext();
  const { user } = useAuth();
  const [salesDetail, setSalesDetail] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    if (!itemSelected) {
      return;
    }
    getSalesDetail(itemSelected.id).then((res) => {
      setSalesDetail(res.order_lines);
    });
    getCustomerList(1, 0, 1, 0, "", "Dealer").then((res) => {
      let cust = [];
      res.data.map((item) => {
        cust.push({
          id: item.id,
          label: item.complete_name,
          value: item.id,
          x_studio_type: item.x_studio_type,
          email: item.email,
          phone: item.phone,
          city: item.city,
        });
      });
      setCustomerList(cust);
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
            {itemSelected.name.toUpperCase()} -{" "}
            {itemSelected.state.toUpperCase()}
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
                    setIsForm(false);
                    setItemSelected(null);
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
            Customer: {itemSelected.partner_id[1].toUpperCase()}
          </Text>
          <Text style={{ color: "black" }}>
            Sales Executive :{" "}
            {itemSelected.x_studio_sales_executive[1].toUpperCase()}
          </Text>
          <Text style={{ color: "black" }}>
            Created Date: {formatDateForDisplayWIB(itemSelected.create_date)}
          </Text>
          <Text style={{ fontWeight: "bold", color: "black" }}>
            Amount Total: Rp. {formatNumber(itemSelected.amount_total)}{" "}
          </Text>
          <Text style={{ color: "black" }}>
            Price List: {itemSelected.pricelist_id[1].toUpperCase()}
          </Text>
          <Text style={{ color: "black" }}>
            Payment Term: {itemSelected.payment_term_id[1].toUpperCase()}
          </Text>
          {user.job_title?.toLowerCase() !== "president director" && (
            <>
              <Text style={{ color: "black" }}>
                Select the DEALER NAME bellow if we wish to process thru them,
                otherwise leave it blank to process by SHRIRAM Need your
                approval to process further
              </Text>

              <SelectModalInput
                data={customerList}
                onSelect={(itm) => {
                  setDealer(itm);
                  setItemSelected({
                    ...itemSelected,
                    x_studio_dealer_processor: [itm.id, itm.label],
                  });
                }}
                selectedValue={
                  itemSelected.x_studio_dealer_processor
                    ? itemSelected.x_studio_dealer_processor[1]
                    : dealer
                      ? dealer.label
                      : ""
                }
                label="Executing dealer"
                placeholder="Executing dealer"
                style={{ container: { marginBottom: 10 } }}
                renderHeader={(close) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#0d6efd",
                      padding: 12,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 18 }}>
                      Executing Dealer List
                    </Text>
                    <TouchableOpacity onPress={close}>
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Tutup ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                renderItem={(item, onSelect) => (
                  <TouchableOpacity
                    onPress={() => onSelect(item)}
                    style={{
                      padding: 15,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomWidth: 1,
                      borderColor: "#eee",
                    }}
                  >
                    <Text
                      style={{ fontSize: 13, fontWeight: "bold", width: "60%" }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{ fontSize: 12, width: "40%", textAlign: "right" }}
                    >
                      {item.city}
                    </Text>
                  </TouchableOpacity>
                )}
                renderFooter={(close) => (
                  <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={close}
                      selectedValue={
                        itemSelected?.x_studio_dealer
                          ? itemSelected.x_studio_dealer[1]?.toUpperCase()
                          : dealer
                      }
                      style={{
                        backgroundColor: "#0d6efd",
                        padding: 12,
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Tutup
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </>
          )}
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
      <Card.Actions
        style={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 2,
          borderTopColor: MD2Colors.lightBlueA100,
          borderTopWidth: 1,
        }}
      >
        <View style={{ alignItems: "center", marginHorizontal: 1 }}>
          <IconButton
            icon="check"
            iconColor="white"
            containerColor={MD3Colors.primary50}
            size={18}
            onPress={handleApprove}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: MD3Colors.primary50,
            }}
          >
            Approve
          </Text>
        </View>

        <View style={{ alignItems: "center", marginHorizontal: 1 }}>
          <IconButton
            icon="cancel"
            iconColor="white"
            containerColor={MD3Colors.error50}
            size={18}
            onPress={handleNotApprove}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: MD3Colors.error50,
            }}
          >
            Reject
          </Text>
        </View>
      </Card.Actions>
    </Card>
  );
}

export default SalesApprovalForm;
