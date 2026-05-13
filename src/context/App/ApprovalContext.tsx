/** @format */

import { approveSales, listApproval } from "@/src/api/transaksi/SalesAPI";
import { useAuth } from "@/src/context/AuthContext";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
const ApprovalContext = createContext();

export const ApprovalContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [listApparoval, setListApproval] = useState([]);
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [isForm, setIsForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [itemSelected, setItemSelected] = useState(null);
  const [dealer, setDealer] = useState(null);
  const [note, setNote] = useState("");
  const [stsApprove, setStsApprove] = useState("");
  useEffect(() => {
    switch (user?.job_title?.toLowerCase()) {
      case "district sales manager":
        setStatus("confirmed");
        break;
      case "sales manager":
        setStatus("approved_dsm");
        break;
      case "president director":
        setStatus("approved_manager");
        break;
      default:
        setStatus("");
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!status || status === "") {
      return;
    }
    listApproval(user.id, status, page, 10).then((res) => {
      setListApproval(res.data);
      setTotal(res.total_all_data);
      setTotalPage(res.total_page);
    });
  }, [page, status]);
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const submitReject = () => {
    let stsReject = "";
    if (user?.job_title?.toLowerCase() === "district sales manager") {
      stsReject = "rejected_dsm";
    } else if (user?.job_title?.toLowerCase() === "sales manager") {
      stsReject = "rejected_manager";
    } else if (user?.job_title?.toLowerCase() === "president director") {
      stsReject = "rejected_direktur";
    }
    const payload = {
      note: note,
      status: stsReject,
      order_id: itemSelected.id,
    };
    approveSales(payload).then((res) => {
      if (res.success) {
        listApproval(user.id, status, page, 10).then((res) => {
          setListApproval(res.data);
          setTotal(res.total_all_data);
          setTotalPage(res.total_page);
        });
        Alert.alert("Success", "Item has been rejected successfully");
      } else {
        Alert.alert("Error", "Failed to reject the item");
      }
    });
  };
  const submitApprove = () => {
    let stsApprove = "";
    if (user?.job_title?.toLowerCase() === "district sales manager") {
      stsApprove = "approved_dsm";
    } else if (user?.job_title?.toLowerCase() === "sales manager") {
      stsApprove = "approved_manager";
    } else if (user?.job_title?.toLowerCase() === "president director") {
      stsApprove = "approved";
    }
    const payload = {
      note: note,
      status: stsApprove,
      order_id: itemSelected.id,
      dealer_id: dealer
        ? dealer.id
        : itemSelected?.x_studio_dealer
          ? itemSelected.x_studio_dealer[0]
          : null,
    };
    approveSales(payload).then((res) => {
      if (res.success) {
        listApproval(user.id, status, 1, 10).then((res) => {
          setListApproval(res.data);
          setTotal(res.total_all_data);
          setTotalPage(res.total_page);
        });
        Alert.alert("Success", "Item has been approved successfully");
      } else {
        Alert.alert("Error", "Failed to approve the item");
      }
    });
  };
  const handleApprove = () => {
    Alert.alert("Confirmation", "Are you sure you want to approve this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          // logika untuk menyetujui item yang dipilih
          submitApprove();
          // setelah menyetujui, Anda mungkin ingin menutup form atau memperbarui daftar approval
          setIsForm(false);
          setItemSelected(null);
        },
      },
    ]);
  };
  const handleNotApprove = () => {
    Alert.alert("Confirmation", "Are you sure you want to reject this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          // logika untuk menolak item yang dipilih
          submitReject();
          // setelah menolak, Anda mungkin ingin menutup form atau memperbarui daftar approval
          setIsForm(false);
          setItemSelected(null);
        },
      },
    ]);
  };

  return (
    <ApprovalContext.Provider
      value={{
        listApparoval,
        status,
        total,
        totalPage,
        page,
        setPage,
        isForm,
        setIsForm,
        searchText,
        setSearchText,
        handlePageChange,
        itemSelected,
        setItemSelected,
        handleApprove,
        handleNotApprove,
        dealer,
        setDealer,
        note,
        setNote,
      }}
    >
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApprovalContext = () => useContext(ApprovalContext);
