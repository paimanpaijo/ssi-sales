/** @format */
import { Stack } from "expo-router";

export default function SalesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Sales Order",
          headerTitle: "Sales Order",
          headerTitleStyle: { fontSize: 16, padding: 10, color: "white" },
        }}
      />
    </Stack>
  );
}
