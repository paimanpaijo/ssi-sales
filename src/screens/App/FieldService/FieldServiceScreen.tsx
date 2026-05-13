/** @format */

import { useFieldServiceContext } from "@/src/context/App/FieldServiceContext";
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
import FieldAddCustomer from "./FieldAddCustomer";
import FieldServiceCheckOut from "./FieldServiceCheckOut";
import FieldServiceForm from "./FieldServiceForm";
import FieldServiceTable from "./FieldServiceTable";

const FieldServiceScreen = () => {
  const { isForm, isFormEdit, addCustomer, isLoading } =
    useFieldServiceContext();

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        {isForm ? (
          <FieldServiceForm />
        ) : isFormEdit ? (
          <FieldServiceCheckOut />
        ) : addCustomer ? (
          <FieldAddCustomer />
        ) : (
          <FieldServiceTable />
        )}
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

export default FieldServiceScreen;
