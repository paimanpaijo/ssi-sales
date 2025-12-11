/** @format */
import { Stack } from "expo-router";

export default function FieldServiceDtlLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          title: "Field Service Detail",
          headerTitle: "Field Service Detail",
          headerTitleStyle: { fontSize: 16, padding: 10, color: "white" },
        }}
      />
    </Stack>
  );
}
