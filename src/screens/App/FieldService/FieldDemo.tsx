/** @format */

import SelectModalInput from "@/src/component/SelectModalInput";
import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import formStyles from "@/src/style/FormStyles";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { IconButton, MD2Colors, Text, TextInput } from "react-native-paper";

const FieldDemo = () => {
  const { productDemo, detailDemo, handleAddDemo, handleRemoveDemo } =
    useFieldServiceContext();
  const [demo, setDemo] = useState({
    id: 0,
    product: "",
    ubinan: "",
    rendemen: "",
  });
  return (
    <View style={{ marginTop: 5, marginHorizontal: 5 }}>
      <View style={{ marginBottom: 15 }}>
        <SelectModalInput
          label="Product"
          mode="outlined"
          placeholder="Produknya"
          data={productDemo}
          value={demo.product}
          onSelect={(item) =>
            setDemo((prev) => ({
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
            },
          ]}
        >
          <TextInput
            mode="outlined"
            label="Ubinan"
            keyboardType="decimal-pad"
            style={{ flex: 1, textAlign: "right", width: "45%" }}
            value={demo.ubinan}
            onChangeText={(text) =>
              setDemo((prev) => ({ ...prev, ubinan: text }))
            }
          />
          <TextInput
            mode="outlined"
            label="Rendemen"
            keyboardType="decimal-pad"
            style={{ flex: 1, textAlign: "right", width: "45%" }}
            value={demo.rendemen}
            onChangeText={(text) =>
              setDemo((prev) => ({ ...prev, rendemen: text }))
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
              handleAddDemo(demo);
              setDemo({ id: 0, product: "", ubinan: "", rendemen: "" });
            }}
          />
        </View>
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
            width: "40%",
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
          Ubinan
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            width: "30%",
            textAlign: "center",
          }}
        >
          Rendemen
        </Text>
      </View>
      {detailDemo.map((item, index) => (
        <View
          key={index}
          style={[
            formStyles.rowTab,
            {
              marginBottom: 5,
              borderBottomColor: MD2Colors.grey300,
              borderBottomWidth: 1,
              padding: 5,
              justifyContent: "center",
            },
          ]}
        >
          <Text
            style={{
              fontSize: 17,

              width: "10%",
              textAlign: "center",
            }}
          >
            <IconButton
              icon="trash-can-outline"
              mode="contained"
              backgroundColor={MD2Colors.red900}
              size={18}
              iconColor="white"
              style={{
                borderRadius: 5, // ✅ biar bulat
                backgroundColor: "white", // fallback color
              }}
              onPress={() => {
                Alert.alert("Confirm", "Are you sure to remove this item ?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "OK",
                    onPress: () => {
                      handleRemoveDemo(index);
                    },
                  },
                ]);
              }}
            />
          </Text>
          <Text
            style={{
              fontSize: 17,

              width: "40%",
              paddingLeft: 5,
            }}
          >
            {item.product_name}
          </Text>
          <Text
            style={{
              fontSize: 17,

              width: "22%",
              textAlign: "right",
              paddingRight: 5,
            }}
          >
            {item.x_studio_ubinan}
          </Text>
          <Text
            style={{
              fontSize: 17,
              paddingRight: 5,
              width: "28%",
              textAlign: "right",
            }}
          >
            {item.x_studio_rendemen}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default FieldDemo;
