/** @format */

import React from "react";
import { PaperProvider } from "react-native-paper";
import PlanActualTable from "./PlanActualTable";

const PlanActualScreen = () => {
  return (
    <PaperProvider>
      <PlanActualTable />
    </PaperProvider>
  );
};

export default PlanActualScreen;
