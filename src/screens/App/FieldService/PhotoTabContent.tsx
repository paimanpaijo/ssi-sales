/** @format */

import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

// --- Helper clamp ---
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// --- Component: PhotoTabContent ---
function PhotoTabContent({ onUploadSuccess }) {
  const cameraRef = useRef(null);
  const [mode, setMode] = useState("idle"); // idle | camera | preview
  const [hasCameraPerm, setHasCameraPerm] = useState(null);
  const [hasMediaPerm, setHasMediaPerm] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [origSize, setOrigSize] = useState({ w: 0, h: 0 });
  const [displaySize, setDisplaySize] = useState({
    w: SCREEN_W,
    h: SCREEN_W * (4 / 3),
  });
  const [loading, setLoading] = useState(false);

  // crop state (fractions relative to displaySize)
  const [cropSize, setCropSize] = useState(0.6);
  const [cropX, setCropX] = useState(0.2);
  const [cropY, setCropY] = useState(0.2);

  // coords display
  const [coordsText, setCoordsText] = useState("Latitude & Longitude : -");
  const lastTakenFromCameraRef = useRef(false);

  useEffect(() => {
    (async () => {
      const cam = await Camera.requestCameraPermissionsAsync();
      setHasCameraPerm(cam.status === "granted");
      const ml = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPerm(ml.status === "granted");
    })();
  }, []);

  // PanResponder for dragging crop box
  const panRef = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !!photoUri,
      onMoveShouldSetPanResponder: () => !!photoUri,
      onPanResponderMove: (evt, gs) => {
        const dx = gs.dx / displaySize.w;
        const dy = gs.dy / displaySize.h;
        setCropX((prev) => clamp(prev + dx, 0, 1 - cropSize));
        setCropY((prev) => clamp(prev + dy, 0, 1 - cropSize));
      },
    })
  ).current;

  // ---------- ACTIONS ----------
  async function openCameraMode() {
    if (!hasCameraPerm) {
      const cam = await Camera.requestCameraPermissionsAsync();
      setHasCameraPerm(cam.status === "granted");
      if (cam.status !== "granted") {
        Alert.alert("Permission denied", "Camera permission is required");
        return;
      }
    }
    setMode("camera");
  }

  async function takePhotoAndAttach() {
    try {
      setLoading(true);

      const locPerm = await Location.requestForegroundPermissionsAsync();
      const locAllowed = locPerm.status === "granted";

      if (!cameraRef.current) {
        Alert.alert("Camera not ready");
        setLoading(false);
        return;
      }

      const options = { quality: 1, skipProcessing: false, exif: true };
      const snap = await cameraRef.current.takePictureAsync(options);
      lastTakenFromCameraRef.current = true;

      if (locAllowed) {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          const { latitude, longitude } = loc.coords;
          setCoordsText(
            `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(
              6
            )}`
          );
          snap._attachedCoords = { latitude, longitude };
        } catch (err) {
          console.warn("Getting location failed:", err);
          setCoordsText("Latitude & Longitude : - (failed to get)");
        }
      } else {
        setCoordsText("Latitude & Longitude : - (permission denied)");
      }

      setPhotoUri(snap.uri);
      Image.getSize(
        snap.uri,
        (w, h) => {
          setOrigSize({ w, h });
          const displayW = SCREEN_W;
          const displayH = Math.round((h / w) * displayW);
          setDisplaySize({ w: displayW, h: displayH });
          setCropSize(0.6);
          setCropX((1 - 0.6) / 2);
          setCropY((1 - 0.6) / 2);
        },
        (e) => console.warn("Image.getSize error", e)
      );

      setMode("preview");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || "Failed to take photo");
    } finally {
      setLoading(false);
    }
  }

  async function openGallery() {
    try {
      setLoading(true);
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        quality: 1,
        exif: true,
        allowsEditing: false,
      });
      if (res.canceled) {
        setLoading(false);
        return;
      }
      lastTakenFromCameraRef.current = false;

      let exifCoords = null;
      if (res.exif) {
        const exif = res.exif;
        if (exif.GPSLatitude && exif.GPSLongitude) {
          const lat = exif.GPSLatitude;
          const lon = exif.GPSLongitude;
          exifCoords = {
            latitude: typeof lat === "number" ? lat : null,
            longitude: typeof lon === "number" ? lon : null,
          };
        } else if (exif.Latitude && exif.Longitude) {
          exifCoords = { latitude: exif.Latitude, longitude: exif.Longitude };
        }
      }
      if (exifCoords && exifCoords.latitude && exifCoords.longitude) {
        setCoordsText(
          `Latitude: ${exifCoords.latitude.toFixed(
            6
          )}, Longitude: ${exifCoords.longitude.toFixed(6)}`
        );
      } else {
        setCoordsText("Latitude & Longitude : - (no EXIF)");
      }

      setPhotoUri(res.uri);
      Image.getSize(
        res.uri,
        (w, h) => {
          setOrigSize({ w, h });
          const displayW = SCREEN_W;
          const displayH = Math.round((h / w) * displayW);
          setDisplaySize({ w: displayW, h: displayH });
          setCropSize(0.6);
          setCropX((1 - 0.6) / 2);
          setCropY((1 - 0.6) / 2);
        },
        (e) => console.warn("Image.getSize error", e)
      );
      setMode("preview");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || "Failed to open gallery");
    } finally {
      setLoading(false);
    }
  }

  async function cropToWebpAndUpload() {
    if (!photoUri) return;
    setLoading(true);
    try {
      const dispW = displaySize.w;
      const dispH = displaySize.h;
      const minDisp = Math.min(dispW, dispH);
      const cropWDisp = Math.round(cropSize * minDisp);
      const cropHDisp = cropWDisp;
      const leftDisp = Math.round(cropX * dispW);
      const topDisp = Math.round(cropY * dispH);

      const scaleX = origSize.w / dispW;
      const scaleY = origSize.h / dispH;
      const originX = Math.round(leftDisp * scaleX);
      const originY = Math.round(topDisp * scaleY);
      const cropW = Math.min(
        Math.round(cropWDisp * Math.max(scaleX, scaleY)),
        origSize.w - originX
      );
      const cropH = Math.min(
        Math.round(cropHDisp * Math.max(scaleX, scaleY)),
        origSize.h - originY
      );

      const cropOptions = {
        originX: clamp(originX, 0, origSize.w - 1),
        originY: clamp(originY, 0, origSize.h - 1),
        width: Math.max(1, cropW),
        height: Math.max(1, cropH),
      };

      const manipResult = await ImageManipulator.manipulateAsync(
        photoUri,
        [{ crop: cropOptions }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.WEBP }
      );

      let savedUri = manipResult.uri;

      if (hasMediaPerm) {
        try {
          const asset = await MediaLibrary.createAssetAsync(savedUri);
          await MediaLibrary.createAlbumAsync(
            "MyAppPhotos",
            asset,
            false
          ).catch(() => {});
        } catch (e) {
          console.warn("Failed to save to gallery:", e);
        }
      } else {
        const fname = `photo_${Date.now()}.webp`;
        const dest = FileSystem.documentDirectory + fname;
        await FileSystem.copyAsync({ from: savedUri, to: dest });
        savedUri = dest;
      }

      const base64 = await FileSystem.readAsStringAsync(savedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      let payloadCoords = null;
      const m = coordsText.match(
        /Latitude:\s*(-?\d+(\.\d+)?),\s*Longitude:\s*(-?\d+(\.\d+)?)/
      );
      if (m)
        payloadCoords = {
          latitude: parseFloat(m[1]),
          longitude: parseFloat(m[3]),
        };

      const uploadUrl = "https://your-nestjs.example/api/upload/photo"; // ganti URL backend kamu

      const body = {
        filename: `photo_${Date.now()}.webp`,
        mimetype: "image/webp",
        data_base64: base64,
        coords: payloadCoords,
      };

      const resp = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        Alert.alert("Upload failed", `${resp.status}: ${txt}`);
      } else {
        const j = await resp.json();
        Alert.alert("Upload success", "Foto berhasil diupload");
        if (onUploadSuccess) onUploadSuccess(j);
      }

      setMode("idle");
      setPhotoUri(null);
      setCoordsText("Latitude & Longitude : -");
    } catch (e) {
      console.error("crop/upload error", e);
      Alert.alert("Error", e.message || "Failed to process image");
    } finally {
      setLoading(false);
    }
  }

  function cancelPreview() {
    setMode("idle");
    setPhotoUri(null);
    setCoordsText("Latitude & Longitude : -");
  }

  // ---------- RENDER ----------
  if (hasCameraPerm === null) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Memeriksa izin kamera...</Text>
      </View>
    );
  }

  if (hasCameraPerm === false) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Izin kamera ditolak. Buka Pengaturan dan izinkan akses kamera.
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const cam = await Camera.requestCameraPermissionsAsync();
            setHasCameraPerm(cam.status === "granted");
          }}
          style={{
            backgroundColor: "#0d6efd",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white" }}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === "camera") {
    return (
      <View style={{ alignItems: "center" }}>
        <Camera
          style={{ width: SCREEN_W, height: SCREEN_W * (4 / 3) }}
          ref={cameraRef}
          ratio="4:3"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            padding: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => setMode("idle")}
            style={styles.smallButton}
          >
            <Text>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePhotoAndAttach}
            style={styles.captureButton}
          >
            <Text style={{ color: "white" }}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Info", "Switch camera not implemented in snippet")
            }
            style={styles.smallButton}
          >
            <Text>Switch</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (mode === "preview" && photoUri) {
    return (
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: displaySize.w,
            height: displaySize.h,
            backgroundColor: "#000",
          }}
        >
          <Image
            source={{ uri: photoUri }}
            style={{ width: displaySize.w, height: displaySize.h }}
            resizeMode="contain"
          />
          <View
            style={[
              styles.cropOverlay,
              {
                width: cropSize * Math.min(displaySize.w, displaySize.h),
                height: cropSize * Math.min(displaySize.w, displaySize.h),
                left: cropX * displaySize.w,
                top: cropY * displaySize.h,
              },
            ]}
            {...panRef.panHandlers}
          />
        </View>

        <View style={{ width: SCREEN_W - 32, marginTop: 10 }}>
          <Text>{coordsText}</Text>
        </View>

        <View style={{ width: SCREEN_W - 32, marginTop: 10 }}>
          <TouchableOpacity
            onPress={cancelPreview}
            style={[styles.smallButton, { backgroundColor: "#ddd" }]}
          >
            <Text>Retake / Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={cropToWebpAndUpload}
            style={styles.saveButton}
          >
            <Text style={{ color: "#fff" }}>Crop → Save (WebP) & Upload</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator style={{ marginTop: 12 }} size="large" />
        )}
      </View>
    );
  }

  // default idle view
  return (
    <View style={{ paddingVertical: 8 }}>
      <Text style={{ marginBottom: 8 }}>{coordsText}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity onPress={openCameraMode} style={styles.actionButton}>
          <Text style={{ color: "#fff" }}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openGallery}
          style={[styles.actionButton, { backgroundColor: "#28a745" }]}
        >
          <Text style={{ color: "#fff" }}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 12 }} size="large" />}
    </View>
  );
}

export default PhotoTabContent;

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: "#0d6efd",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  smallButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#0d6efd",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cropOverlay: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.95)",
    backgroundColor: "rgba(255,255,255,0.0)",
  },
});
