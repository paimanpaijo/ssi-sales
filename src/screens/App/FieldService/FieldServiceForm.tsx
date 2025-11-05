/** @format */

import FormHeader from "@/src/component/FormHeader";
import MapPickerModal from "@/src/component/MapPickerModal";
import SelectModalInput from "@/src/component/SelectModalInput";
import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import { formatDateForDisplay } from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Provider, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

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
  } = useFieldServiceContext();
  const [visible, setVisible] = useState(false);
  const [visibleMap, setVisibleMap] = useState(false);
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
  useEffect(() => {
    handleOnChange("name", project_name + " " + fieldService.x_studio_district);
  }, [project_name, fieldService.x_studio_district]);
  return (
    <Provider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100} // bisa disesuaikan
        style={[formStyles.wrapper, { padding: 10, marginBottom: 25 }]}
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
              style={[formStyles.wrapper, { padding: 10, marginBottom: 30 }]}
            >
              <TextInput
                label="Title"
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
                value={formatDateForDisplay(
                  x_studio_activity_date || new Date()
                )}
                mode="outlined"
                onFocus={() => setVisible(true)}
                showSoftInputOnFocus={false}
                label="Event Date"
                style={{ backgroundColor: "white" }}
              />
              <DatePickerModal
                locale="id"
                mode="single"
                visible={visible}
                onDismiss={() => setVisible(false)}
                date={
                  x_studio_activity_date
                    ? new Date(x_studio_activity_date)
                    : new Date()
                }
                onConfirm={({ date }) => {
                  setVisible(false);
                  const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
                  handleOnChange("x_studio_activity_date", formattedDate);
                }}
                saveLabel="OK"
                cancelLabel="Cancel"
                label="Select Date"
                animationType="slide"
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
              <SelectModalInput
                data={customerList}
                onSelect={(itm) => {
                  handleOnChange("partner_id", itm.id);
                }}
                label="Customer"
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
                      Daftar Customer
                    </Text>
                    <TouchableOpacity onPress={close}>
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Tutup ✕
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
                        Tutup
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

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
