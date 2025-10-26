/** @format */

import axios from "axios";
import Constants from "expo-constants";
const { apiUrlOdoo } = Constants.expoConfig.extra;

export const getEmployeeList = async () => {
  const url = apiUrlOdoo + "/employee/all";
  const response = await axios.get(url);
  return response.data;
};

export const getEmployeeByEmail = async (email: string) => {
  const url = apiUrlOdoo + `/employee/${encodeURIComponent(email)}`;
  const response = await axios.get(url);
  return response.data;
};
