/** @format */

import { DemoManagementContextProvider } from "@/src/context/App/DemoManagementContext";
import DemoManagementScreen from "@/src/screens/App/DemoManagement/DemoManagementScreen";
import React from "react";

function index() {
  return (
    <DemoManagementContextProvider>
      <DemoManagementScreen />
    </DemoManagementContextProvider>
  );
}

export default index;
