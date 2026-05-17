/** @format */

import MonthYearPickerModal from "@/src/component/MonthYearPickerModal";
import PagingMobile from "@/src/component/PagingMobile";
import { useDemoManagementContext } from "@/src/context/App/DemoManagementContext";
import { formatDateForDisplay, getMapDirection } from "@/src/library/Utility";
import formStyles from "@/src/style/FormStyles";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SafeAreaView } from "react-native-safe-area-context";

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
    handleSaveMaintenance,
    handleSaveHarvest,
    // Pastikan setCustomer ada di context kamu
    // setCustomer,
  } = useDemoManagementContext();

  const [showPicker, setShowPicker] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleDate, setVisibleDate] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [visibleTime, setVisibleTime] = useState(false);
  const [maintenanceDate, setMaintenanceDate] = useState(new Date());
  const [noteMaintenance, setNoteMaintenance] = useState("");
  const [noteHarvest, setNoteHarvest] = useState("");
  const [visibleHarvestDate, setVisibleHarvestDate] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [harvestDate, setHarvestDate] = useState(new Date());
  const [harvestRendement, setHarvestRendement] = useState(0);
  const [harvestUbinan, setHarvestUbinan] = useState(0);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Komponen pembantu untuk baris data agar kode lebih bersih
  const DataRow = ({ label, value }: { label: string; value: any }) => (
    <View style={styles.dataRow}>
      <Text>
        {label} : <Text style={{ fontWeight: "bold" }}>{value || ""}</Text>
      </Text>
    </View>
  );

  const renderItemOrder = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content style={{ paddingHorizontal: 2 }}>
        <View style={styles.headerRow}>
          <Text style={styles.taskName}>{item.task_name}</Text>
        </View>

        <DataRow
          label="Activity Date"
          value={
            item.activity_date ? formatDateForDisplay(item.activity_date) : ""
          }
        />
        <DataRow
          label="Plant"
          value={item.plant_date ? formatDateForDisplay(item.plant_date) : ""}
        />
        <DataRow label="Product Name" value={item.product_name} />
        <DataRow label="Customer" value={item.customer_name} />
        <DataRow label="Address" value={item.address} />

        {item.maintenance_date && (
          <DataRow
            label="Maintenance Date"
            value={formatDateForDisplay(item.maintenance_date)}
          />
        )}
        {item.harvest_date && (
          <DataRow
            label="Harvest Date"
            value={formatDateForDisplay(item.harvest_date)}
          />
        )}
      </Card.Content>

      <Card.Actions style={{ justifyContent: "flex-end" }}>
        <View style={styles.actionButtonWrapper}>
          <IconButton
            icon="directions"
            size={18}
            iconColor="green"
            style={{ backgroundColor: "lightgreen" }}
            onPress={() => {
              getMapDirection(item.lat, item.lang);
            }}
          />
          <Text style={styles.actionText}>Directions</Text>
        </View>
        {!item.maintenance_date && (
          <View style={styles.actionButtonWrapper}>
            <IconButton
              icon="hand-coin-outline"
              size={18}
              iconColor="black"
              style={{ backgroundColor: "lightblue" }}
              onPress={() => {
                setSelectedItem(item); // Simpan data item yang dipilih
                setMaintenanceDate(new Date());
                setShowMaintenanceModal(true); // Buka modal
              }}
            />
            <Text style={styles.actionText}>Maintenance</Text>
          </View>
        )}
        {!item.harvest_date && (
          <View style={styles.actionButtonWrapper}>
            <IconButton
              icon="sickle"
              size={18}
              iconColor="white"
              style={{ backgroundColor: "blue" }}
              onPress={() => {
                setSelectedItem(item);
                setHarvestDate(new Date());
                setHarvestRendement(0);
                setHarvestUbinan(0); // Membutuhkan setCustomer dari context
                setShowHarvestModal(true); // Buka modal
              }}
            />
            <Text style={styles.actionText}>Harvest</Text>
          </View>
        )}
      </Card.Actions>
    </Card>
  );

  return (
    <View style={formStyles.wrapper}>
      <Text style={[formStyles.Header, { marginBottom: 0 }]}>
        Demo Management
      </Text>

      <View style={{ paddingHorizontal: 15 }}>
        <Button
          mode="contained-tonal"
          onPress={() => setShowPicker(true)}
          style={{ marginTop: 10, borderRadius: 10 }}
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

      {/* Gunakan flex: 1 agar responsif di berbagai ukuran layar */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={demos}
          renderItem={renderItemOrder}
          style={{ marginTop: 5, marginHorizontal: 10 }}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        <SafeAreaView edges={["bottom"]}>
          <View style={{ paddingVertical: 10 }}>
            <PagingMobile
              currentPage={page}
              totalPage={totalPage}
              onPageChange={handlePageChange}
            />
          </View>
        </SafeAreaView>
      </View>
      {/* Modal Form Maintenance */}
      <Portal>
        <Modal
          visible={showMaintenanceModal}
          onDismiss={() => setShowMaintenanceModal(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
            Maintenance Date
          </Text>

          <Text style={{ marginBottom: 5 }}>
            Task: {selectedItem?.task_name}
          </Text>

          {/* Kamu bisa menggunakan DatePicker di sini */}

          <Button
            mode="outlined"
            onPress={() => {
              setVisibleDate(true);
            }}
            style={{ marginBottom: 20, borderRadius: 5 }}
          >
            {maintenanceDate.toDateString()}
          </Button>
          <TextInput
            mode="outlined"
            label="Note"
            multiline={true}
            numberOfLines={4}
            style={{ marginBottom: 20, borderRadius: 5, height: 100 }}
            value={noteMaintenance}
            onChangeText={(text) => setNoteMaintenance(text)}
          />

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              onPress={() => {
                setShowMaintenanceModal(false);
                setMaintenanceDate(new Date());
                setNoteMaintenance("");
              }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                // Panggil fungsi submit ke API di sini
                handleSaveMaintenance(
                  selectedItem?.id,
                  maintenanceDate,
                  noteMaintenance,
                );
                setShowMaintenanceModal(false);
                setMaintenanceDate(new Date());
                setNoteMaintenance("");
              }}
              style={{ marginLeft: 10 }}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={showHarvestModal}
          onDismiss={() => setShowHarvestModal(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
            Harvest Date
          </Text>

          <Text style={{ marginBottom: 5 }}>
            Task: {selectedItem?.task_name}
          </Text>

          {/* Kamu bisa menggunakan DatePicker di sini */}

          <Button
            mode="outlined"
            onPress={() => {
              setVisibleHarvestDate(true);
            }}
            style={{ marginBottom: 20, borderRadius: 5 }}
          >
            {harvestDate.toDateString()}
          </Button>
          <TextInput
            label="Rendement (%) "
            mode="outlined"
            value={harvestRendement}
            onChangeText={(text) => setHarvestRendement(text)}
            keyboardType="numeric"
            style={{ marginBottom: 20, backgroundColor: "white" }}
          />
          <TextInput
            label="Ubinan (mt/Ha) "
            value={harvestUbinan}
            mode="outlined"
            onChangeText={(text) => setHarvestUbinan(text)}
            keyboardType="numeric"
            style={{ marginBottom: 20, backgroundColor: "white" }}
          />
          <TextInput
            mode="outlined"
            label="Note"
            multiline={true}
            numberOfLines={4}
            style={{ marginBottom: 20, borderRadius: 5, height: 100 }}
            value={noteHarvest}
            onChangeText={(text) => {
              setNoteHarvest(text);
            }}
          />

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              onPress={() => {
                setShowHarvestModal(false);
                setHarvestDate(new Date());
                setHarvestRendement(0);
                setHarvestUbinan(0);
                setNoteHarvest("");
              }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                handleSaveHarvest(
                  selectedItem?.id,
                  harvestDate,
                  harvestRendement,
                  harvestUbinan,
                  noteHarvest,
                );
                setShowHarvestModal(false);
                setHarvestDate(new Date());
                setHarvestRendement("0");
                setHarvestUbinan("0");
                setNoteHarvest("");
              }}
              style={{ marginLeft: 10 }}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
      <DatePickerModal
        locale="id"
        mode="single"
        visible={visibleDate}
        date={tempDate}
        onDismiss={() => setVisibleDate(false)}
        onConfirm={({ date }) => {
          setVisibleDate(false);

          setMaintenanceDate(date);

          setVisibleTime(true);
        }}
      />
      <DatePickerModal
        locale="id"
        mode="single"
        visible={visibleHarvestDate}
        date={tempDate}
        onDismiss={() => setVisibleHarvestDate(false)}
        onConfirm={({ date }) => {
          setVisibleHarvestDate(false);
          setHarvestDate(date);

          setVisibleTime(true);
        }}
      />
    </View>
  );
};

// Styles tambahan untuk merapikan renderItem
const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 3,
    marginBottom: 8,
    backgroundColor: "white",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "lightblue",
    borderRadius: 4,
    marginBottom: 4,
  },
  taskName: {
    fontWeight: "bold",
    color: "black",
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  actionButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  actionText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
    marginTop: -8,
    opacity: 0.7,
  },
});

export default DemoManagementTable;
