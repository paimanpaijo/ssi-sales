/** @format */

import axios from "axios";

import Constants from "expo-constants";

const { apiUrlOdoo } = Constants.expoConfig.extra;

export const getSales = async () => {
  const url = apiUrlOdoo + "/sales/all";
  const response = await axios.get(url);
  return response.data;
};

export const submitSales = async (data) => {
  const url = apiUrlOdoo + "/sales";
  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const getSalesList = async (
  month,
  year,
  status,
  sales_executive = 0,
  page = 1,
  limit = 10
) => {
  let sts = "";
  let se = "";
  if (status !== "all") {
    sts = `&status=${status}`;
  }
  if (sales_executive !== 0) {
    se = `&sales_exec=${sales_executive}`;
  }

  const url =
    apiUrlOdoo +
    `/sales/summary/?month=${month}&year=${year}&limit=${limit}&page=${page}` +
    sts +
    se;

  const response = await axios.get(url);
  return response.data;
};

export const SummarySalesAPI = async (user_id, month, year) => {
  let se = "";
  let mth = "";
  if (user_id !== 0) {
    se = `&sales_exec=${user_id}`;
  }
  if (month !== 0) {
    mth = `&month=${month}`;
  }
  const url = apiUrlOdoo + `/sales/summarysales?year=${year}` + se + mth;

  const response = await axios.get(url);
  return response.data;
};
