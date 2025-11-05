/** @format */

import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Card, MD2Colors } from "react-native-paper";
import { useHomeContext } from "../context/HomeContext";
import { formatNumber } from "../library/Utility";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const HomeScreen = () => {
  const mapRef = useRef(null);

  const [region, setRegion] = useState({
    latitude: -6.2,
    longitude: 106.816666,
    latitudeDelta: 5.9,
    longitudeDelta: 5.9,
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const {
    TotalMonthly,
    MonthlySales,
    AnnualSales,
    TotalSales,
    amountMonthly,
    amountAnnual,
    fieldservicesList,
  } = useHomeContext();

  // ketika fieldservicesList berubah, hitung center & zoom otomatis
  useEffect(() => {
    if (!fieldservicesList || fieldservicesList.length === 0) return;

    // kumpulkan coords yang valid
    const coords = fieldservicesList
      .map((it) => {
        const lat = parseFloat(it.x_studio_lat);
        const lng = parseFloat(it.x_studio_lang);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return { latitude: lat, longitude: lng };
      })
      .filter(Boolean);

    if (coords.length === 0) return;

    // ---- A) centroid (rata-rata) ----
    const avg = coords.reduce(
      (acc, c) => {
        acc.lat += c.latitude;
        acc.lng += c.longitude;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    avg.lat = avg.lat / coords.length;
    avg.lng = avg.lng / coords.length;

    // ---- B) bounding box untuk menghitung delta ----
    let minLat = coords[0].latitude,
      maxLat = coords[0].latitude,
      minLng = coords[0].longitude,
      maxLng = coords[0].longitude;

    coords.forEach((c) => {
      if (c.latitude < minLat) minLat = c.latitude;
      if (c.latitude > maxLat) maxLat = c.latitude;
      if (c.longitude < minLng) minLng = c.longitude;
      if (c.longitude > maxLng) maxLng = c.longitude;
    });

    const latDiff = Math.abs(maxLat - minLat);
    const lngDiff = Math.abs(maxLng - minLng);

    // padding supaya marker tidak mepet ke tepi layar
    const PAD_FACTOR = 1.2; // 20% padding
    const minDelta = 0.005; // minimal zoom close
    const latitudeDelta = Math.max(latDiff * PAD_FACTOR, minDelta);
    const longitudeDelta = Math.max(lngDiff * PAD_FACTOR, minDelta);

    const newRegion = {
      latitude: avg.lat,
      longitude: avg.lng,
      latitudeDelta,
      longitudeDelta,
    };

    // update state region (agar controlled region berubah)
    setRegion(newRegion);

    // jika ingin animasi dan memastikan semua marker terlihat, gunakan fitToCoordinates
    // (lebih andal bila ada banyak titik yang tersebar)
    if (mapRef.current && coords.length > 1) {
      try {
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 80, right: 40, bottom: 200, left: 40 },
          animated: true,
        });
        return; // kita sudah fitToCoordinates, tidak perlu animateToRegion lagi
      } catch (e) {
        console.warn("fitToCoordinates error", e);
      }
    }

    // fallback: animate ke region yang dihitung
    if (mapRef.current) {
      try {
        mapRef.current.animateToRegion(newRegion, 500);
      } catch (e) {
        console.warn("animateToRegion error", e);
      }
    }
  }, [fieldservicesList]);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {fieldservicesList?.length > 0 &&
          fieldservicesList.map((item, index) => {
            const lat = parseFloat(item.x_studio_lat);
            const lng = parseFloat(item.x_studio_lang);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

            return (
              <Marker
                key={item.id ?? index}
                coordinate={{ latitude: lat, longitude: lng }}
                onPress={() => {
                  setSelectedItem(item);
                }}
              />
            );
          })}
      </MapView>

      {/* Overlay info cards atas */}
      <View style={styles.overlay}>
        <Card
          style={[
            styles.card,
            { backgroundColor: MD2Colors.blue50, flex: 1, padding: 8 },
          ]}
        >
          <Card.Title title={new Date().getFullYear() + " Sales"} />
          <Card.Content>
            <Text style={styles.cardText}>
              {"Rp." +
                formatNumber(TotalSales) +
                " / " +
                formatNumber(amountAnnual)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: MD2Colors.brown50 }]}>
          <Card.Title title="Monthly Sales" />
          <Card.Content>
            <Text style={styles.cardText}>
              {"Rp." +
                formatNumber(TotalMonthly) +
                " / " +
                formatNumber(amountMonthly)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {selectedItem && (
        <View style={styles.detailContainer}>
          <Card style={styles.detailCard}>
            <Card.Title
              title={selectedItem.name || "Detail Lokasi"}
              right={() => (
                <Pressable
                  onPress={() => setSelectedItem(null)}
                  style={styles.closeButtonInline}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </Pressable>
              )}
            />
            <Card.Content>
              {selectedItem.partner_name && (
                <Text style={styles.detailText}>
                  Cust: {selectedItem.partner_name}
                </Text>
              )}
              {selectedItem.x_studio_address && (
                <Text style={styles.detailText}>
                  📍 {selectedItem.x_studio_address}
                </Text>
              )}
              {selectedItem.stage_id && (
                <Text style={[styles.detailText, { color: "#388E3C" }]}>
                  Status: {selectedItem.stage_id[1]}
                </Text>
              )}

              <Pressable
                style={styles.detailButton}
                onPress={() => console.log("Lihat detail", selectedItem)}
              >
                <Text style={styles.detailButtonText}>Lihat detail</Text>
              </Pressable>
            </Card.Content>
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1 },
  overlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 18 : 12,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    zIndex: 1000,
  },
  card: {
    width: "49%",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  cardText: { fontWeight: "bold", textAlign: "right" },

  detailContainer: {
    position: "absolute",
    bottom: 105,
    left: 10,
    right: 10,
    zIndex: 2000,
  },
  detailCard: {
    borderRadius: 12,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: { elevation: 6 },
    }),
  },
  closeButtonInline: {
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#444",
  },
  detailText: { fontSize: 14, marginBottom: 4, color: "#333" },
  detailButton: {
    marginTop: 10,
    backgroundColor: "#1976D2",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  detailButtonText: { color: "white", fontWeight: "bold" },
});
