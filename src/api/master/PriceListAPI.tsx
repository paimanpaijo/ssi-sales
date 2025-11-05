/** @format */

import axios from "axios";
import Constants from "expo-constants";

const { apiUrlOdoo } = Constants.expoConfig.extra;

export async function getPriceList(type) {
  if (type != null && type != "") {
    const urlq = apiUrlOdoo + "/pricelist?type=" + type;

    const response = await axios.get(urlq);

    return response.data;
  } else {
    const url2 = apiUrlOdoo + "/pricelist";

    const response = await axios.get(url2);

    return response.data;
  }
}

export async function getPriceListDetail(id, prod_id) {
  const url2 =
    apiUrlOdoo + "/pricelist/pricelistitem?id=" + id + "&prod_id=" + prod_id;

  const response = await axios.get(url2);

  return response.data;
}
