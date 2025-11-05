/** @format */

import { CustomerContextProvider } from "@/src/context/App/CustomerContext";
import CustomerScreen from "@/src/screens/App/Customer/CustomerScreen";
import React from "react";

function index() {
  return (
    <CustomerContextProvider>
      <CustomerScreen />
    </CustomerContextProvider>
  );
}

export default index;
