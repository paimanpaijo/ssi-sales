/** @format */
import { HomeContextProvider } from "@/src/context/HomeContext";
import HomeScreen from "@/src/screens/HomeScreen";

export default function DashboardScreen() {
  return (
    <HomeContextProvider>
      <HomeScreen />
    </HomeContextProvider>
  );
}
