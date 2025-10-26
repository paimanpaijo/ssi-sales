/** @format */
import axios from "axios";
import Constants from "expo-constants";
import * as Location from "expo-location";
import React, { useState } from "react";
import { Dimensions, Modal, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-paper";

const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  Constants.expoConfig?.extra?.googleMapsApiKey;

const { width, height } = Dimensions.get("window");

const MapPickerModal = ({ visible, onClose, onSelectLocation }) => {
  const [region, setRegion] = useState({
    latitude: -6.2,
    longitude: 106.816666,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = useState(null);

  const handleCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const location = await Location.getCurrentPositionAsync({});
    setRegion({
      ...region,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setMarker(location.coords);
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
        const provinsi = findComponent("administrative_area_level_1") || "";

        return {
          propinsi: provinsi,
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

      if (detail) {
        onSelectLocation({
          lat: marker.latitude,
          lng: marker.longitude,
          detail,
        });
      } else {
        onSelectLocation({
          lat: marker.latitude,
          lng: marker.longitude,
          detail: {
            propinsi: "",
            kabupaten: "",
            kecamatan: "",
            alamat: "",
          },
        });
      }

      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        {/* ✅ Search Box */}

        {/* ✅ Peta */}
        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation
          showsMyLocationButton
          
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setMarker({ latitude, longitude });
          }}
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>

        {/* ✅ Tombol Aksi */}
        <View style={styles.footer}>
          <Button mode="contained" onPress={handleCurrentLocation}>
            Current Location
          </Button>
          <Button mode="contained" onPress={handleSelect}>
            Pilih Lokasi
          </Button>
          <Button onPress={onClose} textColor="red">
            Tutup
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  autocompleteContainer: {
    position: "absolute",
    top: 40,
    width: width - 20,
    alignSelf: "center",
    zIndex: 1,
  },
  footer: {
    position: "absolute",
    top: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default MapPickerModal;
