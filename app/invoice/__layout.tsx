/** @format */
import { Stack } from "expo-router";

export default function InvoiceLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Invoices",
          headerTitle: "Invoices",
          headerTitleStyle: { fontSize: 16, padding: 10, color: "white" },
        }}
      />
    </Stack>
  );
}
