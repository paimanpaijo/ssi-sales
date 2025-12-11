/** @format */

import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import formStyles from "@/src/style/FormStyles";
//import * as FileSystem from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";

import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

const FieldPhoto = () => {
  const { fieldServiceData, handleOnChangeData } = useFieldServiceContext();
  const [image, setImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);

  const handleImageResultold = async (asset) => {
    try {
      const originalUri = asset.uri;

      // 🔹 Resize & compress ke WEBP
      const manipulatedResult = await ImageManipulator.manipulateAsync(
        originalUri,
        [{ resize: { width: 500 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.WEBP }
      );

      // File sementara hasil manipulasi
      const compressedUri = manipulatedResult.uri;

      // 🔹 Simpan permanen ke documentDirectory
      const newFileName = `imagePloughDown_${Date.now()}.webp`;
      const newPath = `${FileSystem.documentDirectory}${newFileName}`;

      await FileSystem.copyAsync({
        from: compressedUri,
        to: newPath,
      });

      // 🔹 Ambil metadata file
      const fileName = newPath.split("/").pop();
      const ext = fileName.split(".").pop();
      const mimeType =
        ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : ext === "png"
          ? "image/png"
          : ext === "webp"
          ? "image/webp"
          : "application/octet-stream";

      // 🔹 Konversi ke Base64
      const base64Data = await FileSystem.readAsStringAsync(newPath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 🔹 Buat object file (kalau masih mau simpan metadata)
      const fileData = {
        uri: newPath,
        name: fileName,
        type: mimeType,
        base64: base64Data, // ✅ tambahkan hasil base64 di sini
      };

      // 🔹 Update state image
      setImage(newPath);

      // Kirim base64 langsung ke form data kamu
      handleOnChangeData("x_studio_image", base64Data);
    } catch (err) {
      console.error("❌ Error processing image:", err);
    }
  };
  const handleImageResult = async (asset) => {
    try {
      const originalUri = asset.uri;

      const manipulatedResult = await ImageManipulator.manipulateAsync(
        originalUri,
        [{ resize: { width: 500 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.WEBP }
      );

      const compressedUri = manipulatedResult.uri;
      const newFileName = `imagePloughDown_${Date.now()}.webp`;
      const newPath = `${FileSystem.documentDirectory}${newFileName}`;
      await FileSystem.copyAsync({ from: compressedUri, to: newPath });

      const info = await FileSystem.getInfoAsync(newPath);
      if (info.exists) {
        const sizeKB = info.size / 1024;
        const sizeMB = sizeKB / 1024;

        // ✅ Batasi ukuran 500 KB
        if (sizeKB > 500) {
          Alert.alert(
            "Ukuran terlalu besar",
            `Foto kamu ${sizeKB.toFixed(1)} KB.\nMaksimal hanya 500 KB.`
          );
          return; // ❌ stop, jangan lanjut upload
        }

        // Tampilkan info ukuran
        Alert.alert(
          "Image compressed",
          `Ukuran setelah kompres: ${sizeKB.toFixed(1)} KB (${sizeMB.toFixed(
            2
          )} MB)`
        );
      }

      const fileName = newPath.split("/").pop();
      const ext = fileName.split(".").pop();
      const mimeType =
        ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : ext === "png"
          ? "image/png"
          : ext === "webp"
          ? "image/webp"
          : "application/octet-stream";

      const base64Data = await FileSystem.readAsStringAsync(newPath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileData = {
        uri: newPath,
        name: fileName,
        type: mimeType,
        base64: base64Data,
      };

      setImage(newPath);
      handleOnChangeData("x_studio_image", base64Data);
    } catch (err) {
      console.error("❌ Error processing image:", err);
      Alert.alert("Error", "Gagal memproses gambar.");
    }
  };

  const pickImage = async () => {
    Alert.alert("Choose image source", "get image from ", [
      {
        text: "Camera",
        onPress: async () => {
          const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();

          if (cameraPerm.status !== "granted") {
            alert("request camera permission");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            base64: true,
            quality: 0.7,
          });

          if (!result.canceled && result.assets.length > 0) {
            handleImageResult(result.assets[0]);
          }
        },
      },
      {
        text: "Galery",

        onPress: async () => {
          const galleryPerm =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (galleryPerm.status !== "granted") {
            alert("request media library permission");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            base64: true,
            quality: 0.7,
          });

          if (!result.canceled && result.assets.length > 0) {
            handleImageResult(result.assets[0]);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  return (
    <View style={[formStyles.container, { padding: 15, marginBottom: 20 }]}>
      <View style={formStyles.rowTab}>
        <Text style={{ width: "50%" }}>Location : </Text>
        <Text style={{ fontWeight: "bold", width: "50%" }}>
          (Latitude , Longitude)
        </Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <TouchableOpacity style={formStyles.imageContainer} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={formStyles.image} />
          ) : (
            <Image
              source={require("../../../../assets/images/camera.png")}
              style={formStyles.placeholderImage}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FieldPhoto;
