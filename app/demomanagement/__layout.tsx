/** @format */
import { Stack } from "expo-router";

export default function DemoManagementLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Demo Management",
          headerTitle: "Demo Management",

          headerTitleStyle: { fontSize: 16, padding: 10, color: "white" },
        }}
      />
    </Stack>
  );
}
