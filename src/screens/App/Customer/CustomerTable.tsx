/** @format */

import PagingMobile from "@/src/component/PagingMobile";
import { useCustomerContext } from "@/src/context/App/CustomerContext";
import formStyles from "@/src/style/FormStyles";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { Card, FAB, IconButton, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomerTable = () => {
  const {
    customerList,
    setIsForm,
    page,
    setPage,
    totalPage,
    total,
    setSearchText,
    searchText,
    setCustomer,
  } = useCustomerContext();
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
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
              color: "black",
              fontSize: 16,
              backgroundColor: "lightblue",
              flexShrink: 1,
              flexWrap: "wrap", // penting: biar teks panjang turun ke bawah
              width: "100%",
            }}
          >
            {item.complete_name.toUpperCase()}
          </Text>
        }
        style={{
          backgroundColor: "lightblue",
          alignContent: "center",
          marginHorizontal: 1,
          justifyContent: "center",
          paddingHorizontal: 1,
        }}
      />
      <Card.Content
        style={{
          paddingHorizontal: 7,
          borderColor: "lightgray",
          borderWidth: 1,
        }}
      >
        <View
          style={{
            paddingHorizontal: 2,
            borderRadius: 4, // opsional biar rapi
          }}
        >
          <View style={[formStyles.rowTab, { alignItems: "top" }]}>
            <Icon
              name="home"
              size={16}
              color="black"
              style={{ marginLeft: 5, width: "5%", marginVertical: 8 }}
            />
            <Text
              style={{
                color: "black",
                fontSize: 14,
                width: "95%",
                paddingVertical: 5,
                paddingHorizontal: 0,
              }}
            >
              {item.contact_address_complete}
            </Text>
          </View>
          <View style={[formStyles.rowTab, { alignItems: "center" }]}>
            <Icon
              name="phone"
              size={16}
              color="black"
              style={{ marginLeft: 5, width: "5%" }}
            />
            <Text
              style={{
                color: "black",
                fontSize: 14,

                paddingVertical: 5,
                paddingHorizontal: 10,
                width: "40%",
              }}
            >
              {item.phone}
            </Text>
            <Icon
              name="email"
              size={16}
              color="black"
              style={{ marginLeft: 5, width: "4%" }}
            />
            <Text
              style={{
                color: "black",
                fontSize: 14,
                width: "51%",
                paddingVertical: 5,
                paddingHorizontal: 1,
                textAlign: "left",
              }}
            >
              {item.email}
            </Text>
          </View>

          <View
            style={[
              formStyles.rowTab,
              { alignItems: "center", marginBottom: 10 },
            ]}
          >
            {item.x_studio_agreement_signed === true ? (
              <Icon
                name="check"
                size={16}
                backgroundColor="green"
                color="white"
                style={{
                  marginLeft: 5,
                  padding: 2,
                  width: "5%",
                  backgroundColor: "green",
                  borderRadius: 50,
                  textAlign: "center",
                }}
              />
            ) : (
              <Icon
                name="close"
                size={16}
                backgroundColor="red"
                color="white"
                style={{
                  marginLeft: 5,
                  padding: 2,
                  width: "5%",
                  backgroundColor: "red",
                  borderRadius: 50,
                  textAlign: "center",
                }}
              />
            )}
            <Text
              style={{
                color: "black",
                fontSize: 16,
                width: "95%",
              }}
            >
              Agreement Signed{" "}
              {item.x_studio_agreement_signed === true ? "Yes" : "No"}
            </Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions
        style={{
          justifyContent: "flex-end",
          marginVertical: 0,
          paddingVertical: 0,
        }}
      >
        <IconButton
          icon="pencil"
          size={18}
          iconColor="black"
          style={{ marginRight: 5, backgroundColor: "lightblue" }}
          onPress={() => {
            setIsForm(true);
            setCustomer(item);
          }}
        />
      </Card.Actions>
    </Card>
  );
  return (
    <View style={{ flex: 1 }}>
      <Text style={formStyles.Header}>Customers</Text>
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
      <View style={{ height: 650 }}>
        <FlatList
          data={customerList}
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

      <FAB
        icon="plus-circle-outline"
        color="white"
        size="30"
        onPress={() => setIsForm(true)}
        style={formStyles.fabBlue}
      />
    </View>
  );
};

export default CustomerTable;
