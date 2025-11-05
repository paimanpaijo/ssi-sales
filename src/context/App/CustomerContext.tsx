/** @format */

import { getCustomerList, saveCustomer } from "@/src/api/master/CustomerAPI";
import { validateEmail } from "@/src/library/Utility";
import Constants from "expo-constants";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../AuthContext";

const { apiUrlOdoo } = Constants.expoConfig.extra;
const CustomerContext = createContext();

export const CustomerContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [isForm, setIsForm] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const initialState = {
    id: 0,
    name: "",
    complete_name: "",
    street: "",
    email: "",
    phone: "",
    mobile: "",
    city: "",
    website: "",
    credit: 0,
    debit: 0,
    total_invoiced: "",
    customer_rank: "",
    x_studio_sales_executive: user?.id ?? 0,
    x_studio_type: "Dealer",
    contact_address: "",
    contact_address_complete: "",
    x_studio_agreement_signed: "",
    parent_name: "",
    vat_label: "npwp",
    partner_vat_placeholder: "",
    partner_latitude: 0,
    partner_longitude: 0,
    company_type: "",
    is_company: true,
    parent_id: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    state: "",
    file_document: null,
    vat: "",
  };
  const [isSaving, setIsSaving] = useState(false);
  const [customer, setCustomer] = useState(initialState);
  const [files, setFiles] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");

  const handleOnChange = (name, value) => {
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    getCustomerList(1, user.id, page, 10, searchText).then((res) => {
      setCustomerList(res.data);
      setTotal(res.count_data);
      setTotalPage(res.count_page);
    });
  }, [page, searchText]);

  const API_UPLOAD_URL = apiUrlOdoo + "/upload/api/upload/odoo"; // ganti sesuai env
  const UPLOAD_TIMEOUT = 60_000; // ms
  function inferMimeFromExt(ext: string) {
    const m = (ext || "").toLowerCase();
    if (["jpg", "jpeg"].includes(m)) return "image/jpeg";
    if (m === "png") return "image/png";
    if (m === "gif") return "image/gif";
    if (m === "pdf") return "application/pdf";
    if (m === "docx")
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    return "application/octet-stream";
  }

  async function uploadFileToServer(
    fileMeta: { uri: string; name: string; mime?: string; ext?: string },
    payloadFields: Record<string, any> = {}
  ) {
    try {
      const form = new FormData();

      // Append file. key must match FileInterceptor('file') on server
      form.append("file", {
        uri: fileMeta.uri,
        name: fileMeta.name,
        type:
          fileMeta.mime ||
          inferMimeFromExt(fileMeta.ext || "") ||
          "application/octet-stream",
      } as any);

      // Append fields: ALWAYS stringify non-primitive values and cast to string
      Object.entries(payloadFields).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === "object") form.append(k, JSON.stringify(v));
        else form.append(k, String(v));
      });

      // fetch with timeout using AbortController
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);

      const resp = await fetch(API_UPLOAD_URL, {
        method: "POST",
        body: form,
        // IMPORTANT: do NOT set Content-Type header here — let fetch set boundary
        // headers: { 'Authorization': `Bearer ${TOKEN}` } // if you need auth
        signal: controller.signal as any,
      });

      clearTimeout(timeout);

      // handle non-OK
      if (!resp.ok) {
        const text = await resp.text().catch(() => null);
        throw new Error(`Upload failed ${resp.status}: ${text ?? ""}`);
      }

      const json = await resp.json().catch(() => null);
      return json;
    } catch (err) {
      console.error("uploadFileToServer error:", err);
      throw err;
    }
  }

  const handleSave = async () => {
    // basic validation
    if (!customer.name || !customer.phone) {
      Alert.alert("Error", "Please fill all required field (name, phone)");
      return;
    }
    if (!(customer.vat.length === 0 || customer.vat.length === 16)) {
      Alert.alert("Error", "NPWP must be more than 16 characters");
      return;
    }
    if (customer.email && !validateEmail(customer.email)) {
      Alert.alert("Error", "Email is not valid");
      return;
    }
    if (customer.contact_email && !validateEmail(customer.contact_email)) {
      Alert.alert("Error", "Contact email is not valid");
      return;
    }

    // prepare payload fields (no file yet)
    const payloadFields: any = {
      company_name: customer.name.toUpperCase(),
      company_email: customer.email.toLowerCase(),
      company_phone: customer.phone,
      company_website: customer.website,
      street: customer.street,
      city: customer.city,
      state: customer.state,
      npwp: customer.vat,
      type: customer.x_studio_type,
      agreement_signed: customer.x_studio_agreement_signed,
      sales_executive: user.id,
      longitude: customer.partner_longitude,
      latitude: customer.partner_latitude,
      contact_name: customer.contact_name,
      contact_phone: customer.contact_phone,
      contact_email: customer.contact_email,
      id: customer.id,
    };

    setIsSaving(true);

    try {
      if (customer.file_document && customer.file_document.uri) {
        // If there's a file: upload file + fields to NestJS endpoint which will create/update Odoo
        try {
          const uploadResp = await uploadFileToServer(
            customer.file_document,
            payloadFields
          );

          if (!uploadResp || !uploadResp.success) {
            throw new Error(uploadResp?.message || "Upload failed");
          }

          // Upload succeeded; server already created/updated partner in Odoo.
          Alert.alert(
            "Success",
            uploadResp.message ?? "File and data uploaded"
          );
          // refresh list if server returned partner id or you want to reload
          const listRes = await getCustomerList(1, user.id, 1, 10, searchText);
          setCustomerList(listRes.data);
          setTotal(listRes.count_data);
          setTotalPage(listRes.count_page);

          // reset form
          setIsForm(false);
          setCustomer(initialState);
        } catch (uErr) {
          console.error("Upload failed:", uErr);
          Alert.alert(
            "Upload gagal",
            (uErr as any)?.message || "Gagal mengunggah file."
          );
        } finally {
          setIsSaving(false);
        }
      } else {
        // No file: call saveCustomer (existing flow)
        const res = await saveCustomer(payloadFields);

        setIsSaving(false);
        if (res && res.success) {
          Alert.alert("Success", "Data has been saved", [{ text: "OK" }]);
          const listRes = await getCustomerList(1, user.id, 1, 10, searchText);
          setCustomerList(listRes.data);
          setTotal(listRes.count_data);
          setTotalPage(listRes.count_page);
          setIsForm(false);
          setCustomer(initialState);
        } else {
          Alert.alert("Error", res?.message || "Failed to save customer");
        }
      }
    } catch (err) {
      console.error("handleSave error:", err);
      setIsSaving(false);
      Alert.alert(
        "Error",
        (err as any)?.message || "Terjadi kesalahan saat menyimpan"
      );
    }
  };

  const handleClose = () => {
    setIsForm(false);
    setCustomer(initialState);
  };
  return (
    <CustomerContext.Provider
      value={{
        isForm,
        setIsForm,
        customerList,
        page,
        setPage,
        totalPage,
        total,
        customer,
        setCustomer,
        handleSave,
        handleClose,
        handleOnChange,
        isSaving,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => useContext(CustomerContext);
