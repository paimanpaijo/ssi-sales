/** @format */

import axios from "axios";
import Constants from "expo-constants";

const { apiUrlOdoo } = Constants.expoConfig.extra;

export async function getCustomerList(
  cust_only = 1,
  employeeId = 0,
  page = 1,
  limit = 0
) {
  const url =
    apiUrlOdoo +
    "/partners?cust_only=" +
    cust_only +
    "&employeeId=" +
    employeeId +
    "&page=" +
    page +
    "&limit=" +
    limit;
  console.log(url);
  const response = await axios.get(url);

  return response.data;
}
