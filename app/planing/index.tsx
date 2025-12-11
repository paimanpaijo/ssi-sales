/** @format */

import { PlanActualContextProvider } from "@/src/context/App/PlanActualContext";
import PlanActualScreen from "@/src/screens/App/PlanActual/PlanActualScreen";

import React from "react";

function index() {
  return (
    <PlanActualContextProvider>
      <PlanActualScreen />
    </PlanActualContextProvider>
  );
}

export default index;
