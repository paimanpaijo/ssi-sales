/** @format */

import axios from "axios";

import Constants from "expo-constants";

const { apiUrlOdoo } = Constants.expoConfig.extra;

export const getFieldService = async (
  month,
  year,
  se_id,
  status_id,
  cust_id,
  page,
  limit
) => {
  let sts = "";
  let se = "";
  let cust = "";

  if (month !== 0) {
    month = `&month=${month}`;
  }
  if (year !== 0) {
    year = `&year=${year}`;
  }

  if (se_id !== 0) {
    se = `&se_id=${se_id}`;
  }
  if (status_id !== 0) {
    sts = `&status_id=${status_id}`;
  }
  if (cust_id !== 0) {
    cust = `&cust_id=${cust_id}`;
  }
  const url =
    apiUrlOdoo +
    "/fieldservice?page=" +
    page +
    "&limit=" +
    limit +
    se +
    sts +
    month +
    year +
    cust;

  const response = await axios.get(url);
  return response.data;
};
export const submitFieldService = async (data) => {
  const url = apiUrlOdoo + "/fieldservice";
  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const getFieldServiceProject = async () => {
  const url = apiUrlOdoo + "/fieldservice/projects/list";
  const response = await axios.get(url);
  return response.data;
};

export const updateFieldService = async (data) => {
  const url = apiUrlOdoo + "/fieldservice/update";
  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const getFieldServiceDetail = async (id) => {
  const url = apiUrlOdoo + "/fieldservice/" + id;
  const response = await axios.get(url);
  return response.data;
};
