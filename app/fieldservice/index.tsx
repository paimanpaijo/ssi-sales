/** @format */

import { FieldServiceContextProvider } from "@/src/context/App/FieldServiceContext";
import FieldServiceScreen from "@/src/screens/App/FieldService/FieldServiceScreen";
import React from "react";

function index() {
  return (
    <FieldServiceContextProvider>
      <FieldServiceScreen />
    </FieldServiceContextProvider>
  );
}

export default index;
