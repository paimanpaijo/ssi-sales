/** @format */

import { ApprovalContextProvider } from "@/src/context/App/ApprovalContext";
import SalesApprovalScreen from "@/src/screens/App/Approval/Sales/SalesApprovalScreen";
import React from "react";

function index() {
  return (
    <ApprovalContextProvider>
      <SalesApprovalScreen />
    </ApprovalContextProvider>
  );
}

export default index;
