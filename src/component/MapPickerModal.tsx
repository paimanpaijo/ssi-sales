/** @format */
import axios from "axios";
import Constants from "expo-constants";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Dimensions, Modal, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { IconButton, Text } from "react-native-paper";

const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  Constants.expoConfig?.extra?.googleMapsApiKey;

const { width } = Dimensions.get("window");

const MapPickerModal = ({ visible, onClose, onSelectLocation }) => {
  const [region, setRegion] = useState({
    latitude: -6.2,
    longitude: 106.816666,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = useState(null);

  // ✅ Saat modal terbuka, langsung ambil lokasi terkini
  useEffect(() => {
    if (visible) {
      handleCurrentLocation();
    }
  }, [visible]);

  const handleCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = location.coords;

      setRegion({
        ...region,
        latitude,
        longitude,
      });
      setMarker({ latitude, longitude });
    } catch (error) {
      console.warn("Gagal mendapatkan lokasi:", error);
    }
  };

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=id`
      );

      if (response.data.status === "OK") {
        const result = response.data.results[0];
        const components = result.address_components;

        const findComponent = (type: string) =>
          components.find((c) => c.types.includes(type))?.long_name || "";

        const alamat = result.formatted_address || "";
        const kecamatan =
          findComponent("administrative_area_level_3").replace(
            "Kecamatan",
            ""
          ) ||
          findComponent("sublocality").replace("Kecamatan", "") ||
          "";
        const kabupaten =
          findComponent("administrative_area_level_2") ||
          findComponent("locality") ||
          "";
        const propinsi = findComponent("administrative_area_level_1") || "";

        return {
          propinsi,
          kabupaten,
          kecamatan,
          alamat,
        };
      } else {
        console.warn("Geocoding gagal:", response.data.status);
        return null;
      }
    } catch (err) {
      console.error("Error getAddressFromCoords:", err);
      return null;
    }
  };

  const handleSelect = async () => {
    if (marker) {
      const detail = await getAddressFromCoords(
        marker.latitude,
        marker.longitude
      );

      onSelectLocation({
        lat: marker.latitude,
        lng: marker.longitude,
        detail: detail || {
          propinsi: "",
          kabupaten: "",
          kecamatan: "",
          alamat: "",
        },
      });

      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setMarker({ latitude, longitude });
          }}
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>

        <View style={styles.footer}>
          <View style={styles.iconContainer}>
            <IconButton
              icon="crosshairs-gps"
              onPress={handleCurrentLocation}
              mode="contained"
              iconColor="white"
              size={25}
              style={{ backgroundColor: "blue" }}
            />
            <Text style={styles.iconLabel}>Current Location</Text>
          </View>

          <View style={styles.iconContainer}>
            <IconButton
              icon="map-marker-radius"
              onPress={handleSelect}
              mode="contained"
              iconColor="white"
              size={25}
              style={{ backgroundColor: "green" }}
            />
            <Text style={styles.iconLabel}>Set Location</Text>
          </View>

          <View style={styles.iconContainer}>
            <IconButton
              icon="close"
              onPress={onClose}
              mode="contained"
              iconColor="white"
              size={25}
              style={{ backgroundColor: "red" }}
            />
            <Text style={styles.iconLabel}>Cancel</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 45,
    width: "97%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 💡 semi transparan
    borderRadius: 10,
    margin: 5,
    paddingVertical: 1,

    padding: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 1,
    fontWeight: "bold",
  },
});

export default MapPickerModal;
