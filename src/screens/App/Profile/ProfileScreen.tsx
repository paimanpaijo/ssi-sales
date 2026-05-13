/** @format */

import { useUserContext } from "@/src/context/UserContext";
import React from "react";
import { PaperProvider } from "react-native-paper";
import PasswordForm from "./PasswordForm";
import ProfileForm from "./ProfileForm";

const ProfileScreen = () => {
  const { isProfile } = useUserContext();
  return (
    <PaperProvider>
      {isProfile ? <ProfileForm /> : <PasswordForm />}
    </PaperProvider>
  );
};

export default ProfileScreen;
