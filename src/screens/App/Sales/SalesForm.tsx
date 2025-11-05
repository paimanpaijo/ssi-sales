/** @format */

import FormHeader from "@/src/component/FormHeader";
import SelectModalInput from "@/src/component/SelectModalInput";

import { useSalesOrderContext } from "@/src/context/App/SalesOrderContext";
import { formatNumber } from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import React, { useState } from "react";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";

import {
  Card,
  IconButton,
  MD2Colors,
  Text,
  TextInput,
} from "react-native-paper";

const SalesForm = () => {
  const {
    customerList,
    priceList,
    productList,
    paymentTermList,
    setIsForm,
    setCustomer,
    paymentTerm,
    setPaymentTerm,
    orderList,
    handleAddOrder,
    discRet,
    discFarm,
    setDiscRet,
    setDiscFarm,
    disc,
    setDisc,
    totalDisc,
    totalPrice,
    netPrice,
    handleDelete,
    price,

    setPrice,
    handleSubmit,
  } = useSalesOrderContext();
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState("");

  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }) => <Text>{item.name}</Text>;

  const renderItemOrder = ({ item }) => (
    <Card style={{ margin: 1 }}>
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
            {item.product_name}
          </Text>
          <IconButton
            icon="delete"
            size={20}
            iconColor="black"
            onPress={() => handleDelete(item)} // tambahkan aksi hapus di sini
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 2,
            borderRadius: 4,
          }}
        >
          <Text>
            Price :{" "}
            <Text style={{ fontWeight: "bold" }}>
              {formatNumber(item.price_unit)}
            </Text>
          </Text>
          <Text>
            Qty : <Text style={{ fontWeight: "bold" }}>{item.quantity}</Text>
          </Text>

          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {formatNumber(item.quantity * item.price_unit)}
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
            paddingHorizontal: 2,
            borderRadius: 4,
          }}
        >
          <Text>
            Disc. :{" "}
            <Text style={{ fontWeight: "bold" }}>{item.ttldiscount} %</Text>
          </Text>

          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {formatNumber(
                item.quantity * item.price_unit * (item.ttldiscount / 100)
              )}
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
            paddingHorizontal: 2,
            borderRadius: 4,
          }}
        >
          <Text>Net Price</Text>
          <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>
            {formatNumber(item.total)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <>
      <FormHeader
        title="Sales Order"
        onClose={() => {
          Alert.alert("Confirm", "Are you sure to cancel order ?", [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => setIsForm(false),
            },
          ]);
        }}
        onSave={() => handleSubmit()}
        backgroundColor="#0d6efd"
        textColor="white"
      />
      <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
        <SelectModalInput
          data={customerList}
          onSelect={(itm) => {
            setCustomer(itm);
          }}
          label="Customer Name"
          placeholder="Customer Name"
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
                Customer Name
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
              <Text style={{ fontSize: 16, fontWeight: "bold", width: "80%" }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 16, width: "20%", textAlign: "right" }}>
                {item.x_studio_type}
              </Text>
            </TouchableOpacity>
          )}
          renderFooter={(close) => (
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                onPress={close}
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
        <SelectModalInput
          data={priceList}
          onSelect={(itm) => {
            setPrice(itm);
            setDiscRet(itm.x_studio_disc_retailer.toString());
            setDiscFarm(itm.x_studio_disc_farmer.toString());
          }}
          label="Price List"
          placeholder="Price List"
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
              <Text style={{ color: "white", fontSize: 18 }}>Price List</Text>
              <TouchableOpacity onPress={close}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Tutup ✕
                </Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={(item, onSelect) => (
            <>
              <View
                style={[
                  formStyles.rowTab,
                  { backgroundColor: "#0d6efd", marginTop: 15, padding: 5 },
                ]}
              >
                <Text style={{ fontSize: 16, color: "white", width: "35%" }}>
                  Pricelist
                </Text>
                <Text style={{ fontSize: 16, color: "white", width: "25%" }}>
                  Type
                </Text>
                <Text style={{ fontSize: 16, color: "white", width: "20%" }}>
                  Retailer
                </Text>
                <Text style={{ fontSize: 16, color: "white", width: "20%" }}>
                  Farmer
                </Text>
              </View>
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
                <Text style={{ fontSize: 14, width: "35%" }}>{item.label}</Text>
                <Text style={{ fontSize: 14, width: "25%" }}>
                  {item.x_studio_type}
                </Text>
                <Text
                  style={{ fontSize: 14, width: "20%", textAlign: "right" }}
                >
                  {item.x_studio_disc_retailer}
                </Text>
                <Text
                  style={{ fontSize: 14, width: "20%", textAlign: "right" }}
                >
                  {item.x_studio_disc_farmer}
                </Text>
              </TouchableOpacity>
            </>
          )}
          renderFooter={(close) => (
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                onPress={close}
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

        <View
          style={{
            flexDirection: "row",
            marginRight: 8,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SelectModalInput
            data={paymentTermList}
            onSelect={(itm) => {
              setPaymentTerm(itm);
              setDisc(itm.discount_percentage);
            }}
            label="Payment Term"
            placeholder="Payment Term"
            style={{
              container: { width: "50%" },
            }}
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
                  Payment Term
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
                <Text style={{ fontSize: 16 }}>{item.label}</Text>
                <Text style={{ fontSize: 16 }}>
                  {item.discount_percentage + "%"}
                </Text>
              </TouchableOpacity>
            )}
            renderFooter={(close) => (
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  onPress={close}
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
            modalProps={{ animationType: "slide", transparent: false }}
          />

          <TextInput
            label="Discount (%)"
            placeholder="Discount"
            mode="outlined"
            value={disc ? disc.toString() : "0"} // ✅ pastikan string
            editable={false}
            textAlign="right"
            right={<TextInput.Affix text="%" />}
            style={{
              height: 40,
              marginTop: 0,

              textAlign: "right",
              marginLeft: 10,
              marginRight: 20,
              width: "49%",
            }}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <TextInput
            label="Retailer Disc.(%)"
            mode="outlined"
            textAlign="right"
            keyboardType="numeric" // ✅ menampilkan keyboard angka
            value={discRet}
            right={<TextInput.Affix text="%" />}
            onChangeText={(text) => setDiscRet(text)} // ✅ hanya angka
            style={{
              marginBottom: 10,
              height: 40,
              width: "50%",
              textAlign: "right",
            }}
          />
          <TextInput
            label="Farmer. Disc.(%)"
            mode="outlined"
            textAlign="right"
            keyboardType="numeric" // ✅ menampilkan keyboard angka
            value={discFarm}
            right={<TextInput.Affix text="%" />}
            onChangeText={(text) => setDiscFarm(text)} // ✅ hanya angka
            style={{
              marginBottom: 10,
              height: 40,
              width: "50%",
              textAlign: "right",
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <SelectModalInput
            data={productList}
            onSelect={(itm) => setProduct(itm)}
            label="Product"
            placeholder="Product"
            style={{
              container: { width: "65%", marginRight: 8 },
            }}
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
                  Payment Term
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
                <Text style={{ fontSize: 16 }}>{item.label}</Text>
              </TouchableOpacity>
            )}
            renderFooter={(close) => (
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  onPress={close}
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
            modalProps={{ animationType: "slide", transparent: false }}
          />

          <TextInput
            label="Qty"
            mode="outlined"
            textAlign="right"
            keyboardType="numeric" // ✅ menampilkan keyboard angka
            value={quantity}
            onChangeText={(text) => setQuantity(text.replace(/[^0-9]/g, ""))} // ✅ hanya angka
            style={{
              marginBottom: 10,
              height: 40,
              width: "20%",
              textAlign: "right",
            }}
          />

          <IconButton
            icon="cart-plus"
            iconColor="white" // warna ikon
            containerColor="green" // background color (bukan 'color')
            size={24}
            style={{
              borderRadius: 5, // ✅ biar bulat
              backgroundColor: "green", // fallback color
            }}
            onPress={() => {
              handleAddOrder(product, quantity);
              setProduct("");
              setQuantity("");
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",

            padding: 5,
            backgroundColor: MD2Colors.blue900,
          }}
        >
          <Text style={{ color: "white", width: "25%", textAlign: "center" }}>
            Total Price
          </Text>
          <Text style={{ color: "white", width: "25%", textAlign: "center" }}>
            Total Disc
          </Text>

          <Text style={{ color: "white", width: "25%", textAlign: "center" }}>
            Net Price
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",

            padding: 5,
          }}
        >
          <Text
            style={{
              color: "black",
              width: "25%",
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            {formatNumber(totalPrice)}
          </Text>
          <Text
            style={{
              color: "black",
              width: "25%",
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            {totalPrice !== 0
              ? formatNumber(((totalPrice - netPrice) / totalPrice) * 100) +
                " %"
              : "0 %"}
          </Text>

          <Text
            style={{
              color: "black",
              width: "25%",
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            {formatNumber(netPrice)}
          </Text>
        </View>
        <View style={{ maxHeight: 400 }}>
          <FlatList
            data={orderList}
            renderItem={renderItemOrder}
            keyExtractor={(item) => item.key}
          />
        </View>
      </View>
    </>
  );
};

export default SalesForm;
