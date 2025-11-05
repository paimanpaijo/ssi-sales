/** @format */

import FormHeader from "@/src/component/FormHeader";
import { useCustomerContext } from "@/src/context/App/CustomerContext";
import formStyles from "@/src/style/FormStyles";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Provider, Text, TextInput } from "react-native-paper";
// tambahkan import expo utilities
import { Checkbox } from "@/src/component/Checkbox";
import MapPickerModal from "@/src/component/MapPickerModal";
import * as Sharing from "expo-sharing";

const ALLOWED_EXT = [
  "jpg",
  "jpeg",
  "png",
  "heic",
  "gif",
  "webp",
  "pdf",
  "docx",
];

// helper: ambil ekstensi dari nama file
function getExt(filename: string) {
  if (!filename) return "";
  const parts = filename.split(".");
  if (parts.length === 1) return "";
  return parts.pop().toLowerCase();
}

const CustomerForm = () => {
  const { setIsForm, handleSave, customer, handleOnChange, handleClose } =
    useCustomerContext();
  const categories = ["Dealer", "Retailer", "Trader", "Farmer"];
  const [visibleMap, setVisibleMap] = useState(false);
  const [selected, setSelected] = useState("Dealer");
  const labelAnim = new Animated.Value(selected ? 1 : 0);
  const [isFocused, setIsFocused] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [vals, setVals] = useState<string[]>([]);
  const [coordinate, setCoordinate] = useState({ lat: 0, lng: 0 });

  // --- PERBAIKAN UTAMA: deklarasikan multi (false = single file)
  const multi = false;

  const {
    id,
    name,
    complete_name,
    street,
    city,
    state,
    email,
    phone,
    mobile,
    website,
    credit,
    debit,
    total_invoiced,
    customer_rank,
    x_studio_sales_executive,
    x_studio_type,
    contact_address,
    contact_address_complete,
    x_studio_agreement_signed,
    parent_name,
    vat_label,
    partner_vat_placeholder,
    partner_latitude,
    partner_longitude,
    company_type,
    is_company,
    parent_id,
    contact_name,
    contact_phone,
    contact_email,
    vat,
  } = customer;
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
  // array { uri, name, size, mime? , ext }

  // Ganti fungsi pickFiles-mu dengan ini (Expo + DocumentPicker + FileSystem)
  // Pastikan Anda masih memiliki helper ini:
  function getExt(filename: string) {
    if (!filename) return "";
    const parts = filename.split(".");
    if (parts.length === 1) return "";
    return parts.pop().toLowerCase();
  }

  const [files, setFiles] = useState<
    {
      uri: string;
      name: string;
      size: number | null;
      mime: string | null;
      ext: string;
      base64: string; // <-- Properti Base64 yang baru
    }[]
  >([]);

  // Konfigurasi: ubah sesuai kebutuhan
  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_EXT = [
    "jpg",
    "jpeg",
    "png",
    "heic",
    "gif",
    "webp",
    "pdf",
    "docx",
  ];

  // optional check

  const pickFiles = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!res || res.type === "cancel" || (res as any).canceled) {
        console.log("User cancelled picker");
        return;
      }

      let picked: any[] = [];
      if ((res as any).assets && Array.isArray((res as any).assets)) {
        picked = (res as any).assets;
      } else if (res.type === "success" && (res as any).uri) {
        picked = [res];
      } else if (Array.isArray(res)) {
        picked = res;
      } else {
        console.warn("Unknown DocumentPicker shape:", res);
        Alert.alert("Error Picker", "Tidak dapat mengekstrak data file.");
        return;
      }

      if (!picked.length) {
        Alert.alert("Tidak ada file yang dipilih");
        return;
      }

      const pickedFile = picked[0];
      let uriCandidate =
        pickedFile.file ??
        pickedFile.uri ??
        pickedFile.nativeURL ??
        pickedFile.uriContent ??
        "";
      if (!uriCandidate) {
        Alert.alert(
          "File Error",
          "File tidak memiliki URI yang dapat diakses."
        );
        return;
      }

      if (Platform.OS === "android" && uriCandidate.startsWith("/")) {
        uriCandidate = "file://" + uriCandidate;
      }

      let name =
        pickedFile.name ??
        uriCandidate.split("/").pop()?.split("?")[0] ??
        "unknown";
      try {
        name = decodeURIComponent(name);
      } catch {}
      const ext = (getExt(name) || "").toLowerCase();
      const mime =
        pickedFile.mime ?? pickedFile.mimeType ?? pickedFile.type ?? "";

      const extAllowed = ALLOWED_EXT.includes(ext);
      const mimeAllowed =
        mime.startsWith("image/") ||
        mime === "application/pdf" ||
        mime.includes("officedocument");
      if (!(extAllowed || mimeAllowed)) {
        Alert.alert(
          "Tipe file tidak didukung",
          "Pilih gambar, PDF, atau DOCX."
        );
        return;
      }

      // ukuran
      let size = pickedFile.size ?? null;
      try {
        if (!size) {
          const info = await FileSystem.getInfoAsync(uriCandidate, {
            size: true,
          });
          if (info && info.size) size = info.size;
        }
      } catch (e) {
        console.warn("getInfoAsync error:", e);
      }

      if (size && size > MAX_BYTES) {
        Alert.alert(
          "File Terlalu Besar",
          `File ${name} ukurannya ${
            Math.round((size / (1024 * 1024)) * 10) / 10
          } MB. Maksimal ${(MAX_BYTES / (1024 * 1024)).toFixed(1)} MB.`
        );
        return;
      }

      // set to state/context only metadata (no base64, no upload)
      const fileMeta = { uri: uriCandidate, name, size: size ?? 0, mime, ext };
      setFiles([fileMeta]); // local UI
      handleOnChange("file_document", fileMeta); // simpan di customer state
      console.log("File selected (metadata):", fileMeta);
    } catch (err) {
      console.error("pickFiles error:", err);
      Alert.alert("Error", (err as any)?.message || "Gagal memilih file");
    }
  };

  const pickFilesold = async () => {
    // object template
    const fileObject = {
      uri: "",
      name: "",
      size: 0,
      mime: "",
      ext: "",
      base64: "",
    };

    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true, // penting agar FileSystem bisa baca
        multiple: multi,
      });

      // user cancel
      if (!res || res.type === "cancel" || (res as any).canceled) {
        console.log("User cancelled picker");
        return;
      }

      // normalize to array
      let picked: any[] = [];
      if ((res as any).assets && Array.isArray((res as any).assets)) {
        picked = (res as any).assets;
      } else if (res.type === "success" && (res as any).uri) {
        picked = [res];
      } else if (Array.isArray(res)) {
        picked = res;
      } else {
        console.warn("Unknown DocumentPicker result shape or no assets:", res);
        Alert.alert("Error Picker", "Tidak dapat mengekstrak data file.");
        return;
      }

      if (!picked.length) {
        Alert.alert("Tidak ada file yang dipilih");
        return;
      }

      // ambil hanya file pertama jika multi=false
      const pickedFile = picked[0];

      // dapatkan uri kandidat
      const uriCandidate =
        pickedFile.file ??
        pickedFile.uri ??
        pickedFile.nativeURL ??
        pickedFile.uriContent ??
        "";

      if (!uriCandidate) {
        Alert.alert(
          "File Error",
          "File tidak memiliki URI yang dapat diakses."
        );
        return;
      }

      // nama & ext
      let name =
        pickedFile.name ??
        uriCandidate.split("/").pop()?.split("?")[0] ??
        "unknown";
      try {
        name = decodeURIComponent(name);
      } catch {}
      const ext = getExt(name).toLowerCase();

      // mime fallback dari object
      const mime =
        pickedFile.mime ?? pickedFile.mimeType ?? pickedFile.type ?? "";

      // cek ekstensi / mime (jika mau batasi jenis). Jika mau lepas filter, hapus blok ini.
      const extAllowed = ALLOWED_EXT.includes(ext);
      // also allow based on mime for docx/pdf detection
      const mimeAllowed =
        mime.startsWith("image/") ||
        mime === "application/pdf" ||
        mime.includes("officedocument");

      if (!(extAllowed || mimeAllowed)) {
        Alert.alert(
          "Tipe file tidak didukung",
          "Pilih file gambar (jpg/png/...), PDF, atau DOCX."
        );
        return;
      }

      // cari ukuran: cek item.size dulu, jika tidak ada gunakan FileSystem.getInfoAsync
      let size = pickedFile.size ?? null;
      try {
        if (!size) {
          const info = await FileSystem.getInfoAsync(uriCandidate, {
            size: true,
          });
          if (info && info.size) size = info.size;
        }
      } catch (e) {
        console.warn("getInfoAsync gagal:", e);
      }

      // jika ukuran tersedia, cek limit
      if (size && size > MAX_BYTES) {
        Alert.alert(
          "File Terlalu Besar",
          `Ukuran file ${Math.round(size / 1024)} KB melebihi batas ${(
            MAX_BYTES /
            (1024 * 1024)
          ).toFixed(1)} MB.`
        );
        return;
      }

      // Jika size unknown, opsional: baca info kecil atau tolak (pilih strategi)
      // Di sini kita akan tetap coba baca jika size unknown, tapi batasi baca jika hasil base64 terlalu besar
      // baca file sebagai base64
      console.log(`Reading file at URI: ${uriCandidate} to Base64...`);
      const base64Data = await FileSystem.readAsStringAsync(uriCandidate, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // hitung perkiraan byte dari base64 (3/4 rule)
      const approxBytes = Math.floor((base64Data.length * 3) / 4);
      if (approxBytes > MAX_BYTES) {
        Alert.alert(
          "File Terlalu Besar",
          `Setelah konversi, file sekitar ${Math.round(
            approxBytes / 1024
          )} KB yang melebihi batas ${(MAX_BYTES / (1024 * 1024)).toFixed(
            1
          )} MB. Gunakan file lebih kecil atau upload multipart.`
        );
        return;
      }

      // semua OK -> isi fileObject
      fileObject.uri = uriCandidate;
      fileObject.name = name;
      fileObject.size = size ?? approxBytes;
      fileObject.mime = mime;
      fileObject.ext = ext;
      fileObject.base64 = base64Data;

      // set state & kirim ke context/parent
      setFiles([fileObject]);
      handleOnChange("file_document", base64Data);
      console.log("File saved to state with Base64.", {
        name: fileObject.name,
        size: fileObject.size,
      });
    } catch (e) {
      console.error("Error reading file as Base64:", e);
      Alert.alert("Error Base64", "Gagal membaca file menjadi Base64.");
      return;
    }
  };

  const openWithSharing = async (file: any) => {
    try {
      if (!file || !file.uri) {
        Alert.alert("Tidak ada file");
        return;
      }

      let localUri = file.uri;
      if (
        !localUri.startsWith(FileSystem.cacheDirectory) &&
        !localUri.startsWith("file://")
      ) {
        const dest = `${FileSystem.cacheDirectory}${file.name}`;
        await FileSystem.copyAsync({ from: localUri, to: dest }).catch(
          async () => {
            try {
              await FileSystem.downloadAsync(localUri, dest);
            } catch {
              // ignore
            }
          }
        );
        localUri = dest;
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          "Tidak tersedia",
          "Fitur sharing/open tidak tersedia di perangkat ini."
        );
        return;
      }

      await Sharing.shareAsync(localUri, { dialogTitle: `Open ${file.name}` });
    } catch (err) {
      console.warn("openWithSharing error", err);
      Alert.alert("Error membuka file", (err as any).message || String(err));
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isImage = ["jpg", "jpeg", "png", "heic", "gif", "webp"].includes(
      item.ext
    );
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>
            {item.ext.toUpperCase()}{" "}
            {item.size ? `• ${Math.round(item.size / 1024)} KB` : ""}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => openWithSharing(item)}
            >
              <Text style={styles.btnText}>Open / Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isImage ? (
          <Image
            source={{ uri: item.uri }}
            style={styles.thumb}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={{ fontSize: 12 }}>{item.ext.toUpperCase()}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Provider>
      <KeyboardAvoidingView
        style={[formStyles.wrapper, { padding: 10, marginBottom: 25 }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <FormHeader
          title="Customer"
          confirmOnClose={true}
          onClose={() => handleClose()}
          onSave={() => handleSave()}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={formStyles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[formStyles.wrapper, { padding: 10, marginBottom: 30 }]}
            >
              <TextInput
                mode="outlined"
                label="Name"
                name="name"
                value={name}
                onChangeText={(text) => handleOnChange("name", text)}
                placeholder="Name"
              />
              <TextInput
                mode="outlined"
                label="Location"
                placeholder="Location"
                style={{ marginBottom: 10 }}
                value={partner_latitude + ", " + partner_longitude}
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
                  handleOnChange("partner_latitude", lat);
                  handleOnChange("partner_longitude", lng);
                  handleOnChange("street", detail.alamat);
                  handleOnChange("x_studio_district", detail.kecamatan);
                  handleOnChange("city", detail.kabupaten);
                  handleOnChange("state", detail.propinsi);
                  handleOnChange("country", "Indonesia");
                  setVisibleMap(false);
                }}
              />
              <TextInput
                multiline={true}
                mode="outlined"
                label="Address"
                name="street"
                value={street}
                onChangeText={(text) => handleOnChange("street", text)}
                placeholder="Address"
                style={{ height: 100 }}
              />
              <TextInput
                mode="outlined"
                label="City"
                name="city"
                onChangeText={(text) => handleOnChange("city", text)}
                placeholder="City"
                value={city}
              />
              <TextInput
                mode="outlined"
                label="State"
                name="state"
                onChangeText={(text) => handleOnChange("state", text)}
                placeholder="State"
                value={state}
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
                value={phone}
                onChangeText={(text) => handleOnChange("phone", text)}
                keyboardType="phone-pad"
              />
              <TextInput
                mode="outlined"
                label="Email"
                placeholder="Email"
                value={email}
                keyboardType="email-address"
                onChangeText={(text) => handleOnChange("email", text)}
                style={{ marginBottom: 10 }}
              />
              <TextInput
                mode="outlined"
                label="NPWP"
                placeholder="NPWP"
                value={vat}
                onChangeText={(text) => handleOnChange("vat", text)}
                keyboardType="number-pad"
                style={{ marginBottom: 10 }}
              />
              <View
                style={[
                  formStyles.rowTab,
                  { borderWidth: 1, borderRadius: 5, padding: 10, height: 50 },
                ]}
              >
                <Animated.Text style={labelStyle}>Kategori</Animated.Text>
                {categories.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={formStyles.radioContainer}
                    onPress={() => {
                      setSelected(item);

                      handleOnChange("x_studio_type", item);
                    }}
                  >
                    <View
                      style={[
                        formStyles.radioCircle,
                        x_studio_type === item && formStyles.radioSelected,
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
                value={contact_name}
                onChangeText={(text) => handleOnChange("contact_name", text)}
              />

              <TextInput
                mode="outlined"
                label="Contact Phone"
                placeholder="Contact Phone"
                keyboardType="phone-pad"
                value={contact_phone}
                onChangeText={(text) => {
                  handleOnChange("contact_phone", text);
                }}
              />
              <TextInput
                mode="outlined"
                label="Contact Email"
                placeholder="Contact Email"
                style={{ marginBottom: 10 }}
                value={contact_email}
                onChangeText={(text) => handleOnChange("contact_email", text)}
                keyboardType="email-address"
              />
              <Checkbox
                checked={x_studio_agreement_signed}
                onChange={() => {
                  handleOnChange(
                    "x_studio_agreement_signed",
                    !x_studio_agreement_signed
                  );
                  // setIsChecked(!isChecked);
                }}
                disabled={false}
                label="Agreement signed"
              />

              <View style={{ padding: 16 }}>
                {/* penggunaan Button react-native-paper yang benar: children untuk teks */}
                <Button mode="contained" onPress={pickFiles}>
                  {multi
                    ? "Pilih File (multi)"
                    : "Pilih File (gambar, pdf, docx)"}
                </Button>
                <View style={{ height: 12 }} />
                {files.length === 0 ? (
                  <Text style={{ color: "#666" }}>Belum ada file dipilih.</Text>
                ) : (
                  // langsung render file pertama saja
                  <View>{renderItem({ item: files[0] })}</View>
                )}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Provider>
  );
};

export default CustomerForm;

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
