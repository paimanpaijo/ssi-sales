/** @format */

import dashboardStyles from "@/src/style/dashboardStyles";
import { ScrollView, View } from "react-native";
import { Card, Text } from "react-native-paper";

export default function DashboardScreen() {
  return (
    <ScrollView contentContainerStyle={dashboardStyles.scrollContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",

          paddingVertical: 2,
          paddingHorizontal: 10,
          borderRadius: 4,
        }}
      >
        <Card style={[dashboardStyles.card, { width: "49%" }]}>
          <Card.Title title="Total Sales" />
          <Card.Content>
            <Text>Rp 10.000.000</Text>
          </Card.Content>
        </Card>

        <Card style={[dashboardStyles.card, { width: "49%" }]}>
          <Card.Title title="Monthly Sales" />
          <Card.Content>
            <Text>Rp 1.000.000</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}
