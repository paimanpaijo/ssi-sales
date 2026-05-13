/** @format */

import { useApprovalContext } from "@/src/context/App/ApprovalContext";
import React from "react";
import { PaperProvider } from "react-native-paper";
import SalesApprovalForm from "./SalesApprovalForm";
import SalesApprovalTable from "./SalesApprovalTable";

function SalesApprovalScreen() {
  const { isForm } = useApprovalContext();
  return (
    <PaperProvider>
      {isForm ? <SalesApprovalForm /> : <SalesApprovalTable />}
    </PaperProvider>
  );
}

export default SalesApprovalScreen;
