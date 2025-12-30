/** @format */

import { saveCustomer } from "@/src/api/master/CustomerAPI";
import FormHeader from "@/src/component/FormHeader";
import MapPickerModal from "@/src/component/MapPickerModal";
import { useAuth } from "@/src/context/AuthContext";
import { validateEmail } from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Provider, Text, TextInput } from "react-native-paper";

const FieldAddCustomer = ({ onSave, onCancel }) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [visibleMap, setVisibleMap] = useState(false);
  const [selected, setSelected] = useState("Dealer");
  const labelAnim = new Animated.Value(selected ? 1 : 0);
  const [coordinate, setCoordinate] = useState({ lat: 0, lng: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const initial = {
    id: 0,
    name: "",
    complete_name: "",
    street: "",
    city: "",
    state: "",
    email: "",
    phone: "",
    mobile: "",
    website: "",
    credit: "",
    debit: "",
    total_invoiced: "",
    customer_rank: "",
    x_studio_sales_executive: 0,
    x_studio_type: "",
    contact_address: "",
    contact_address_complete: "",
    x_studio_agreement_signed: "",
    parent_name: "",
    vat_label: "",
    partner_vat_placeholder: "",
    partner_latitude: 0,
    partner_longitude: 0,
    company_type: "",
    is_company: false,
    parent_id: 0,
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    vat: "",
  };
  const [customer, setCustomer] = useState(initial);
  const handleSave = async () => {
    if (!customer.name || !customer.phone) {
      Alert.alert("Error", "Please fill all required field (name, phone)");
      return;
    }
    if (!(customer.vat.length === 0 || customer.vat.length === 16)) {
      Alert.alert("Error", "NPWP must be more than 16 characters");
      return;
    }
    if (customer.email && !validateEmail(customer.email)) {
      Alert.alert("Error", "Email is not valid");
      return;
    }
    if (customer.contact_email && !validateEmail(customer.contact_email)) {
      Alert.alert("Error", "Contact email is not valid");
      return;
    }

    // prepare payload fields (no file yet)
    const payloadFields: any = {
      company_name: customer.name.toUpperCase(),
      company_email: customer.email.toLowerCase(),
      company_phone: customer.phone,
      company_website: customer.website,
      street: customer.street,
      city: customer.city,
      state: customer.state,
      npwp: customer.vat,
      type: customer.x_studio_type,
      agreement_signed: customer.x_studio_agreement_signed,
      sales_executive: user.id,
      longitude: customer.partner_longitude,
      latitude: customer.partner_latitude,
      contact_name: customer.contact_name,
      contact_phone: customer.contact_phone,
      contact_email: customer.contact_email,
      id: customer.id,
    };

    const res = await saveCustomer(payloadFields);

    // setIsSaving(false);
    if (res && res.success) {
      Alert.alert("Success", "Data has been saved", [{ text: "OK" }]);

      setCustomer(initial);

      const newCustomer = {
        id: res.data.company_id, // ganti hasil API
        label: payloadFields.company_name + " - " + payloadFields.city,
      };

      onSave(newCustomer);
    } else {
      Alert.alert("Error", res?.message || "Failed to save customer");
    }
  };
  const categories = ["Dealer", "Retailer", "Trader", "Farmer"];
  const labelStyle = {
    position: "absolute",
    left: 10,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused || selected ? "black" : "#666",
    backgroundColor: "#fff",
    paddingHorizontal: 4,
  };
  return (
    <Provider>
      <KeyboardAvoidingView
        style={[formStyles.wrapper, { padding: 5, marginBottom: 25 }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <FormHeader
          title="Add Customer"
          confirmOnClose={true}
          onClose={onCancel}
          onSave={handleSave}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={formStyles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[formStyles.wrapper, { marginBottom: 10 }]}>
              <TextInput
                mode="outlined"
                label="Name"
                name="name"
                value={customer.name}
                onChangeText={(text) =>
                  setCustomer({ ...customer, name: text })
                }
                placeholder="Name"
              />
              <TextInput
                mode="outlined"
                label="Location"
                placeholder="Location"
                style={{ marginBottom: 10 }}
                value={
                  customer.partner_latitude + ", " + customer.partner_longitude
                }
                onFocus={() => setVisibleMap(true)}
                right={
                  <TextInput.Icon
                    icon="map-marker"
                    color="white"
                    backgroundColor="blue"
                    mode="outlined"
                    style={{ borderRadius: 5 }}
                    onPress={() => setVisibleMap(true)}
                  />
                }
              />
              <MapPickerModal
                visible={visibleMap}
                onClose={() => setVisibleMap(false)}
                onSelectLocation={({ lat, lng, detail }) => {
                  setCoordinate(`${lat}, ${lng}`);
                  setCustomer((prev) => ({
                    ...prev,
                    partner_latitude: lat,
                    partner_longitude: lng,
                    street: detail.alamat,
                    x_studio_district: detail.kecamatan,
                    city: detail.kabupaten,
                    state: detail.propinsi,
                    country: "Indonesia",
                  }));

                  setVisibleMap(false);
                }}
              />
              <TextInput
                multiline={true}
                mode="outlined"
                label="Address"
                name="street"
                value={customer.street}
                onChangeText={(text) =>
                  setCustomer({ ...customer, street: text })
                }
                placeholder="Address"
                style={{ height: 100 }}
              />
              <TextInput
                mode="outlined"
                label="City"
                name="city"
                onChangeText={(text) =>
                  setCustomer({ ...customer, city: text })
                }
                placeholder="City"
                value={customer.city}
              />
              <TextInput
                mode="outlined"
                label="State"
                name="state"
                onChangeText={(text) =>
                  setCustomer({ ...customer, state: text })
                }
                placeholder="State"
                value={customer.state}
              />
              <TextInput
                mode="outlined"
                label="Country"
                placeholder="Country"
                value={"Indonesia"}
              />
              <TextInput
                mode="outlined"
                label="Phone"
                placeholder="Phone"
                value={customer.phone}
                onChangeText={(text) =>
                  setCustomer({ ...customer, phone: text })
                }
                keyboardType="phone-pad"
              />
              <TextInput
                mode="outlined"
                label="Email"
                placeholder="Email"
                value={customer.email}
                keyboardType="email-address"
                onChangeText={(text) =>
                  setCustomer({ ...customer, email: text })
                }
              />
              <TextInput
                mode="outlined"
                label="NPWP"
                placeholder="NPWP"
                value={customer.vat}
                onChangeText={(text) => setCustomer({ ...customer, vat: text })}
                keyboardType="number-pad"
              />
              <View
                style={[
                  formStyles.rowTab,
                  {
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    height: 50,
                    marginTop: 10,
                  },
                ]}
              >
                <Animated.Text style={labelStyle}>Kategori</Animated.Text>
                {categories.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={formStyles.radioContainer}
                    onPress={() => {
                      setSelected(item);

                      setCustomer((prev) => ({
                        ...prev,
                        x_studio_type: item,
                      }));
                    }}
                  >
                    <View
                      style={[
                        formStyles.radioCircle,
                        customer.x_studio_type === item &&
                          formStyles.radioSelected,
                      ]}
                    />
                    <Text style={formStyles.radioText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                mode="outlined"
                label="Contact Name"
                placeholder="Contact Name"
                value={customer.contact_name}
                onChangeText={(text) =>
                  setCustomer({ ...customer, contact_name: text })
                }
              />

              <TextInput
                mode="outlined"
                label="Contact Phone"
                placeholder="Contact Phone"
                keyboardType="phone-pad"
                value={customer.contact_phone}
                onChangeText={(text) => {
                  setCustomer({ ...customer, contact_phone: text });
                }}
              />
              <TextInput
                mode="outlined"
                label="Contact Email"
                placeholder="Contact Email"
                value={customer.contact_email}
                onChangeText={(text) =>
                  setCustomer({ ...customer, contact_email: text })
                }
                keyboardType="email-address"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Provider>
  );
};

export default FieldAddCustomer;
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 8,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
    alignItems: "center",
  },
  name: { fontWeight: "600" },
  meta: { color: "#666", fontSize: 12, marginTop: 4 },
  thumb: { width: 72, height: 72, borderRadius: 6, marginLeft: 12 },
  thumbPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 6,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#1976D2",
    borderRadius: 6,
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
