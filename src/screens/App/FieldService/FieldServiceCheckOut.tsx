/** @format */

import FormHeader from "@/src/component/FormHeader";
import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import {
  formatDateForBackendWIB,
  formatDateForDisplayStd,
  formatNumber,
  parseBackendDateToWIB,
} from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import loginStyles from "@/src/style/loginStyles";
import { toZonedTime } from "date-fns-tz";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import FieldDemo from "./FieldDemo";
import FieldDirectSelling from "./FieldDirectSelling";
import FieldPhoto from "./FieldPhoto";
import FieldStockProduct from "./FieldStockProduct";

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
  const headerHeight = 0; // samakan dengan height headermu
  const safeTop = Platform.OS === "ios" ? 0 : 0;
  const [demo, setDemo] = useState({
    product: "",
    ubinan: "",
    rendemen: "",
  });
  const [visibleDate, setVisibleDate] = useState(false);
  const [visibleTime, setVisibleTime] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  return (
    <View style={[formStyles.wrapper, { padding: 1, marginBottom: 50 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
      >
        <FormHeader
          title="Check Out "
          onClose={() => setIsFormEdit(false)}
          onSave={handleCheckOut}
          backgroundColor="#dc3545"
        />
        <View style={{ flex: 1, paddingTop: 0, marginTop: 0 }}>
          <ScrollView contentContainerStyle={loginStyles.scrollContainer}>
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
            <TextInput
              value={
                fieldServiceData.x_studio_end_time
                  ? formatDateForDisplayStd(fieldServiceData.x_studio_end_time)
                  : formatDateForDisplayStd(new Date())
              }
              label="Event Start Date & Time  (WIB)"
              mode="outlined"
              showSoftInputOnFocus={false}
              onFocus={() => {
                const baseDate = fieldServiceData.x_studio_end_time
                  ? fieldServiceData.x_studio_end_time
                  : new Date();

                setTempDate(baseDate);
                setVisibleDate(true);
              }}
              style={{ backgroundColor: "white" }}
            />
            <TouchableOpacity
              onPress={() => {
                const baseDate = fieldServiceData.x_studio_end_time
                  ? parseBackendDateToWIB(fieldServiceData.x_studio_end_time)
                  : toZonedTime(new Date(), "Asia/Jakarta");

                setTempDate(baseDate);
                setVisibleTime(true);
              }}
            >
              <Text style={{ color: "#1976d2", marginTop: 6 }}>Edit Jam</Text>
            </TouchableOpacity>
            <DatePickerModal
              locale="id"
              mode="single"
              visible={visibleDate}
              date={tempDate}
              onDismiss={() => setVisibleDate(false)}
              onConfirm={({ date }) => {
                setVisibleDate(false);

                const updated = new Date(date);
                updated.setHours(tempDate.getHours());
                updated.setMinutes(tempDate.getMinutes());
                updated.setSeconds(0);

                setTempDate(updated);
                setVisibleTime(true);
              }}
            />
            <TimePickerModal
              visible={visibleTime}
              hours={tempDate.getHours()}
              minutes={tempDate.getMinutes()}
              onDismiss={() => setVisibleTime(false)}
              onConfirm={({ hours, minutes }) => {
                let finalDate = new Date(tempDate);
                finalDate.setHours(hours);
                finalDate.setMinutes(minutes);
                finalDate.setSeconds(0);

                // ⏱ round 5 menit
                const step = 5;
                finalDate.setMinutes(
                  Math.round(finalDate.getMinutes() / step) * step
                );

                // 🕘 validasi jam kerja
                // if (finalDate.getHours() < 8 || finalDate.getHours() >= 17) {
                //   alert("Jam di luar jam kerja (08:00 – 17:00)");
                //   return;
                // }

                setVisibleTime(false);

                // kirim WIB string
                handleOnChangeData(
                  "x_studio_end_time",
                  formatDateForBackendWIB(finalDate)
                );
              }}
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
                value={formatNumber(fieldServiceData.x_studio_attendant) || "0"}
                onChangeText={(text) =>
                  handleOnChangeData("x_studio_attendant", text)
                }
                keyboardType="decimal-pad"
              />
              <TextInput
                mode="outlined"
                label="Area"
                style={{ flex: 1, textAlign: "right", width: "49%" }}
                value={
                  formatNumber(fieldServiceData.x_studio_luas_lahan_ha) || "0"
                }
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
                {(fieldServiceData.project_id[1].toLowerCase() ===
                  "field trip" ||
                  fieldServiceData.project_id[1].toLowerCase() ===
                    "harvest festival" ||
                  fieldServiceData.project_id[1].toLowerCase() ===
                    "one day promo" ||
                  fieldServiceData.project_id[1].toLowerCase() ===
                    "farmer meeting") && (
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
                )}

                {fieldServiceData.project_id[1]
                  .toLowerCase()
                  .includes("demo") && (
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
                )}
                {fieldServiceData.project_id[1]
                  .toLowerCase()
                  .includes("channel") && (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor:
                        activeTab === "stock" ? "#0d6efd" : "transparent",
                      padding: 10,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                    onPress={() => setActiveTab("stock")}
                  >
                    <Text
                      style={{
                        color: activeTab === "stock" ? "white" : "black",
                        fontWeight: "bold",
                      }}
                    >
                      Stock Product
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Tab Content */}
              {activeTab === "foto" && <FieldPhoto />}
              {(fieldServiceData.project_id[1].toLowerCase() === "field trip" ||
                fieldServiceData.project_id[1].toLowerCase() ===
                  "harvest festival" ||
                fieldServiceData.project_id[1].toLowerCase() ===
                  "one day promo" ||
                fieldServiceData.project_id[1].toLowerCase() ===
                  "farmer meeting") &&
                activeTab === "direct" && <FieldDirectSelling />}

              {fieldServiceData.project_id[1].toLowerCase().includes("demo") &&
                activeTab === "demo" && <FieldDemo />}
              {fieldServiceData.project_id[1]
                .toLowerCase()
                .includes("channel") &&
                activeTab === "stock" && <FieldStockProduct />}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default FieldServiceCheckOut;
