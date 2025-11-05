/** @format */

import React, { createContext, useContext, useEffect, useState } from "react";
import { getFieldService } from "../api/transaksi/FieldServiceAPI";
import { SummarySalesAPI } from "../api/transaksi/SalesAPI";
import { useAuth } from "./AuthContext";

const HomeContext = createContext();

export const HomeContextProvider = ({ children }) => {
  const [value, setValue] = useState(null);
  const { user } = useAuth();
  const [MonthlySales, setMonthlySales] = useState([]);
  const [AnnualSales, setAnnualSales] = useState([]);
  const [TotalSales, setTotalSales] = useState(0);
  const [TotalMonthly, setTotalMonthly] = useState(0);
  const [amountMonthly, setAmountMonthly] = useState(0);
  const [amountAnnual, setAmountAnnual] = useState(0);
  const [fieldservicesList, setFieldserviceList] = useState([]);
  useEffect(() => {
    if (user) {
      SummarySalesAPI(user.id, 0, new Date().getFullYear()).then((res) => {
        setTotalSales(res.total_all);
        setAnnualSales(res.sumary);
        setAmountAnnual(res.total);
      });
      SummarySalesAPI(
        user.id,
        new Date().getMonth() + 1,
        new Date().getFullYear()
      ).then((res) => {
        setMonthlySales(res.sumary);
        setTotalMonthly(res.total_all);
        setAmountMonthly(res.total);
      });
      getFieldService(
        new Date().getMonth() + 1,
        new Date().getFullYear(),
        user.id,
        0,
        0,
        0,
        10
      ).then((res) => {
        setFieldserviceList(res.data);
      });
    }
  }, []);
  return (
    <HomeContext.Provider
      value={{
        TotalMonthly,
        MonthlySales,
        AnnualSales,
        TotalSales,
        amountMonthly,
        amountAnnual,
        fieldservicesList,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => useContext(HomeContext);
