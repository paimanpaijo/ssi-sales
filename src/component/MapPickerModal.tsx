/** @format */
import axios from "axios";
import Constants from "expo-constants";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { IconButton, Text, TextInput } from "react-native-paper";

const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  Constants.expoConfig?.extra?.googleMapsApiKey;

const MapPickerModal = ({ visible, onClose, onSelectLocation }) => {
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState({
    latitude: -6.2,
    longitude: 106.816666,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // =============================
  // AUTO CURRENT LOCATION
  // =============================
  useEffect(() => {
    if (visible) {
      setTimeout(handleCurrentLocation, 300);
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

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      mapRef.current?.animateToRegion(newRegion, 800);
      setRegion(newRegion);
      setMarker({ latitude, longitude });
    } catch (error) {
      console.warn("Gagal mendapatkan lokasi:", error);
    }
  };

  // =============================
  // ADDRESS FROM COORDS
  // =============================
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            latlng: `${lat},${lng}`,
            key: GOOGLE_MAPS_API_KEY,
            language: "id",
          },
        }
      );

      if (res.data.status === "OK") {
        const r = res.data.results[0];
        const c = r.address_components;

        const find = (t: string) =>
          c.find((x: any) => x.types.includes(t))?.long_name || "";

        return {
          propinsi: find("administrative_area_level_1"),
          kabupaten: find("administrative_area_level_2") || find("locality"),
          kecamatan: find("administrative_area_level_3").replace(
            "Kecamatan",
            ""
          ),
          alamat: r.formatted_address,
        };
      }
      return null;
    } catch (e) {
      console.error("Geocode error:", e);
      return null;
    }
  };

  // =============================
  // AUTOCOMPLETE
  // =============================
  const fetchAutocomplete = async (text: string) => {
    setSearchText(text);
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: text,
            key: GOOGLE_MAPS_API_KEY,
            language: "id",
            components: "country:id",
          },
        }
      );

      if (res.data.status === "OK") {
        setSuggestions(res.data.predictions);
      }
    } catch (e) {
      console.error("Autocomplete error:", e);
    }
  };

  const selectSuggestion = async (placeId: string, description: string) => {
    try {
      setLoadingSearch(true);
      setSearchText(description);
      setSuggestions([]);

      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: GOOGLE_MAPS_API_KEY,
            language: "id",
          },
        }
      );

      if (res.data.status === "OK") {
        const loc = res.data.result.geometry.location;

        const newRegion = {
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };

        // 🔥 FIX UTAMA
        mapRef.current?.animateToRegion(newRegion, 800);

        setRegion(newRegion);
        setMarker({ latitude: loc.lat, longitude: loc.lng });
      }
    } catch (e) {
      console.error("Place detail error:", e);
    } finally {
      setLoadingSearch(false);
    }
  };

  // =============================
  // CONFIRM
  // =============================
  const handleSelect = async () => {
    if (!marker) return;

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
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Address / Location ..."
            value={searchText}
            onChangeText={fetchAutocomplete}
            style={styles.searchInput}
          />
          <IconButton icon="magnify" loading={loadingSearch} />
        </View>

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            {suggestions.map((item) => (
              <Text
                key={item.place_id}
                style={styles.suggestionItem}
                onPress={() =>
                  selectSuggestion(item.place_id, item.description)
                }
              >
                {item.description}
              </Text>
            ))}
          </View>
        )}

        {/* MAP */}
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          mapType="satellite"
          initialRegion={region}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setMarker({ latitude, longitude });
          }}
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.iconContainer}>
            <IconButton
              icon="crosshairs-gps"
              onPress={handleCurrentLocation}
              mode="contained"
              iconColor="white"
              style={{ backgroundColor: "#1976D2" }}
            />
            <Text style={styles.iconLabel}>Current</Text>
          </View>

          <View style={styles.iconContainer}>
            <IconButton
              icon="map-marker-check"
              onPress={handleSelect}
              mode="contained"
              iconColor="white"
              style={{ backgroundColor: "#2E7D32" }}
            />
            <Text style={styles.iconLabel}>Set</Text>
          </View>

          <View style={styles.iconContainer}>
            <IconButton
              icon="close"
              onPress={onClose}
              mode="contained"
              iconColor="white"
              style={{ backgroundColor: "#C62828" }}
            />
            <Text style={styles.iconLabel}>Cancel</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
  },
  suggestionBox: {
    position: "absolute",
    top: 90,
    left: 10,
    right: 10,
    zIndex: 20,
    backgroundColor: "white",
    borderRadius: 8,
    maxHeight: 200,
    elevation: 6,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  footer: {
    position: "absolute",
    bottom: 45,
    width: "97%",
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconContainer: {
    alignItems: "center",
  },
  iconLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default MapPickerModal;
