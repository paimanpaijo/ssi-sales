/** @format */

import { getPlaningactual } from "@/src/api/transaksi/FieldServiceAPI";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

const PlanActualContext = createContext();

export const PlanActualContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [mode, setMode] = useState("month");
  const [quarter, setQuarter] = useState(1);
  const [planActualList, setPlanActualList] = useState([]);
  useEffect(() => {
    getPlaningactual(month, year, user.id, mode, quarter).then((res) => {
      setPlanActualList(res.data);
    });
  }, [year, month, mode, quarter]);

  return (
    <PlanActualContext.Provider
      value={{
        year,
        setYear,
        month,
        setMonth,
        mode,
        setMode,
        quarter,
        setQuarter,
        planActualList,
      }}
    >
      {children}
    </PlanActualContext.Provider>
  );
};

export const usePlanActualContext = () => useContext(PlanActualContext);
