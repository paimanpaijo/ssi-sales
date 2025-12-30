/** @format */

import MonthYearPickerModal from "@/src/component/MonthYearPickerModal";
import PagingMobile from "@/src/component/PagingMobile";
import { useDemoManagementContext } from "@/src/context/App/DemoManagementContext";
import { formatDateForDisplay, formatDateIDN } from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Button, Card, FAB } from "react-native-paper";

const DemoManagementTable = () => {
  const {
    demos,
    setIsForm,
    selectedDate,
    setSelectedDate,
    setSelectMonth,
    setSelectYear,
    page,
    setPage,
    totalPage,
    setTotalPage,
    total,
    setTotal,
    handleCheckOut,
    ShowFieldService,
    handleCheckOutShow,
    count_notcheckout,
    isCheckIn,
  } = useDemoManagementContext();
  const [showPicker, setShowPicker] = useState(false);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const renderItemOrder = ({ item, index }) => (
    <Card style={{ paddingHorizontal: 3, marginBottom: 5 }}>
      <Card.Content style={{ paddingHorizontal: 2 }}>
        <View
          style={{
            flexDirection: "row", //  bikin elemen sejajar kiri-kanan
            justifyContent: "space-between", //  beri jarak maksimal di antara elemen
            alignItems: "center", //  sejajarkan vertikal di tengah
            backgroundColor: "lightblue",

            paddingHorizontal: 2,
            borderRadius: 4, // opsional biar rapi
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: 16,
              backgroundColor: "lightblue",
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            {item.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            Activity Date :{" "}
            <Text style={{ fontWeight: "bold" }}>
              {item.x_studio_activity_date
                ? formatDateIDN(item.x_studio_activity_date)
                : ""}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            Start :{" "}
            <Text style={{ fontWeight: "bold" }}>
              {item.x_studio_activity_date
                ? formatDateForDisplay(item.x_studio_start_time)
                : ""}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            End :{" "}
            <Text style={{ fontWeight: "bold" }}>
              {item.x_studio_end_time
                ? formatDateForDisplay(item.x_studio_end_time)
                : ""}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            Customer :{" "}
            <Text style={{ fontWeight: "bold" }}>
              {item.partner_id ? item.partner_id[1] : ""}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            Project :{" "}
            <Text style={{ fontWeight: "bold" }}>
              {item.project_id ? item.project_id[1] : ""}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            Address :{" "}
            <Text style={{ fontWeight: "bold" }}>
              {item.x_studio_address ? item.x_studio_address : ""}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text>
            Stage :{" "}
            <Text style={{ fontWeight: "bold" }}>
              {item.stage_id ? item.stage_id[1] : ""}
            </Text>
          </Text>
        </View>
      </Card.Content>
      <Card.Actions style={{ justifyContent: "flex-end" }}>
        {item.x_studio_end_time ? (
          <Button
            mode="contained"
            style={{ marginRight: 10, backgroundColor: "green" }}
            onPress={() => router.push("/fieldservicedtl/" + item.id)}
          >
            View
          </Button>
        ) : (
          <Button
            mode="contained"
            style={{ marginRight: 10, backgroundColor: "maroon" }}
            onPress={() => {
              handleCheckOutShow(item);
            }}
          >
            Check Out
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
  return (
    <View style={formStyles.wrapper}>
      <Text style={[formStyles.Header, { marginBottom: 0 }]}>
        Field Service
      </Text>
      <View style={{ paddingHorizontal: 15 }}>
        <Button
          mode="contained-tonal"
          onPress={() => setShowPicker(true)}
          style={{
            marginTop: 10,
            borderRadius: 10,
          }}
          icon={"calendar-month"}
        >
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Button>

        <MonthYearPickerModal
          visible={showPicker}
          onDismiss={() => setShowPicker(false)}
          onConfirm={(date) => {
            setSelectedDate(date);
            setSelectMonth(date.getMonth() + 1);
            setSelectYear(date.getFullYear());
          }}
        />
      </View>
      <View style={{ height: 670 }}>
        <FlatList
          data={demos}
          renderItem={renderItemOrder}
          style={{ marginTop: 5, marginHorizontal: 10 }}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
        />
        <PagingMobile
          currentPage={page}
          totalPage={totalPage}
          onPageChange={(pg) => handlePageChange(pg)}
        />
      </View>
      {!isCheckIn && (
        <FAB
          icon="plus-circle-outline"
          color="white"
          size="30"
          onPress={() => setIsForm(true)}
          style={[formStyles.fabBlue, { bottom: 160 }]}
        />
      )}
    </View>
  );
};

export default DemoManagementTable;
