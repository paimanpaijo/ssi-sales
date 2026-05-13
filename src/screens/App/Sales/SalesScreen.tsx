/** @format */

import { useSalesOrderContext } from "@/src/context/App/SalesOrderContext";
import formStyles from "@/src/style/FormStyles";
import React from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Modal,
  PaperProvider,
  Portal,
  Text,
} from "react-native-paper";
import SalesDetail from "./SalesDetail";
import SalesForm from "./SalesForm";
import SalesTable from "./SalesTable";

const SalesScreen = () => {
  const { isForm, isFormDetail, isLoading } = useSalesOrderContext();

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        {/* Konten Utama */}
        {isForm ? (
          <SalesForm />
        ) : isFormDetail ? (
          <SalesDetail />
        ) : (
          <SalesTable />
        )}

        {/* Loading Overlay */}
        <Portal>
          <Modal
            visible={isLoading}
            dismissable={false} // Mencegah user menutup loading dengan menekan area luar
            contentContainerStyle={formStyles.loadingContainer}
          >
            <ActivityIndicator animating={true} color="#6200ee" size="large" />
            <Text style={formStyles.loadingText}>Please wait...</Text>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

export default SalesScreen;
