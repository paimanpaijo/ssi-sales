/** @format */

import { InvoiceContextProvider } from "@/src/context/App/InvoiceContext";
import InvoicesScreen from "@/src/screens/App/Invoice/InvoicesScreen";
import React from "react";

const index = () => {
  return (
    <InvoiceContextProvider>
      <InvoicesScreen />
    </InvoiceContextProvider>
  );
};

export default index;
