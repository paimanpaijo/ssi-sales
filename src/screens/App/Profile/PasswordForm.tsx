/** @format */

import { useAuth } from "@/src/context/AuthContext";
import { useUserContext } from "@/src/context/UserContext";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Avatar, Button, Card, MD2Colors, TextInput } from "react-native-paper";

const PasswordForm = () => {
  const { user } = useAuth();
  const {
    currentPwd,
    setCurrentPwd,
    newPwd,
    setNewPwd,
    confirmPwd,
    setConfirmPwd,
    setIsProfile,
    handleChangePassword,
  } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View>
      <Card
        style={{
          borderRadius: 16,
          alignContent: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: 20,
          paddingVertical: 10,
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          width: "95%",
        }}
      >
        {/* HEADER */}
        <Card.Title
          title={"Profile"}
          subtitle={user.name}
          titleStyle={{ color: "#111", fontWeight: "bold" }}
          subtitleStyle={{ color: "#666" }}
          left={() => <Avatar.Image size={50} source={{ uri: user.avatar }} />}
        />
        <Card.Content>
          {/* AVATAR BESAR */}

          {/* INFO USER */}
          <View
            style={{
              gap: 12,
              marginVertical: 30,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              Change Password
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                mode="outlined"
                label="Current Password"
                left={<TextInput.Icon icon="lock" />}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                value={currentPwd}
                style={{ flex: 1 }}
                onChangeText={(text) => setCurrentPwd(text)}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                mode="outlined"
                label="New Password"
                left={<TextInput.Icon icon="lock" />}
                value={newPwd}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={{ flex: 1 }}
                onChangeText={(text) => setNewPwd(text)}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                mode="outlined"
                label="Confirm New Password"
                left={<TextInput.Icon icon="lock" />}
                value={confirmPwd}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={{ flex: 1 }}
                onChangeText={(text) => setConfirmPwd(text)}
              />
            </View>
          </View>
        </Card.Content>
        {/* ACTION BUTTON */}
        <Card.Actions
          style={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginTop: 10,
          }}
        >
          <Button
            mode="contained"
            style={{
              flex: 1,
              marginRight: 8,
              borderRadius: 10,
            }}
            onPress={() => handleChangePassword()}
          >
            Change
          </Button>

          <Button
            mode="outlined"
            style={{
              flex: 1,
              marginLeft: 8,
              borderRadius: 10,
              backgroundColor: MD2Colors.yellow300,
            }}
            onPress={() => setIsProfile(true)}
          >
            Cancel
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default PasswordForm;
