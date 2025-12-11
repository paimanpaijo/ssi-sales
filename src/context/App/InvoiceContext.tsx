/** @format */

import {
  getListInvoice,
  getSummaryInvoice,
} from "@/src/api/transaksi/SalesAPI";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

const InvoiceContext = createContext();

export const InvoiceContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState([]);
  const [summarydata, setSummaryData] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    console.log("useEffect");
    if (!user) {
      return;
    }
    getSummaryInvoice(user.id, 0, year).then((res) => {
      setSummaryData(res);
      setSummary(res.summary);
    });
  }, []);
  useEffect(() => {
    if (!user) {
      return;
    }
    getListInvoice(user.id, 0, year, page, 10).then((res) => {
      setInvoices(res.invoices);
      setTotalPage(res.total_page);

      setTotal(res.total_invoices);
    });
  }, [month, year, page, user]);
  return (
    <InvoiceContext.Provider
      value={{
        summary,
        setSummary,
        invoices,
        setInvoices,
        summarydata,
        page,
        setPage,
        year,
        setYear,
        month,
        setMonth,
        totalPage,
        setTotalPage,
        total,
        setTotal,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = () => useContext(InvoiceContext);
