/** @format */

import FormHeader from "@/src/component/FormHeader";
import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import { formatNumber } from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import loginStyles from "@/src/style/loginStyles";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import FieldDemo from "./FieldDemo";
import FieldDirectSelling from "./FieldDirectSelling";
import FieldPhoto from "./FieldPhoto";

const FieldServiceCheckOut = () => {
  const {
    setIsFormEdit,
    handleCheckOut,
    fieldServiceData,
    handleOnChangeData,
    attendance,
    area,
    setAttendance,
    setArea,
    productDemo,
  } = useFieldServiceContext();
  const [activeTab, setActiveTab] = useState("foto");

  const [demo, setDemo] = useState({
    product: "",
    ubinan: "",
    rendemen: "",
  });

  return (
    <View style={[formStyles.wrapper, { padding: 10 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
      >
        <ScrollView contentContainerStyle={loginStyles.scrollContainer}>
          <FormHeader
            title="Check Out "
            onClose={() => setIsFormEdit(false)}
            onSave={handleCheckOut}
            backgroundColor="#dc3545"
          />

          <TextInput
            label="Title"
            mode="outlined"
            editable={false}
            style={[formStyles.input, { marginBottom: 5 }]}
            value={
              fieldServiceData.name === ""
                ? fieldServiceData.project_id
                  ? fieldServiceData.project_id[1] +
                    " " +
                    fieldServiceData.x_studio_district
                  : ""
                : fieldServiceData.name
            }
            onChangeText={(e) => {
              handleOnChangeData("name", e);
            }}
          />

          <TextInput
            multiline={true}
            mode="outlined"
            editable={false}
            style={{
              height: 150,
              padding: 0,
            }}
            label="Address"
            value={
              fieldServiceData.partner_id
                ? fieldServiceData.partner_id[1] +
                  ", " +
                  fieldServiceData.x_studio_address
                : ""
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
              label="Attendance"
              style={{ flex: 1, textAlign: "right", width: "50%" }}
              value={formatNumber(fieldServiceData.x_studio_attendant)}
              onChangeText={(text) =>
                handleOnChangeData("x_studio_attendant", text)
              }
              keyboardType="decimal-pad"
            />
            <TextInput
              mode="outlined"
              label="Area"
              style={{ flex: 1, textAlign: "right", width: "49%" }}
              value={formatNumber(fieldServiceData.x_studio_luas_lahan_ha)}
              onChangeText={(text) =>
                handleOnChangeData("x_studio_luas_lahan_ha", text)
              }
              keyboardType="decimal-pad"
            />
          </View>

          <TextInput
            multiline={true}
            mode="outlined"
            style={{
              height: 100,
            }}
            label="Notes"
            value={fieldServiceData.description}
            onChangeText={(text) => handleOnChangeData("description", text)}
          />
          {/* ======== Tabs Section ======== */}
          <View style={{ marginTop: 10 }}>
            {/* Tab Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: 10,
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor:
                    activeTab === "foto" ? "#0d6efd" : "transparent",
                  color: activeTab === "foto" ? "white" : "black",
                  padding: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={() => setActiveTab("foto")}
              >
                <Text
                  style={{
                    color: activeTab === "foto" ? "white" : "black",
                    fontWeight: "bold",
                  }}
                >
                  Form Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor:
                    activeTab === "direct" ? "#0d6efd" : "transparent",
                  padding: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={() => setActiveTab("direct")}
              >
                <Text
                  style={{
                    color: activeTab === "direct" ? "white" : "black",
                    fontWeight: "bold",
                  }}
                >
                  Direct Selling
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor:
                    activeTab === "demo" ? "#0d6efd" : "transparent",
                  padding: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={() => setActiveTab("demo")}
              >
                <Text
                  style={{
                    color: activeTab === "demo" ? "white" : "black",
                    fontWeight: "bold",
                  }}
                >
                  Demo
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === "foto" && <FieldPhoto />}
            {activeTab === "direct" && <FieldDirectSelling />}

            {activeTab === "demo" && <FieldDemo />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default FieldServiceCheckOut;
