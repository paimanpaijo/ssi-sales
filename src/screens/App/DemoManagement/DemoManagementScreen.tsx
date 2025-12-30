/** @format */

import React from "react";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import DemoManagementTable from "./DemoManagementTable";

const DemoManagementScreen = () => {
  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <DemoManagementTable />
      </View>
    </PaperProvider>
  );
};

export default DemoManagementScreen;
