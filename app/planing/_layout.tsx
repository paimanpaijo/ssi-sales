/** @format */
import { Stack } from "expo-router";

export default function PlaningLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Planning and Actuals",
          headerTitle: "Planning and Actuals",
          headerTitleStyle: { fontSize: 16, padding: 10, color: "white" },
        }}
      />
    </Stack>
  );
}
