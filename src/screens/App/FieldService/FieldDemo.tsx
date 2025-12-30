/** @format */

import SelectModalInput from "@/src/component/SelectModalInput";
import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import { formatDateIDN } from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import React, { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { IconButton, MD2Colors, Text, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

const FieldDemo = () => {
  const { productDemo, detailDemo, handleAddDemo, handleRemoveDemo } =
    useFieldServiceContext();
  const [demo, setDemo] = useState({
    id: 0,
    product: "",
    ubinan: 0,
    rendemen: 0,
    plant_date: new Date(),
  });
  const [tempDate, setTempDate] = useState(new Date());
  const [visibleDate, setVisibleDate] = useState(false);

  return (
    <View style={{ marginTop: 5, marginHorizontal: 5 }}>
      <View style={{ marginBottom: 15 }}>
        <SelectModalInput
          label="Product"
          mode="outlined"
          placeholder="Produk"
          data={productDemo}
          value={demo.product}
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
            value={formatDateIDN(demo.plant_date)}
            mode="outlined"
            label="Plant Date"
            showSoftInputOnFocus={false}
            onFocus={() => {
              const baseDate = demo.plant_date ? demo.plant_date : new Date();
              setTempDate(baseDate);
              setVisibleDate(true);
            }}
            style={{ backgroundColor: "white", width: "85%", height: 45 }}
          />
          <DatePickerModal
            locale="id"
            mode="single"
            visible={visibleDate}
            date={tempDate}
            onDismiss={() => setVisibleDate(false)}
            onConfirm={({ date }) => {
              setVisibleDate(false);

              setTempDate(date);
              setDemo((prev) => ({
                ...prev,
                plant_date: date,
              }));
            }}
          />
          <IconButton
            icon="plus-circle-outline"
            iconColor="white" // warna ikon
            containerColor="green" // background color (bukan 'color')
            size={24}
            style={{
              borderRadius: 5, // ✅ biar bulat
              backgroundColor: "green",
              width: 45,
              height: 40,
              marginTop: 10, // fallback color
            }}
            onPress={() => {
              handleAddDemo(demo);
              setDemo({
                id: 0,
                product: "",
                ubinan: 0,
                rendemen: 0,
                plant_date: new Date(),
              });
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
            width: "60%",
            textAlign: "center",
          }}
        >
          Product
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            width: "40%",
            textAlign: "center",
          }}
        >
          Plant Date
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

              width: "50%",
              paddingLeft: 5,
            }}
          >
            {item.product_name}
          </Text>
          <Text
            style={{
              fontSize: 17,

              width: "40%",
              textAlign: "center",
            }}
          >
            {formatDateIDN(item.x_studio_plant_date)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default FieldDemo;
