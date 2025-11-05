/** @format */

import { getCustomerList } from "@/src/api/master/CustomerAPI";
import { getPaymentTerm } from "@/src/api/master/PaymentTermAPI";
import {
  getPriceList,
  getPriceListDetail,
} from "@/src/api/master/PriceListAPI";
import { getProduct } from "@/src/api/master/ProductAPI";
import { getSalesList, submitSales } from "@/src/api/transaksi/SalesAPI";
import { getRandomLetter } from "@/src/library/Utility";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../AuthContext";

const SalesOrderContext = createContext();

export const SalesOrderContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [isForm, setIsForm] = useState(false);

  const [customerList, setCustomerList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [paymentTermList, setPaymentTermList] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [paymentTerm, setPaymentTerm] = useState(null);
  const [productSelect, setProductSelect] = useState(null);
  const [discRet, setDiscRet] = useState(0);
  const [discFarm, setDiscFarm] = useState(0);
  const [disc, setDisc] = useState(0);
  const [totalDisc, setTotalDisc] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [netPrice, setNetPrice] = useState(0);
  const [price, setPrice] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectMonth, setSelectMonth] = useState(new Date().getMonth() + 1);
  const [selectYear, setSelectYear] = useState(new Date().getFullYear());
  const [orderList, setOrderList] = useState([]);
  const [salesorderList, setSalesorderList] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    getCustomerList(1, user.id, 1, 0).then((res) => {
      let cust = [];
      res.data.map((item) => {
        if (item.x_studio_type !== null) {
          cust.push({
            id: item.id,
            label: item.complete_name,
            value: item.id,
            x_studio_type: item.x_studio_type,
          });
        }
      });
      setCustomerList(cust);
    });
    getPaymentTerm().then((res) => {
      let pterm = [];

      res.map((item) => {
        pterm.push({
          id: item.id,
          label: item.name,
          value: item.id,
          discount_percentage: item.discount_percentage,
        });
      });
      setPaymentTermList(pterm);
    });
    getProduct().then((res) => {
      let temp = [];
      res.map((item) => {
        temp.push({
          id: item.id,
          label: item.name,
          value: item.id,
          list_Price: item.list_price,
        });
      });
      setProductList(temp);
    });
  }, []);
  useEffect(() => {
    if (!user) {
      return;
    }
    if (customer !== null) {
      let tipe = "";
      if (!customer.x_studio_type) {
        tipe = "";
      } else {
        tipe = customer.x_studio_type;
      }
      getPriceList(tipe).then((res) => {
        let temp = [];
        res.data.map((item) => {
          temp.push({
            id: item.id,
            label: item.name,
            value: item.id,
            x_studio_type: item.x_studio_type,
            x_studio_disc_retailer: item.x_studio_disc_retailer,
            x_studio_disc_farmer: item.x_studio_disc_farmer,
          });
        });
        setPriceList(temp);
      });
    }
  }, [customer]);
  useEffect(() => {
    if (!user) {
      return;
    }
    getSalesList(selectMonth, selectYear, "all", user.id, page, 10).then(
      (res) => {
        setSalesorderList(res.data);
        setTotalPage(res.totalPage);
        setTotal(res.total);
      }
    );
  }, [selectMonth, selectYear, page]);

  const handleAddOrder = (newOrder, quantity) => {
    let unitprice = newOrder.listPrice;

    getPriceListDetail(priceList[0].id, newOrder.id).then((res) => {
      if (res.length > 0) {
        unitprice = res[0].fixed_price;
      }

      let ttldiscount = parseFloat(discFarm) + parseFloat(discRet);
      let discount = ttldiscount / 100;

      if (paymentTerm) {
        if (paymentTerm.discount_percentage != false) {
          ttldiscount = ttldiscount + paymentTerm.discount_percentage;
          discount = ttldiscount / 100;
        }
      }

      let total = unitprice * quantity - unitprice * quantity * discount;
      let key = getRandomLetter(5);
      const orderTmp = {
        id: 0,
        key: key,
        product_id: newOrder.id,
        product_name: newOrder.label,
        quantity: quantity,
        price_unit: unitprice,
        totalPrice: quantity * unitprice,
        discount: ttldiscount,
        discount_value: discount,
        ttldiscount: ttldiscount,
        total: total,
      };
      setOrderList([...orderList, orderTmp]);
    });
  };
  useEffect(() => {
    let total = 0;
    let totalDisctmp = 0;
    let netprice = 0;
    orderList.map((item) => {
      total += item.totalPrice;
      netprice += item.total;
      totalDisctmp += item.ttldiscount;
    });
    setTotalPrice(total);
    setTotalDisc(totalDisctmp);
    setNetPrice(netprice);
  }, [orderList]);

  const handleDelete = (itm) => {
    setOrderList(orderList.filter((item) => item.key !== itm.key));
  };
  const handleSubmit = () => {
    if (orderList.length > 0) {
      if (customer !== null && paymentTerm !== null && price.id !== 0) {
        const data = {
          partner_id: customer.id,
          payment_term_id: paymentTerm.id,
          pricelist_id: price.id,
          x_studio_sales_executive: user.id,
          x_studio_retailer_discount: discRet,
          x_studio_farmer_discount: discFarm,
          items: orderList,
        };

        Alert.alert("Confirm", "Are you sure to submit ?", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              submitSales(data).then((res) => {
                if (res.success) {
                  Alert.alert("Success", "Data has been saved", [
                    { text: "OK" },
                  ]);
                  setIsForm(false);
                  setOrderList([]);
                  getSalesList(
                    selectMonth,
                    selectYear,
                    "all",
                    user.id,
                    page,
                    10
                  ).then((res) => {
                    setSalesorderList(res.data);
                    setTotalPage(res.totalPage);
                    setTotal(res.total);
                  });
                } else {
                  Alert.alert("Error", res.message, [{ text: "OK" }]);
                }
              });
            },
          },
        ]);
      } else {
        Alert.alert("Warning", "Please fill all field", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } else {
      Alert.alert("Warning", "Please add at least one product", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };
  return (
    <SalesOrderContext.Provider
      value={{
        isForm,
        setIsForm,
        customerList,
        priceList,
        productList,
        paymentTermList,
        customer,
        setCustomer,
        paymentTerm,
        setPaymentTerm,
        orderList,
        setOrderList,
        handleAddOrder,
        productSelect,
        setProductSelect,
        discRet,
        setDiscRet,
        discFarm,
        setDiscFarm,
        disc,
        setDisc,
        totalDisc,
        totalPrice,
        netPrice,
        handleDelete,

        handleSubmit,
        price,
        setPrice,

        selectedDate,
        setSelectedDate,
        selectMonth,
        setSelectMonth,
        selectYear,
        setSelectYear,
        salesorderList,
        page,
        setPage,
        totalPage,
        setTotalPage,
        total,
      }}
    >
      {children}
    </SalesOrderContext.Provider>
  );
};

export const useSalesOrderContext = () => useContext(SalesOrderContext);
