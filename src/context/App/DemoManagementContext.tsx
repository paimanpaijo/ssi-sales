/** @format */

import { getFieldService } from "@/src/api/transaksi/FieldServiceAPI";
import React, { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    getFieldService(
      selectMonth,
      selectYear,
      user.id,
      0,
      0,
      page,
      10,
      "demo"
    ).then((res) => {
      setDemos(res.data);
      setTotalPage(res.count_page);
    });
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
      }}
    >
      {children}
    </DemoManagementContext.Provider>
  );
};

export const useDemoManagementContext = () => useContext(DemoManagementContext);
