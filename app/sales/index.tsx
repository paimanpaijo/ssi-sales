/** @format */

import { SalesOrderContextProvider } from "@/src/context/App/SalesOrderContext";
import SalesScreen from "@/src/screens/App/Sales/SalesScreen";

import React from "react";

function index() {
  return (
    <SalesOrderContextProvider>
      <SalesScreen />
    </SalesOrderContextProvider>
  );
}

export default index;
