/** @format */

import FormHeader from "@/src/component/FormHeader";
import MapPickerModal from "@/src/component/MapPickerModal";
import SelectModalInput from "@/src/component/SelectModalInput";
import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import {
  formatDateForBackendWIB,
  formatDateForDisplayUTC,
  parseBackendDateToWIB,
  utcToWIB,
} from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import { toZonedTime } from "date-fns-tz";

import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { MD2Colors, Provider, TextInput } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import FieldAddCustomer from "./FieldAddCustomer";

const FieldServiceForm = () => {
  const {
    selectedDate,
    setSelectedDate,
    customerList,
    productList,
    setIsForm,
    handleSave,
    handleOpenMap,
    coordinate,
    setCoordinate,
    setEventType,
    projectList,
    fieldService,
    handleOnChange,
    setAddCustomer,
    handleCustomers,
  } = useFieldServiceContext();
  const [visible, setVisible] = useState(false);
  const [visibleMap, setVisibleMap] = useState(false);
  const [visibleDate, setVisibleDate] = useState(false);
  const [visibleTime, setVisibleTime] = useState(false);
  // const [customers, setCustomers] = useState(customerList);
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    string | number
  >();
  const [showSelectCustomer, setShowSelectCustomer] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const {
    id,
    x_studio_sales_executive,
    x_studio_luas_lahan_ha,
    x_studio_attendant,
    x_studio_start_time,
    x_studio_activity_date,
    x_studio_lang,
    x_studio_lat,
    x_studio_district,
    x_studio_regency_1,
    x_studio_province,
    x_studio_address,
    partner_id,
    name,
    stage_id,
    planned_date_begin,
    project_id,
    description,
  } = fieldService;
  const [project_name, setProjectName] = useState("");
  const [tempDate, setTempDate] = useState<Date>(new Date());
  useEffect(() => {
    handleOnChange("name", project_name + " " + fieldService.x_studio_district);
  }, [project_name, fieldService.x_studio_district]);

  return (
    <Provider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100} // bisa disesuaikan
        style={[formStyles.wrapper, { padding: 10, marginBottom: 25, flex: 1 }]}
      >
        <FormHeader
          title="Check In"
          onClose={() => setIsForm(false)}
          onSave={handleSave}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={formStyles.scrollContainer} // Tambahkan style container
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[formStyles.wrapper, { padding: 10, marginBottom: 300 }]}
            >
              <TextInput
                label="Title"
                mode="outlined"
                placeholder="Title"
                editable={false}
                value={name}
                style={{
                  marginBottom: 5,
                  fontSize: 25,
                  fontWeight: "bold",
                  padding: 1,
                }}
              />
              <SelectModalInput
                data={projectList}
                onSelect={(itm) => {
                  handleOnChange("project_id", itm.id);
                  setProjectName(itm.label);
                  handleCustomers(itm.label);
                }}
                label="Event Type"
                placeholder="Event Type"
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
                    <Text style={{ color: "white", fontSize: 18 }}>Event</Text>
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
              />
              <TextInput
                value={
                  x_studio_activity_date
                    ? formatDateForDisplayUTC(new Date(x_studio_activity_date))
                    : ""
                }
                label="Event Start Date & Time (WIB)"
                placeholder="Event Start Date & Time (WIB)"
                mode="outlined"
                showSoftInputOnFocus={false}
                onFocus={() => {
                  const baseDate = x_studio_activity_date
                    ? new Date(x_studio_activity_date)
                    : utcToWIB(new Date());

                  setTempDate(baseDate);
                  setVisibleDate(true);
                }}
                style={{ backgroundColor: "white" }}
              />
              <TouchableOpacity
                onPress={() => {
                  const baseDate = x_studio_activity_date
                    ? parseBackendDateToWIB(new Date(x_studio_activity_date))
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
                  // Pastikan kita mengambil jam dari Date object yang valid
                  const base = tempDate instanceof Date ? tempDate : new Date();

                  updated.setHours(base.getHours());
                  updated.setMinutes(base.getMinutes());
                  updated.setSeconds(0);

                  setTempDate(updated);
                  setVisibleTime(true);
                }}
              />
              <TimePickerModal
                visible={visibleTime}
                // Gunakan optional chaining atau fallback ke 0
                hours={tempDate instanceof Date ? tempDate.getHours() : 0}
                minutes={tempDate instanceof Date ? tempDate.getMinutes() : 0}
                onDismiss={() => setVisibleTime(false)}
                onConfirm={({ hours, minutes }) => {
                  // Pastikan finalDate mengambil object Date yang valid
                  let finalDate = new Date(
                    tempDate instanceof Date ? tempDate : new Date()
                  );
                  finalDate.setHours(hours);
                  finalDate.setMinutes(minutes);
                  finalDate.setSeconds(0);

                  const step = 5;
                  finalDate.setMinutes(
                    Math.round(finalDate.getMinutes() / step) * step
                  );

                  setVisibleTime(false);
                  // Selalu bungkus dengan new Date sebelum dikirim ke utilitas
                  handleOnChange(
                    "x_studio_activity_date",
                    formatDateForBackendWIB(new Date(finalDate))
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
                  onChangeText={(text) => {
                    handleOnChange("x_studio_attendant", text);
                  }}
                  value={x_studio_attendant}
                  keyboardType="decimal-pad"
                />
                <TextInput
                  mode="outlined"
                  label="Area"
                  style={{ flex: 1, textAlign: "right", width: "49%" }}
                  onChangeText={(text) => {
                    handleOnChange("x_studio_luas_lahan_ha", text);
                  }}
                  value={x_studio_luas_lahan_ha}
                  keyboardType="decimal-pad"
                />
              </View>
              <TouchableOpacity onPress={() => setShowSelectCustomer(true)}>
                <View pointerEvents="none">
                  <SelectModalInput
                    data={customerList}
                    value={selectedCustomerId}
                    visible={showSelectCustomer}
                    onClose={() => setShowSelectCustomer(false)}
                    onSelect={(itm) => {
                      setSelectedCustomerId(itm.id);
                      handleOnChange("partner_id", itm.id);
                    }}
                    placeholder="Customer Name"
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
                          Customer
                        </Text>
                        <TouchableOpacity onPress={close}>
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            Close ✕
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    renderFooter={(close) => (
                      <>
                        <TouchableOpacity
                          onPress={() => setShowAddCustomer(true)}
                          style={{
                            backgroundColor: MD2Colors.green700,
                            padding: 12,
                            borderRadius: 5,
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                        >
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            Add Customer
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  />
                  {/* MODAL ADD CUSTOMER */}
                </View>
              </TouchableOpacity>
              {/* MODAL ADD CUSTOMER */}
              <Modal
                visible={showAddCustomer}
                animationType="slide"
                onRequestClose={() => setShowAddCustomer(false)}
              >
                <FieldAddCustomer
                  onSave={(newCustomer) => {
                    // 1️⃣ tambah ke list customer

                    setCustomers((prev) => [...prev, newCustomer]);

                    // 2️⃣ auto select customer baru
                    setSelectedCustomerId(newCustomer.id);
                    handleOnChange("partner_id", newCustomer.id);

                    // 3️⃣ tutup modal
                    setShowAddCustomer(false);
                    setShowSelectCustomer(false);
                  }}
                  onCancel={() => setShowAddCustomer(false)}
                />
              </Modal>
              <TextInput
                mode="outlined"
                label="Coordinate"
                placeholder="Coordinate"
                value={coordinate}
                editable={false}
                style={{ marginBottom: 5 }}
                right={
                  <TextInput.Icon
                    icon="map-marker"
                    onPress={() => setVisibleMap(true)}
                    color="white"
                    style={{
                      marginRight: 4,
                      backgroundColor: "#0d6efd",
                      borderRadius: 5,
                    }}
                  />
                }
              />
              <MapPickerModal
                visible={visibleMap}
                onClose={() => setVisibleMap(false)}
                onSelectLocation={({ lat, lng, detail }) => {
                  setCoordinate(`${lat}, ${lng}`);
                  handleOnChange("x_studio_lat", lat);
                  handleOnChange("x_studio_lang", lng);
                  handleOnChange("x_studio_address", detail.alamat);
                  handleOnChange("x_studio_district", detail.kecamatan);
                  handleOnChange("x_studio_regency_1", detail.kabupaten);
                  handleOnChange("x_studio_province", detail.propinsi);
                }}
              />
              <TextInput
                mode="outlined"
                label="Address"
                placeholder="Address"
                multiline={true}
                style={{ marginBottom: 5, height: 100 }}
                value={x_studio_address}
                onChangeText={(text) => {
                  handleOnChange("x_studio_address", text);
                }}
              />
              <TextInput
                mode="outlined"
                label="District"
                style={{ marginBottom: 5 }}
                value={x_studio_district}
                onChangeText={(text) => {
                  handleOnChange("x_studio_district", text);
                }}
              />
              <TextInput
                mode="outlined"
                label="Regency"
                style={{ marginBottom: 5 }}
                value={x_studio_regency_1}
                onChangeText={(text) => {
                  handleOnChange("x_studio_regency_1", text);
                }}
              />
              <TextInput
                mode="outlined"
                label="Province"
                style={{ marginBottom: 5 }}
                value={x_studio_province}
                onChangeText={(text) => {
                  handleOnChange("x_studio_province", text);
                }}
              />
              <TextInput
                multiline={true}
                style={{
                  height: 100,
                }}
                mode="outlined"
                label="Notes"
                value={description}
                onChangeText={(text) => {
                  handleOnChange("description", text);
                }}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Provider>
  );
};

export default FieldServiceForm;
