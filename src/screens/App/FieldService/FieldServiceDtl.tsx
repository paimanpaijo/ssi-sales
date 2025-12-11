/** @format */

import { getFieldServiceDetail } from "@/src/api/transaksi/FieldServiceAPI";
import { formatNumber } from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MD2Colors, TextInput } from "react-native-paper";

const FieldServiceDtl = (props) => {
  const [activeTab, setActiveTab] = useState("foto");
  const [fieldServiceData, setFieldServiceData] = useState({});

  useEffect(() => {
    getFieldServiceDetail(props.id).then((res) => {
      if (res?.data) {
        setFieldServiceData(res.data);
      }
    });
  }, [props.id]);

  const getImageUri = (base64) => {
    if (!base64) return null;

    // Deteksi tipe file dari header base64
    if (base64.startsWith("iVBOR")) return `data:image/png;base64,${base64}`; // PNG
    if (base64.startsWith("/9j/")) return `data:image/jpeg;base64,${base64}`; // JPEG
    if (base64.startsWith("UklGR")) return `data:image/webp;base64,${base64}`; // WEBP

    // Default fallback (misal kalau header tidak dikenal)
    return `data:image/jpeg;base64,${base64}`;
  };
  // 🔹 Form foto dengan pengecekan aman
  const formPhoto = () => {
    const base64Image = fieldServiceData?.x_studio_image;

    return (
      <View style={[formStyles.container, { padding: 15, marginBottom: 20 }]}>
        <View style={formStyles.rowTab}>
          <Text style={{ width: "50%" }}>Location :</Text>
          <Text style={{ fontWeight: "bold", width: "50%" }}>
            (Latitude , Longitude)
          </Text>
        </View>

        <View style={{ alignItems: "center", marginTop: 10 }}>
          {base64Image ? (
            <Image
              source={{ uri: getImageUri(fieldServiceData?.x_studio_image) }}
              style={{ width: 200, height: 200, borderRadius: 10 }}
              resizeMode="cover"
              onError={(e) =>
                console.log("❌ Gagal load image:", e.nativeEvent.error)
              }
            />
          ) : (
            <Image
              source={require("../../../../assets/images/camera.png")}
              style={formStyles.placeholderImage}
              resizeMode="contain"
            />
          )}
        </View>
      </View>
    );
  };

  const formDetail = () => {
    return (
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
    );
  };
  const formProduct = () => {
    return (
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
    );
  };
  return (
    <View style={[formStyles.wrapper, { padding: 1 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
      >
        <View style={{ flex: 1, paddingTop: 0, marginTop: 0 }}>
          <Text style={formStyles.Header}>Field Service</Text>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* ======== Field dasar ======== */}
            <TextInput
              label="Title"
              mode="outlined"
              editable={false}
              style={[formStyles.input, { marginBottom: 5 }]}
              value={fieldServiceData?.name || ""}
            />

            <TextInput
              multiline
              mode="outlined"
              editable={false}
              style={{ height: 150, padding: 0 }}
              label="Address"
              value={
                fieldServiceData?.partner_id
                  ? `${fieldServiceData.partner_id[1]}, ${
                      fieldServiceData.x_studio_address || ""
                    }`
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
                style={{ flex: 1, width: "50%" }}
                value={
                  formatNumber(fieldServiceData?.x_studio_attendant || 0) || ""
                }
                editable={false}
              />
              <TextInput
                mode="outlined"
                label="Area"
                style={{ flex: 1, width: "49%" }}
                value={
                  formatNumber(fieldServiceData?.x_studio_luas_lahan_ha || 0) ||
                  ""
                }
                editable={false}
              />
            </View>

            <TextInput
              multiline
              mode="outlined"
              style={{
                height: 100,
              }}
              label="Notes"
              value={fieldServiceData?.description || ""}
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
                {/* Foto Tab */}
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor:
                      activeTab === "foto" ? "#0d6efd" : "transparent",
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

                {/* Direct Tab */}
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

                {/* Demo Tab (hanya muncul jika project_id ada & mengandung 'demo') */}
                {fieldServiceData?.project_id?.[1]
                  ?.toLowerCase()
                  ?.includes("demo") && (
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
              </View>

              {/* ======== Tab Content ======== */}
              {activeTab === "foto" && formPhoto()}

              {activeTab === "direct" && formDetail()}

              {activeTab === "demo" && formProduct()}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default FieldServiceDtl;
