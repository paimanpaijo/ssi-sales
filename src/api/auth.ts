/** @format */

import axios from "axios";
import Constants from "expo-constants";
import { getToken } from "../library/Storage";

const { apiUrlOdoo, apiURLZurra } = Constants.expoConfig.extra;

export async function login(email: string, password: string) {
  const url = apiURLZurra + "/login";

  const sts = "mobile";
  const response = await axios.post(
    url,
    { email, password, sts },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data; // misal { token, user }
}

export async function logout() {
  return api.post("/logout");
}

export const apiUpdatePassword = async (frmdata) => {
  const token = await getToken();
  console.log("Token for password update:", token);
  const url = `${apiURLZurra}/user/changepassword`;
  console.log("API URL for password update:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: frmdata,
  });

  const datax = await res.json();
  console.log(datax);
  //console.log("Password update response:", response.data);
  return datax;
};

export const apiUpdateProfile = async (data) => {
  try {
    const token = await getToken();
    const url = `${apiURLZurra}/user/profileupdate`;
    console.log("Token for profile update:", url);
    console.log("Data for profile update:", data);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ⚠️ jangan set Content-Type
      },
      body: data,
    });

    const json = await res.json();

    console.log("RESPONSE:", json);

    return json;
  } catch (error) {
    console.log("ERROR API:", error.message);
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    }
    throw error;
  }
};
