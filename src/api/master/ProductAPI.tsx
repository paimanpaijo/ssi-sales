/** @format */

import axios from "axios";

import Constants from "expo-constants";

const { apiUrlOdoo } = Constants.expoConfig.extra;

export const getProduct = async () => {
  const url = apiUrlOdoo + "/products/all";

  const response = await axios.get(url);
  return response.data;
};
export const getProductDemo = async (iscompetitor) => {
  let iscompetitorstr = "";
  if (iscompetitor != null && iscompetitor !== "all") {
    iscompetitorstr = "?is_competitor=" + iscompetitor;
  }
  const url = apiUrlOdoo + "/fieldservice/product/list" + iscompetitorstr;

  const response = await axios.get(url);
  return response.data;
};
