/** @format */

import SelectModalInput from "@/src/component/SelectModalInput";
import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import formStyles from "@/src/style/FormStyles";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { IconButton, MD2Colors, Text, TextInput } from "react-native-paper";

const FieldDirectSelling = () => {
  const {
    productDemo,
    addDirectSelling,
    removeDirectSelling,
    detailDirect,
    handleAddDirect,
    handleRemoveDirectSelling,
  } = useFieldServiceContext();
  const [directSelling, setDirectSelling] = useState({
    id: 0,
    product: "",
    quantity: "",
  });

  return (
    <View style={{ marginTop: 5, marginHorizontal: 5 }}>
      <View
        style={[
          formStyles.rowTab,
          {
            marginBottom: 15,
          },
        ]}
      >
        <View style={{ width: "60%" }}>
          <SelectModalInput
            label="Product"
            mode="outlined"
            placeholder="Produk"
            data={productDemo}
            value={directSelling.product}
            onSelect={(value) =>
              setDirectSelling((prev) => ({
                ...prev,
                product: value.label,
                id: value.id,
              }))
            }
          />
        </View>

        <TextInput
          mode="outlined"
          label="Qty(Kg)"
          keyboardType="decimal-pad"
          style={{ flex: 1, textAlign: "right", width: "33%" }}
          value={directSelling.quantity}
          onChangeText={(text) =>
            setDirectSelling((prev) => ({
              ...prev,
              quantity: text,
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
          }}
          onPress={() => {
            handleAddDirect(directSelling);
            setDirectSelling({ id: 0, product: "", quantity: "" });
          }}
        />
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
            width: "70%",
            textAlign: "center",
          }}
        >
          Product{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            width: "30%",
            textAlign: "center",
          }}
        >
          Qty(Kg)
        </Text>
      </View>

      {detailDirect.map((item, index) => (
        <View
          style={[
            formStyles.rowTab,
            {
              borderBottomColor: MD2Colors.grey300,
              borderBottomWidth: 1,
              paddingVertical: 1,
              marginBottom: 1,
              justifyContent: "center",
            },
          ]}
          key={index}
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
                    handleRemoveDirectSelling(index);
                  },
                },
              ])
            }
          />

          <Text
            style={{
              fontSize: 17,
              width: "60%",
              textAlign: "left",
            }}
          >
            {item.product_name}
          </Text>
          <Text
            style={{
              fontSize: 17,
              width: "30%",
              textAlign: "right",
              paddingRight: 10,
            }}
          >
            {item.x_studio_quantity}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default FieldDirectSelling;
