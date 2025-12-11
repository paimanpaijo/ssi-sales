/** @format */

import PagingMobile from "@/src/component/PagingMobile";
import { useInvoiceContext } from "@/src/context/App/InvoiceContext";
import {
  formatDateIDN,
  formatNumber,
  getDateDifferenceInDays,
} from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { Card, MD2Colors } from "react-native-paper";

const InvoicesTable = () => {
  const { summary, invoices, summarydata, page, totalPage, total, setPage } =
    useInvoiceContext();

  const renderItem = ({ item }) => (
    <Card
      style={{ paddingHorizontal: 0, marginBottom: 10, marginHorizontal: 0 }}
    >
      <Card.Title
        title={
          <Text
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: 16,
              backgroundColor: "lightblue",
              flexShrink: 1,
              flexWrap: "wrap", // penting: biar teks panjang turun ke bawah
              width: "100%",
            }}
          >
            {item.partner_id ? item.partner_id[1] : "-"}
          </Text>
        }
        style={{
          backgroundColor: "lightblue",
          alignContent: "center",
          marginHorizontal: 0,
          justifyContent: "center",
          paddingHorizontal: 0,
        }}
      />
      <Card.Content
        style={{
          paddingHorizontal: 7,
          borderColor: "lightgray",
          borderWidth: 1,
        }}
      >
        <View
          style={{
            paddingHorizontal: 2,
            borderRadius: 4, // opsional biar rapi
          }}
        >
          <View style={[formStyles.rowTab, { alignItems: "top" }]}>
            <Text style={{ color: "black", fontSize: 14, width: "25%" }}>
              Inv No
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 14,
                width: "75%",
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}
            >
              {item.name}
            </Text>
          </View>
          <View style={[formStyles.rowTab, { alignItems: "top" }]}>
            <Text style={{ color: "black", fontSize: 14, width: "25%" }}>
              Inv. Date
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 14,
                width: "75%",
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}
            >
              {formatDateIDN(item.invoice_date)}
            </Text>
          </View>
          <View style={[formStyles.rowTab, { alignItems: "top" }]}>
            <Text style={{ color: "black", fontSize: 14, width: "25%" }}>
              Due Date
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 14,
                width: "40%",
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}
            >
              {formatDateIDN(item.invoice_date_due)}
            </Text>
            {getDateDifferenceInDays(item.invoice_date_due, new Date()) >= 0 ? (
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 14,
                  width: "40%",
                  paddingVertical: 0,
                  paddingHorizontal: 2,
                  backgroundColor: "red",
                  textAlign: "center",
                }}
              >
                {getDateDifferenceInDays(item.invoice_date_due, new Date()) +
                  " days due"}
              </Text>
            ) : (
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 14,
                  width: "40%",
                  paddingVertical: 0,
                  paddingHorizontal: 0,

                  textAlign: "center",
                }}
              >
                {""}
              </Text>
            )}
          </View>
          <View style={[formStyles.rowTab, { alignItems: "top" }]}>
            <Text style={{ color: "black", fontSize: 14, width: "25%" }}>
              Amount
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 14,
                width: "75%",
                paddingVertical: 0,
                paddingHorizontal: 0,
                textAlign: "right",
              }}
            >
              {formatNumber(item.amount_total)}
            </Text>
          </View>
          <View style={[formStyles.rowTab, { alignItems: "top" }]}>
            <Text style={{ color: "black", fontSize: 14, width: "25%" }}>
              Paid
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 14,
                width: "75%",
                paddingVertical: 0,
                paddingHorizontal: 0,
                textAlign: "right",
              }}
            >
              {formatNumber(item.total_paid)}
            </Text>
          </View>
          <View style={[formStyles.rowTab, { alignItems: "top" }]}>
            <Text style={{ color: "black", fontSize: 14, width: "25%" }}>
              Balance
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 14,
                width: "75%",
                paddingVertical: 0,
                paddingHorizontal: 0,
                textAlign: "right",
                marginBottom: "5",
              }}
            >
              {formatNumber(item.amount_total - item.total_paid)}
            </Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions
        style={{
          justifyContent: "flex-end",
          marginVertical: 0,
          paddingVertical: 0,
        }}
      ></Card.Actions>
    </Card>
  );
  return (
    <View style={styles.overlay}>
      <Card
        style={[styles.card, { backgroundColor: "white", flex: 1, padding: 0 }]}
      >
        <View style={{ backgroundColor: MD2Colors.blue900 }}>
          <Card.Title
            title={"Collection"}
            titleStyle={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
            }}
          />
        </View>

        <Card.Content style={{ padding: 0, margin: 0 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.cardText}>
              As Of:
              {summarydata.period
                ? formatDateIDN(new Date(summarydata.period))
                : "-"}
            </Text>
          </View>
          {summary.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <Text>{item.description}</Text>
              {item.description.includes("Overdue") ? (
                <Text
                  style={[
                    styles.cardText,
                    {
                      color: "red",
                      fontWeight: "bold",
                      textDecorationStyle: "solid",
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  {formatNumber(item.total_unpaid)}
                </Text>
              ) : (
                <Text style={styles.cardText}>
                  {formatNumber(item.total_unpaid)}
                </Text>
              )}
            </View>
          ))}
          <View style={{ height: 610 }}>
            <FlatList
              data={invoices}
              renderItem={renderItem}
              style={{ marginTop: 5, marginHorizontal: 0 }}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
            />
            <PagingMobile
              style={{ marginBottom: 100 }}
              currentPage={page}
              totalPage={totalPage}
              onPageChange={(pg) => setPage(pg)}
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default InvoicesTable;

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
