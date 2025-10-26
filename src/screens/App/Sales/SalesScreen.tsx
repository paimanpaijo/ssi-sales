/** @format */

import { useSalesOrderContext } from "@/src/context/App/SalesOrderContext";
import React from "react";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import SalesForm from "./SalesForm";
import SalesTable from "./SalesTable";

const SalesScreen = () => {
  const { isForm } = useSalesOrderContext();

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>{isForm ? <SalesForm /> : <SalesTable />}</View>
    </PaperProvider>
  );
};

export default SalesScreen;
