/** @format */

import axios from "axios";
import Constants from "expo-constants";

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
    }
  );

  return response.data; // misal { token, user }
}

export async function logout() {
  return api.post("/logout");
}
