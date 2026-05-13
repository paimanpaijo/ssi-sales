/** @format */

import {
  getFieldServiceDemo,
  saveHarvestDemo,
  saveMaintenanceDemo,
} from "@/src/api/transaksi/FieldServiceAPI";
import { formatDateForBackendWIB } from "@/src/library/Utility";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../AuthContext";
const DemoManagementContext = createContext();

export const DemoManagementContextProvider = ({ children }) => {
  const [demos, setDemos] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [selectMonth, setSelectMonth] = useState(new Date().getMonth() + 1);
  const [selectYear, setSelectYear] = useState(new Date().getFullYear());
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [count_notcheckout, setCount_NotCheckOut] = useState(0);
  const [isForm, setIsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getFieldServiceDemo(selectMonth, selectYear, user.id, page, 10).then(
      (res) => {
        setDemos(res.data);
        setTotalPage(res.count_page);
      },
    );
  }, [page, selectMonth, selectYear]);

  const handleCheckOut = (id: number, data: any) => {
    // Implementasi fungsi checkout demo management
  };

  const ShowFieldService = (id: number) => {
    // Implementasi fungsi show field service demo management
  };

  const handleCheckOutShow = (id: number) => {
    // Implementasi fungsi handle checkout show demo management
  };

  const exSaveMaintenanceDate = (data) => {
    setIsLoading(true);
    saveMaintenanceDemo(data).then((res) => {
      setIsLoading(false);
      if (res.success) {
        Alert.alert("Success", "Maintenance date saved successfully.");
        // Refresh data setelah penyimpanan berhasil
        getFieldServiceDemo(selectMonth, selectYear, user.id, page, 10).then(
          (res) => {
            setDemos(res.data);
            setTotalPage(res.count_page);
          },
        );
      } else {
        Alert.alert("Error", "Failed to save maintenance date.");
      }
    });
  };
  const handleSaveMaintenance = (id: number, harvest_date: any, note: any) => {
    const dt = {
      id: id,
      x_studio_maintenance_date: formatDateForBackendWIB(harvest_date),
      x_studio_note_maintenance: note,
    };

    Alert.alert("Confirm", "Are you sure you want to save maintenance date?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => exSaveMaintenanceDate(dt),
      },
    ]);
  };

  const handleSaveHarvest = (
    id: number,
    harvest_date: any,
    rendemen: any,
    ubinan: any,
    note: any,
  ) => {
    const dt = {
      id: id,
      x_studio_harvest_date: formatDateForBackendWIB(harvest_date),
      x_studio_rendemen: rendemen,
      x_studio_ubinan: ubinan,
      x_studio_note_harvest: note,
    };
    Alert.alert("Confirm", "Are you sure you want to save harvest date?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => exSaveHarvestDate(dt),
      },
    ]);
  };

  const exSaveHarvestDate = (data) => {
    setIsLoading(true);
    saveHarvestDemo(data).then((res) => {
      setIsLoading(false);
      if (res.success) {
        Alert.alert("Success", "Harvest date saved successfully.");

        // Refresh data setelah penyimpanan berhasil
        getFieldServiceDemo(selectMonth, selectYear, user.id, page, 10).then(
          (res) => {
            setDemos(res.data);
            setTotalPage(res.count_page);
          },
        );
      } else {
        Alert.alert("Error", "Failed to save harvest .");
      }
    });
  };
  return (
    <DemoManagementContext.Provider
      value={{
        demos,
        setDemos,
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
        handleSaveMaintenance,
        handleSaveHarvest,
      }}
    >
      {children}
    </DemoManagementContext.Provider>
  );
};

export const useDemoManagementContext = () => useContext(DemoManagementContext);
