/** @format */

import React, { createContext, useContext, useState } from "react";
import { apiUpdatePassword, apiUpdateProfile } from "../api/auth";
import { updateEmployee } from "../api/master/EmployeeAPI";
import { cleanBase64Image } from "../library/Utility";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [userData, setUserData] = useState({});
  const [isProfile, setIsProfile] = useState(true);
  const [imageData, setImageData] = useState(null);

  const [image, setImage] = useState(user?.avatar);
  const handleUpdateProfile = () => {
    let frmData = new FormData();

    if (image) {
      frmData.append("file", {
        uri: image,
        name: "avatar.jpg",
        type: "image/jpeg",
      });
    }

    frmData.append("name", user.name);
    frmData.append("email", user.email);
    frmData.append("phone", user.phone || "");
    frmData.append("phone2", user.phone2 || "");
    frmData.append("username", user.username || "");
    frmData.append("id", user.zurra_id.toString());

    apiUpdateProfile(frmData).then((res) => {
      if (res && res.success) {
        setIsProfile(true); // back to profile view
        setUser((prev) => ({
          ...prev,
          avatar: res.data.avatar,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
        }));
        const dataOdoo = {
          employee_id: user.id,
          name: res.data.name,
          phone: res.data.phone,
          image: cleanBase64Image(res.data.avatar),
        };
        updateEmployee(dataOdoo).then((res) => {
          if (res && res.success) {
            alert("Profile updated successfully.");
          }
        });
      } else {
        alert("Failed to update profile.");
      }
    });
  };

  const handleChangePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      alert("All fields are required.");
      return;
    }
    if (newPwd !== confirmPwd) {
      alert("New password and confirm password do not match.");
      return;
    }
    const data = {
      password: currentPwd,
      confirmPassword: confirmPwd,
      id: user.zurra_id,
      newPassword: newPwd,
    };

    apiUpdatePassword(data).then((res) => {
      if (res && res.success) {
        alert("Password updated successfully.");
        // clear fields
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
        setIsProfile(true); // back to profile view
      } else {
        alert("Failed to update password. Please check your current password.");
      }
    });
  };
  const handleOnChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <UserContext.Provider
      value={{
        currentPwd,
        setCurrentPwd,
        newPwd,
        setNewPwd,
        confirmPwd,
        setConfirmPwd,
        userData,
        setUserData,
        isProfile,
        setIsProfile,
        handleUpdateProfile,
        handleChangePassword,
        handleOnChange,
        image,
        setImage,
        setImageData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
