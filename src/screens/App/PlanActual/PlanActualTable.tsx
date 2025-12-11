/** @format */

import SelectModalInput from "@/src/component/SelectModalInput";
import { usePlanActualContext } from "@/src/context/App/PlanActualContext";
import { getMonthName } from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, MD2Colors } from "react-native-paper";

const PlanActualTable = () => {
  const {
    setMonth,
    setYear,
    year,
    month,
    mode,
    setMode,
    quarter,
    setQuarter,
    planActualList,
  } = usePlanActualContext();
  const categories = ["Month", "Quarter"];
  const [selected, setSelected] = useState("Month");
  const labelAnim = new Animated.Value(selected ? 1 : 0);

  const [isFocused, setIsFocused] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [years, setYears] = useState(
    Array.from({ length: 5 }, (_, index) => {
      const y = new Date().getFullYear() - (index - 1);
      return { id: y, value: y };
    })
  );
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
  const [months, setMonths] = useState(
    Array.from({ length: 12 }, (_, index) => {
      const m = index + 1;
      return { label: getMonthName(m), id: m, value: m };
    })
  );
  const [quarters, setQuarters] = useState(
    Array.from({ length: 4 }, (_, index) => {
      const q = index + 1;
      return { label: `Q${q}`, id: q, value: q };
    })
  );
  const screenHeight = Dimensions.get("window").height;

  const renderItem = ({ item }) =>
    item.regency != "" && (
      <Card style={{ paddingHorizontal: 0, marginHorizontal: 0 }}>
        <Card.Title
          title={
            <Text style={{ fontWeight: "bold", color: "black", fontSize: 16 }}>
              {item.regency}
            </Text>
          }
          style={{
            backgroundColor: "lightblue",
            alignContent: "center",
            margin: 0,
            justifyContent: "center",
            padding: 0,
          }}
        />
        <Card.Content
          style={{
            alignContent: "center",
            marginHorizontal: 0,
            justifyContent: "center",
            paddingHorizontal: 0,
          }}
        >
          {item.projects.map((p) => (
            <View
              key={p.id}
              style={{
                marginBottom: 5,
                borderBottomColor: MD2Colors.blue100,
                borderBottomWidth: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  margin: 0,
                  padding: 0,
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "skyblue",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "darkblue",
                    fontSize: 16,
                    width: "50%",
                  }}
                >
                  {p.project_name}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "darkblue",
                    fontSize: 16,
                    width: "25%",
                  }}
                >
                  Planing
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "darkblue",
                    fontSize: 16,
                    width: "25%",
                  }}
                >
                  Actual
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  margin: 0,
                  padding: 0,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    fontSize: 16,
                    width: "50%",
                  }}
                >
                  Activity
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    fontSize: 14,
                    width: "25%",
                    textAlign: "right",
                    paddingRight: 25,
                  }}
                >
                  {p.plan_activity}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "oldgray",
                    fontSize: 14,
                    width: "25%",
                    textAlign: "right",
                    paddingRight: 25,
                  }}
                >
                  {p.actual_activity}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  margin: 0,
                  padding: 0,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    fontSize: 16,
                    width: "50%",
                  }}
                >
                  Attendance
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    fontSize: 14,
                    width: "25%",
                    textAlign: "right",
                    paddingRight: 25,
                  }}
                >
                  {p.plan_attendance}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "oldgray",
                    fontSize: 14,
                    width: "25%",
                    textAlign: "right",
                    paddingRight: 25,
                  }}
                >
                  {p.actual_attendance}
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  return (
    <View style={styles.overlay}>
      <Card
        style={[styles.card, { backgroundColor: "white", flex: 1, padding: 0 }]}
      >
        <View style={{ backgroundColor: MD2Colors.blue900 }}>
          <Card.Title
            title={"Plan & Actual"}
            titleStyle={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
            }}
          />
        </View>

        <Card.Content style={{ padding: 0, margin: 0 }}>
          <View style={{ marginBottom: 10 }}>
            <SelectModalInput
              data={years}
              onSelect={(itm) => {
                setYear(itm.value);
              }}
              label="Year"
              placeholder="Year"
              value={year}
              renderHeader={(close) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#0d6efd",
                    padding: 1,
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
          </View>
          <View
            style={[
              formStyles.rowTab,
              {
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                height: 50,
                marginBottom: 5,
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
                  setMode(item.toLowerCase());
                }}
              >
                <View
                  style={[
                    formStyles.radioCircle,
                    selected === item && formStyles.radioSelected,
                  ]}
                />
                <Text style={formStyles.radioText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {mode === "month" ? (
            <SelectModalInput
              data={months}
              onSelect={(itm) => {
                setMonth(itm.value);
              }}
              label="Month"
              placeholder="Month"
              value={month}
              renderHeader={(close) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#0d6efd",
                    padding: 1,
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
          ) : (
            <SelectModalInput
              data={quarters}
              onSelect={(itm) => {
                setQuarter(itm.value);
              }}
              label="Quarter"
              placeholder="Quarter"
              value={quarter}
              renderHeader={(close) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#0d6efd",
                    padding: 1,
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
          )}
          <View style={{ height: screenHeight - 375 }}>
            <FlatList
              data={planActualList}
              renderItem={renderItem}
              style={{
                marginTop: 5,
                marginHorizontal: 0,
                marginBottom: 10,
              }}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default PlanActualTable;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1 },
  overlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 18 : 12,
    left: 0,
    right: 0,
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
  cardText: {
    fontWeight: "bold",
    textAlign: "right",
    color: "black",
    fontSize: 16,
  },

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
