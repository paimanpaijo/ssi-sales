/** @format */
import { Stack } from "expo-router";

export default function ApprovalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Approval",
          headerTitle: "Approval Sales Order",
          headerTitleStyle: { fontSize: 16, padding: 10, color: "white" },
        }}
      />
    </Stack>
  );
}
