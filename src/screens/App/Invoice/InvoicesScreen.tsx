/** @format */

import React from "react";
import { PaperProvider } from "react-native-paper";
import InvoicesTable from "./InvoicesTable";

const InvoicesScreen = () => {
  return (
    <PaperProvider>
      <InvoicesTable />
    </PaperProvider>
  );
};

export default InvoicesScreen;
