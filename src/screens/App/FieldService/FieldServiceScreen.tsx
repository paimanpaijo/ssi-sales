/** @format */

import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
import React from "react";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import FieldServiceCheckOut from "./FieldServiceCheckOut";
import FieldServiceForm from "./FieldServiceForm";
import FieldServiceTable from "./FieldServiceTable";

const FieldServiceScreen = () => {
  const { isForm, isFormEdit } = useFieldServiceContext();

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        {isForm ? (
          <FieldServiceForm />
        ) : isFormEdit ? (
          <FieldServiceCheckOut />
        ) : (
          <FieldServiceTable />
        )}
      </View>
    </PaperProvider>
  );
};

export default FieldServiceScreen;
