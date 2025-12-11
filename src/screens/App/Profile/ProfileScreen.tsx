/** @format */

import { useAuth } from "@/src/context/AuthContext";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Avatar } from "react-native-paper";

const ProfileScreen = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({});
  const [updateProfile, setIsUpdateProfile] = useState(false);
  const [updatePassword, setIsUpdatePassword] = useState(false);
  const [confirmUpdatePassword, setConfirmUpdatePassword] = useState(false);
  const [confirmUpdateProfile, setConfirmUpdateProfile] = useState(false);
  const [changepasswordData, setChangePasswordData] = useState(null);
  const LeftContent = (props) => (
    <Avatar.Icon {...props} source={{ uri: user.avatar }} />
  );

  return (
    <View>
      <Text>ProfileScreen</Text>
    </View>
  );
};

export default ProfileScreen;
