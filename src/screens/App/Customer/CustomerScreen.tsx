/** @format */

import { useCustomerContext } from "@/src/context/App/CustomerContext";
import React from "react";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import CustomerForm from "./CustomerForm";
import CustomerTable from "./CustomerTable";

const CustomerScreen = () => {
  const { isForm } = useCustomerContext();

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        {isForm ? <CustomerForm /> : <CustomerTable />}
      </View>
    </PaperProvider>
  );
};

export default CustomerScreen;
