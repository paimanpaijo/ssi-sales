/** @format */

import { getCustomerList } from "@/src/api/master/CustomerAPI";
import { getPaymentTerm } from "@/src/api/master/PaymentTermAPI";
import {
  getPriceList,
  getPriceListDetail,
} from "@/src/api/master/PriceListAPI";
import { getProduct } from "@/src/api/master/ProductAPI";
import { getSalesList, submitSales } from "@/src/api/transaksi/SalesAPI";
import {
  formatPhoneNumber,
  getRandomLetter,
  getRandomNumber,
  validateEmail,
} from "@/src/library/Utility";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../AuthContext";

const SalesOrderContext = createContext();

export const SalesOrderContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [isForm, setIsForm] = useState(false);
  const [isFormDetail, setIsFormDetail] = useState(false);
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
  const [selectItem, setSelectItem] = useState(null);
  const [salesDetail, setSalesDetail] = useState([]);
  const [orderCategory, setOrderCategory] = useState("Commercial");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

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
  }, []);
  useEffect(() => {
    if (!user) {
      return;
    }
    if (orderCategory === "Commercial") {
      getCustomerList(1, user.id, 1, 0, "", "all", "Demo").then((res) => {
        let cust = [];
        res.data.map((item) => {
          if (item.x_studio_type !== null) {
            cust.push({
              id: item.id,
              label: item.complete_name,
              value: item.id,
              x_studio_type: item.x_studio_type,
              email: item.email,
              phone: item.phone,
            });
          }
        });
        setCustomerList(cust);
      });
    } else {
      getCustomerList(1, user.id, 1, 0, "", "Demo", "").then((res) => {
        let cust = [];
        res.data.map((item) => {
          if (item.x_studio_type !== null) {
            cust.push({
              id: item.id,
              label: item.complete_name,
              value: item.id,
              x_studio_type: item.x_studio_type,
              email: item.email,
              phone: item.phone,
            });
          }
        });
        setCustomerList(cust);
      });
    }
    getProduct(orderCategory).then((res) => {
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
  }, [orderCategory]);
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
      setIsLoading(true);
      getPriceList(tipe).then((res) => {
        setIsLoading(false);
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
    setIsLoading(true);
    getSalesList(selectMonth, selectYear, "all", user.id, page, 10).then(
      (res) => {
        setIsLoading(false);
        setSalesorderList(res.data);
        setTotalPage(res.totalPage);
        setTotal(res.total);
      },
    );
  }, [selectMonth, selectYear, page]);

  const handleAddOrder = (newOrder, quantity) => {
    let unitprice = newOrder.listPrice;

    getPriceListDetail(priceList[0].id, newOrder.id).then((res) => {
      if (res.length > 0) {
        unitprice = res[0].fixed_price;
      } else {
        alert(
          "Price not found, please contact your admin to check the pricelist or product price or expire date of pricelist item.",
        );
        return;
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
      if (user.parent_chain.length === 0) {
        Alert.alert(
          "Warning",
          "You don't have parent chain, please contact your admin",
        );
        return;
      }
      let parentChain1Jobtitle = "";
      let parentChain2Jobtitle = "";
      let parentChain3Jobtitle = "";
      let parentChain1Id = null;
      let parentChain2Id = null;
      let parentChain3Id = null;
      let parentChain1Email = null;
      let parentChain2Email = null;
      let parentChain3Email = null;
      let parentChain1Phone = null;
      let parentChain2Phone = null;
      let parentChain3Phone = null;
      let status1 = null;
      let valid1date = null;
      let valid2date = null;
      let status2 = null;

      if (user.parent_chain.length >= 3) {
        parentChain1Jobtitle = user.parent_chain[0].job_title.toLowerCase();
        parentChain2Jobtitle = user.parent_chain[1]
          ? user.parent_chain[1].job_title.toLowerCase()
          : "";
        parentChain3Jobtitle = user.parent_chain[2]
          ? user.parent_chain[2].job_title.toLowerCase()
          : "";

        parentChain1Id = user.parent_chain[0].id;
        parentChain2Id = user.parent_chain[1] ? user.parent_chain[1].id : null;
        parentChain3Id = user.parent_chain[2] ? user.parent_chain[2].id : null;

        parentChain1Email = user.parent_chain[0].parent_email;
        parentChain2Email = user.parent_chain[1]
          ? user.parent_chain[1].parent_email
          : null;
        parentChain3Email = user.parent_chain[2]
          ? user.parent_chain[2].parent_email
          : null;
        parentChain1Phone = formatPhoneNumber(
          user.parent_chain[0].parent_work_mobile,
        );
        parentChain2Phone = user.parent_chain[1]
          ? formatPhoneNumber(user.parent_chain[1].parent_work_mobile)
          : null;
        parentChain3Phone = user.parent_chain[2]
          ? formatPhoneNumber(user.parent_chain[2].parent_work_mobile)
          : null;
      } else if (user.parent_chain.length === 2) {
        if (
          user.parent_chain[0].job_title.toLowerCase() ===
          "district sales manager"
        ) {
          parentChain1Jobtitle = user.parent_chain[0].job_title.toLowerCase();
          parentChain1Id = user.parent_chain[0].id;
          parentChain1Email = user.parent_chain[0].parent_email;
          parentChain1Phone =
            user.parent_chain[0].parent_work_mobile &&
            formatPhoneNumber(user.parent_chain[0].parent_work_mobile);
        } else if (
          user.parent_chain[0].job_title.toLowerCase() === "sales manager"
        ) {
          if (user.job_title.toLowerCase() === "district sales manager") {
            parentChain1Jobtitle = user.parent_chain[0].job_title.toLowerCase();
            parentChain1Id = user.id;
            parentChain1Email = user.email;
            parentChain1Phone = formatPhoneNumber(user.mobile_phone);
            status1 = "validated";
            valid1date = new Date();
          } else {
            parentChain1Jobtitle = user.parent_chain[0].job_title.toLowerCase();
            parentChain1Id = user.parent_chain[0].id;
            parentChain1Email = user.parent_chain[0].parent_email;
            parentChain1Phone =
              user.parent_chain[0].parent_work_mobile &&
              formatPhoneNumber(user.parent_chain[0].parent_work_mobile);
            status1 = "validated";
            valid1date = new Date();
          }
          parentChain2Jobtitle = user.parent_chain[0].job_title.toLowerCase();
          parentChain2Id = user.parent_chain[0].id;
          parentChain2Email = user.parent_chain[0].parent_email;
          parentChain2Phone =
            user.parent_chain[0].parent_work_mobile &&
            formatPhoneNumber(user.parent_chain[0].parent_work_mobile);
          if (
            user.parent_chain[1].job_title.toLowerCase() ===
            "president director"
          ) {
            parentChain3Id = user.parent_chain[1].id;
            parentChain3Email = user.parent_chain[1].parent_email;
            parentChain3Phone =
              user.parent_chain[1].parent_work_mobile &&
              formatPhoneNumber(user.parent_chain[1].parent_work_mobile);
            parentChain3Jobtitle = user.parent_chain[1].job_title.toLowerCase();
          } else {
            Alert.alert(
              "Warning",
              "Your parent chain 2 must be president director, please contact your admin",
            );
            return;
          }
        } else {
          Alert.alert(
            "Warning",
            "You don't have parent chain, please contact your admin",
          );
          return;
        }
      } else if (user.parent_chain.length === 1) {
        if (
          user.parent_chain[0].job_title.toLowerCase() ===
            "president director" &&
          user.job_title.toLowerCase() === "sales manager"
        ) {
          parentChain1Jobtitle = user.job_title;
          parentChain1Id = user.id;
          parentChain1Email = user.email;
          parentChain1Phone = formatPhoneNumber(user.mobile_phone);
          status1 = "validated";
          valid1date = new Date();
          parentChain2Jobtitle = user.job_title;
          parentChain2Id = user.id;
          parentChain2Email = user.email;
          parentChain2Phone = formatPhoneNumber(user.mobile_phone);
          status2 = "validated";
          valid2date = new Date();
          parentChain3Jobtitle = user.job_title;
          parentChain3Id = user.id;
          parentChain3Email = user.email;
          parentChain3Phone = formatPhoneNumber(user.mobile_phone);

          valid1date = new Date();
          parentChain3Id = user.parent_chain[0].id;
          parentChain3Email = user.parent_chain[0].parent_email;
          parentChain3Phone =
            user.parent_chain[0].parent_work_mobile &&
            formatPhoneNumber(user.parent_chain[0].parent_work_mobile);
          status2 = "Approved";
          valid2date = new Date();
          parentChain3Jobtitle = user.parent_chain[0].job_title.toLowerCase();
        }
      }
      if (customer !== null && paymentTerm !== null && price.id !== 0) {
        if (customer.email === null || customer.email === "") {
          Alert.alert(
            "Warning",
            "Customer email is empty, please add customer email first",
          );
          return;
        }
        if (customer.phone === null || customer.phone === "") {
          Alert.alert(
            "Warning",
            "Customer phone is empty, please add customer phone first",
          );
          return;
        }
        if (validateEmail(customer.email) === false) {
          Alert.alert(
            "Warning",
            "Customer email is not valid, please check it",
          );
          return;
        }
        let customerPhone = formatPhoneNumber(customer.phone);
        const data = {
          partner_id: customer.id,
          customer_name: customer.label,
          customer_email: customer.email,
          customer_phone: customerPhone,
          orderCategory: orderCategory,
          payment_term_id: paymentTerm.id,
          pricelist_id: price.id,
          x_studio_sales_executive: user.id,
          x_studio_retailer_discount: discRet,
          x_studio_farmer_discount: discFarm,
          validate_status: status1,
          validator_id: parentChain1Id,
          validator_email: parentChain1Email,
          validator_phone: parentChain1Phone,
          approver_id: parentChain3Id,
          approver_email: parentChain3Email,
          approver_phone: parentChain3Phone,
          approver_nsm_id: parentChain2Id,
          approver_nsm_email: parentChain2Email,
          approver_nsm_phone: parentChain2Phone,
          validate_status2: status2,
          valid1date: valid1date,
          keyword: getRandomLetter(64),
          otp: getRandomNumber(6),
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
              setIsLoading(true);
              submitSales(data).then((res) => {
                setIsLoading(false);
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
                    10,
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
        selectItem,
        setSelectItem,
        isFormDetail,
        setIsFormDetail,
        salesDetail,
        setSalesDetail,
        orderCategory,
        setOrderCategory,
        isLoading,
      }}
    >
      {children}
    </SalesOrderContext.Provider>
  );
};

export const useSalesOrderContext = () => useContext(SalesOrderContext);
