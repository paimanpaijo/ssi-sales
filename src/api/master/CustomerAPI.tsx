/** @format */

import axios from "axios";
import Constants from "expo-constants";

const { apiUrlOdoo } = Constants.expoConfig.extra;

export async function getCustomerList(
  cust_only = 1,
  employeeId = 0,

  page = 1,
  limit = 0,
  search = "",
  type = "all"
) {
  let typestring = "";
  if (search !== "") {
    search = `&search=${search}`;
  }
  if (type !== "all") {
    typestring = `&type=${type}`;
  }
  const url =
    apiUrlOdoo +
    "/partners?cust_only=" +
    cust_only +
    "&employeeId=" +
    employeeId +
    "&page=" +
    page +
    "&limit=" +
    limit +
    search +
    typestring;
  console.log(url);
  const response = await axios.get(url);

  return response.data;
}

export async function saveCustomer(data) {
  try {
    const url = apiUrlOdoo + "/partners/create";

    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
}
