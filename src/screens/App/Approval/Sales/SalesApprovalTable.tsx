/** @format */

import PagingMobile from "@/src/component/PagingMobile";
import { useApprovalContext } from "@/src/context/App/ApprovalContext";
import { formatDateForDisplayWIB, formatNumber } from "@/src/library/Utility";
import React from "react";
import { FlatList, View } from "react-native";
import {
  Card,
  IconButton,
  MD2Colors,
  MD3Colors,
  Text,
  TextInput,
} from "react-native-paper";

function SalesApprovalTable() {
  const {
    listApparoval,
    total,
    totalPage,
    page,
    setPage,
    setIsForm,
    searchText,
    setSearchText,
    handlePageChange,
    setItemSelected,
  } = useApprovalContext();
  const renderItem = ({ item }) => (
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
            {item.name.toUpperCase()} - {item.state.toUpperCase()}
          </Text>
        }
        style={{
          backgroundColor: "blue",
          alignContent: "center",
          marginHorizontal: 1,
          justifyContent: "center",
          paddingHorizontal: 1,
        }}
      />
      <Card.Content style={{ paddingHorizontal: 10, marginBottom: 5 }}>
        <Text style={{ fontWeight: "bold", color: "black" }}>
          Customer: {item.partner_id[1].toUpperCase()}
        </Text>
        <Text style={{ fontWeight: "bold", color: "black" }}>
          Sales Executive : {item.x_studio_sales_executive[1].toUpperCase()}
        </Text>
        <Text style={{ fontWeight: "bold", color: "black" }}>
          Created Date: {formatDateForDisplayWIB(item.create_date)}
        </Text>
        <Text style={{ fontWeight: "bold", color: "black" }}>
          Amount Total: Rp. {formatNumber(item.amount_total)}{" "}
        </Text>
        <Text style={{ fontWeight: "bold", color: "black" }}>
          Price List: {item.pricelist_id[1].toUpperCase()}
        </Text>
        <Text style={{ fontWeight: "bold", color: "black" }}>
          Payment Term: {item.payment_term_id[1].toUpperCase()}
        </Text>
      </Card.Content>
      <Card.Actions
        style={{
          justifyContent: "flex-end",
          paddingHorizontal: 10,
          paddingVertical: 2,
          borderTopColor: MD2Colors.lightBlueA100,
          borderTopWidth: 1,
        }}
      >
        <IconButton
          icon="eye-outline"
          iconColor="white"
          backgroundColor={MD3Colors.primary50}
          size={18}
          onPress={() => {
            setItemSelected(item);
            setIsForm(true);
            // handle approval logic here
          }}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        mode="outlined"
        label="Search"
        value={searchText}
        returnKeyType="search"
        onSubmitEditing={(text) => {
          setSearchText(text.nativeEvent.text);
        }}
        onChangeText={(text) => setSearchText(text)}
        style={{ marginHorizontal: 10 }}
      />
      <View style={{ flex: 1, marginBottom: 35 }}>
        <FlatList
          data={listApparoval}
          renderItem={renderItem}
          style={{ marginTop: 5, marginHorizontal: 10 }}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
        />
        <PagingMobile
          style={{ marginBottom: 100 }}
          currentPage={page}
          totalPage={totalPage}
          onPageChange={(pg) => handlePageChange(pg)}
        />
      </View>
    </View>
  );
}

export default SalesApprovalTable;
