/** @format */

import { getCustomerList } from "@/src/api/master/CustomerAPI";
import { getProductDemo } from "@/src/api/master/ProductAPI";
import {
  getFieldService,
  getFieldServiceDetail,
  getFieldServiceProject,
  submitFieldService,
  updateFieldService,
} from "@/src/api/transaksi/FieldServiceAPI";
import { getHoursDecimal } from "@/src/library/Utility";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../AuthContext";

const FieldServiceContext = createContext();

export const FieldServiceContextProvider = ({ children }) => {
  const { user } = useAuth();

  const initialState = {
    id: 0,
    x_studio_sales_executive: user?.id ?? 0,
    x_studio_luas_lahan_ha: 0,
    x_studio_attendant: 0,
    x_studio_start_time: new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " "),
    x_studio_activity_date: new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " "),
    x_studio_lang: 0,
    x_studio_lat: 0,
    x_studio_district: "",
    x_studio_regency_1: "",
    x_studio_province: "",
    x_studio_address: "",
    partner_id: 0,
    name: "",
    stage_id: 11,
    planned_date_begin: new Date().toISOString().slice(0, 19).replace("T", " "),
    project_id: 0,
    description: "",
  };

  const [isForm, setIsForm] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectMonth, setSelectMonth] = useState(new Date().getMonth() + 1);
  const [selectYear, setSelectYear] = useState(new Date().getFullYear());
  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [coordinate, setCoordinate] = useState("");
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [salesorderList, setSalesorderList] = useState([]);

  const [eventType, setEventType] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [fieldServiceList, setFieldserviceList] = useState(null);
  const [fieldServiceData, setFieldServiceData] = useState(null);
  const [fieldService, setFieldService] = useState(initialState);
  const [count_notcheckout, setCountNotCheckout] = useState(0);
  const [productDemo, setProductDemo] = useState([]);

  const [detailDemo, setDetailDemo] = useState([]);
  const [detailDirect, setDetailDirect] = useState([]);

  const handleAddDemo = (demo) => {
    setDetailDemo((prev) => [
      ...prev,
      {
        x_studio_product: demo.id, // ini ID
        product_name: demo.product,
        x_studio_ubinan: Number(demo.ubinan) || 0,
        x_studio_rendemen: Number(demo.rendemen) || 0,
      },
    ]);
  };

  const handleAddDirectold = (demo) => {
    setDetailDirect((prev) => [...prev, demo]);
  };
  const handleAddDirect = (demo) => {
    setDetailDirect((prev) => [
      ...prev,
      {
        x_studio_product: demo.id, // ini ID dari productDemo (Many2one ke x_product_demo)
        product_name: demo.product,
        x_studio_quantity: Number(demo.quantity) || 0, // pastikan numeric
      },
    ]);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    getCustomerList(1, user.id, 1, 0).then((res) => {
      let cust = [];
      res.data.map((item) => {
        cust.push({
          id: item.id,
          label: item.complete_name,
          value: item.id,
          x_studio_type: item.x_studio_type,
        });
      });
      setCustomerList(cust);
    });
    let project = [];
    getFieldServiceProject().then((res) => {
      res.data.map((item) => {
        project.push({
          id: item.id,
          label: item.name,
          value: item.id,
        });
      });
      setProjectList(project);
    });
    getProductDemo().then((res) => {
      let temp = [];
      res.data.map((item) => {
        temp.push({
          id: item.id,
          label: item.x_name,
          value: item.id,
          competitor: item.x_studio_product_competitor,
        });
      });

      setProductDemo(temp);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    getFieldService(selectMonth, selectYear, user.id, 0, 0, page, 10).then(
      (res) => {
        setIsCheckIn(res.count_notcheckout > 0);
        setFieldserviceList(res.data);
        setTotalPage(res.count_page);
      }
    );
  }, [page, selectMonth, selectYear]);

  const handleSave = () => {
    if (
      !fieldService.partner_id ||
      !fieldService.project_id ||
      !fieldService.planned_date_begin
    ) {
      Alert.alert(
        "Error",
        "Please fill all required field (customer, project, date)",
        [{ text: "OK" }]
      );
      return;
    }
    if (fieldService.partner_id === 0 || fieldService.project_id === 0) {
      Alert.alert(
        "Error",
        "Please fill all required field (customer, project, date)",
        [{ text: "OK" }]
      );
      return;
    }

    setFieldService((prev) => ({
      ...prev,
    }));

    Alert.alert("Confirm", "Are you sure to submit ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          submitFieldService(fieldService).then((res) => {
            if (res.success) {
              Alert.alert("Success", "Data has been saved", [{ text: "OK" }]);
              getFieldService(
                selectMonth,
                selectYear,
                user.id,
                0,
                0,
                page,
                10
              ).then((res) => {
                setIsCheckIn(res.count_notcheckout > 0);
                setFieldserviceList(res.data);
                setFieldService(initialState);
              });
            } else {
              Alert.alert("Error", res.message, [{ text: "OK" }]);
            }
            setIsForm(false);
          });
        },
      },
    ]);
  };
  const handleCheckOut = () => {
    const dtl = {
      description: fieldServiceData.name,
      hours: getHoursDecimal(
        fieldServiceData.x_studio_activity_date,
        new Date().toISOString().slice(0, 19).replace("T", " ")
      ),
      employee_id: user.id,
    };
    const timesheet = [];

    timesheet.push(dtl);
    const data = {
      id: fieldServiceData.id,
      x_studio_end_time: new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      x_studio_luas_lahan_ha: fieldServiceData.x_studio_luas_lahan_ha,
      x_studio_attendant: fieldServiceData.x_studio_attendant,
      description: fieldServiceData.description,
      x_studio_image: fieldServiceData.x_studio_image,
      direct_selling_items: detailDirect,
      demo: detailDemo,
      stage_id: 12,
      timesheet_entries: timesheet,
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
          updateFieldService(data).then((res) => {
            if (res.success) {
              Alert.alert("Success", res.message, [{ text: "OK" }]);
              getFieldService(
                selectMonth,
                selectYear,
                user.id,
                0,
                0,
                page,
                10
              ).then((res) => {
                setIsCheckIn(res.count_notcheckout > 0);
                setFieldserviceList(res.data);
              });
              setIsFormEdit(false);
              setFieldServiceData(null);

              setIsForm(false);
            } else {
              Alert.alert("Error", res.message, [{ text: "OK" }]);
            }
          });
        },
      },
    ]);
  };
  const handleCheckOutShow = (item) => {
    setFieldServiceData(item);
    setIsFormEdit(true);
  };

  const ShowFieldService = (item) => {
    getFieldServiceDetail(item.id).then((res) => {
      setFieldServiceData(res.data);
    });
  };
  const handleOnChange = (nm, vl) => {
    setFieldService((prev) => ({
      ...prev,
      [nm]: vl,
    }));
  };
  const handleOnChangeData = (nm, vl) => {
    setFieldServiceData((prev) => ({
      ...prev,
      [nm]: vl,
    }));
  };
  const handleRemoveDemo = (index) => {
    setDetailDemo((prev) => prev.filter((_, i) => i !== index));
  };
  const handleRemoveDirectSelling = (index) => {
    setDetailDirect((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <FieldServiceContext.Provider
      value={{
        isForm,
        setIsForm,
        page,
        setPage,
        totalPage,
        setTotalPage,
        total,
        setTotal,
        selectedDate,
        setSelectedDate,
        selectMonth,
        setSelectMonth,
        selectYear,
        setSelectYear,
        customerList,
        setCustomerList,
        productList,
        setProductList,
        handleSave,
        coordinate,
        setCoordinate,
        eventType,
        setEventType,
        projectList,
        setProjectList,
        fieldServiceList,
        isFormEdit,
        setIsFormEdit,
        handleCheckOutShow,
        ShowFieldService,
        fieldServiceData,
        handleOnChangeData,
        handleCheckOut,
        fieldService,
        handleOnChange,
        count_notcheckout,
        isCheckIn,
        productDemo,
        detailDirect,
        detailDemo,
        handleAddDemo,
        handleAddDirect,
        handleRemoveDemo,
        handleRemoveDirectSelling,
      }}
    >
      {children}
    </FieldServiceContext.Provider>
  );
};

export const useFieldServiceContext = () => useContext(FieldServiceContext);
