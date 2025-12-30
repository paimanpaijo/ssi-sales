/** @format */

import SelectModalInput from "@/src/component/SelectModalInput";
import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import formStyles from "@/src/style/FormStyles";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IconButton, MD2Colors, TextInput } from "react-native-paper";

const FieldStockProduct = () => {
  const {
    productDemo,
    productStock,
    setProductStock,
    handleAddStockProduct,
    productStocks,
    handleRemoveStockProduct,
  } = useFieldServiceContext();
  console.log("productStock", productStocks);
  return (
    <View style={{ marginTop: 5, marginHorizontal: 5 }}>
      <View style={{ marginBottom: 15, marginHorizontal: 5 }}>
        <SelectModalInput
          label="Product"
          mode="outlined"
          placeholder="Produk"
          data={productDemo}
          //lue={demo.product}
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
              <Text style={{ color: "white", fontSize: 18 }}>Product</Text>
              <TouchableOpacity onPress={close}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Close ✕
                </Text>
              </TouchableOpacity>
            </View>
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
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          )}
          onSelect={(item) =>
            setProductStock((prev) => ({
              ...prev,
              product: item.label,
              id: item.value,
            }))
          }
        />
        <View
          style={[
            formStyles.rowTab,
            {
              marginBottom: 5,
              verticalAlign: "middle",
            },
          ]}
        >
          <TextInput
            mode="outlined"
            label="Stock (Kg)"
            placeholder="Stock (Kg)"
            style={{ width: "40%" }}
            value={productStock.stock}
            keyboardType="numeric"
            onChange={(text) =>
              setProductStock((prev) => ({
                ...prev,
                stock: text.nativeEvent.text,
              }))
            }
          />
          <TextInput
            mode="outlined"
            label="Sold"
            placeholder="Sold"
            value={productStock.sale}
            keyboardType="numeric"
            style={{ width: "40%", marginLeft: 10 }}
            onChange={(text) =>
              setProductStock((prev) => ({
                ...prev,
                sale: text.nativeEvent.text,
              }))
            }
          />
          <IconButton
            icon="plus-circle-outline"
            iconColor="white" // warna ikon
            containerColor="green" // background color (bukan 'color')
            size={24}
            style={{
              borderRadius: 5, // ✅ biar bulat
              backgroundColor: "green", // fallback color
              height: 45,
            }}
            onPress={() => {
              // handleAddDirect(directSelling);
              handleAddStockProduct();
            }}
          />
        </View>

        <View
          style={[
            formStyles.rowTab,
            {
              marginBottom: 5,
            },
          ]}
        ></View>
      </View>
      <View
        style={[
          formStyles.rowTab,
          {
            marginBottom: 5,
            backgroundColor: MD2Colors.green100,
            padding: 5,
            justifyContent: "center",
          },
        ]}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            width: "50%",
            textAlign: "center",
          }}
        >
          Product
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            width: "25%",
            textAlign: "center",
          }}
        >
          Stock
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            width: "25%",
            textAlign: "center",
          }}
        >
          Sold
        </Text>
      </View>
      {productStocks.map((item, index) => (
        <View
          key={index}
          style={[
            formStyles.rowTab,
            {
              marginBottom: 5,
            },
          ]}
        >
          <IconButton
            icon="trash-can-outline"
            mode="contained"
            backgroundColor={MD2Colors.red900}
            size={15}
            style={{ width: "10%" }}
            iconColor="white"
            onPress={() =>
              Alert.alert("Confirm", "Are you sure to delete ?", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    handleRemoveStockProduct(index);
                  },
                },
              ])
            }
          />
          <Text style={{ width: "50%" }}>{item.product_name}</Text>
          <Text style={{ width: "25%", textAlign: "center" }}>
            {item.x_studio_stock}
          </Text>
          <Text style={{ width: "25%", textAlign: "center" }}>
            {item.x_studio_sale}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default FieldStockProduct;
