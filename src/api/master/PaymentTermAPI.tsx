/** @format */

import axios from "axios";

import Constants from "expo-constants";

const { apiUrlOdoo } = Constants.expoConfig.extra;

export const getPaymentTerm = async () => {
  const url = apiUrlOdoo + "/paymentterms/all";

  const response = await axios.get(url);

  return response.data;
};
