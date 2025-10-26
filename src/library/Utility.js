/** @format */

import { format } from "date-fns";
import { id } from "date-fns/locale";

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const validateNumber = (number) => {
  return number.match(/^[0-9]+$/);
};

export const validatePassword = (password) => {
  return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
};

export const validIndonesianMobileNumber = (number) => {
  // Regex untuk nomor telepon mobile Indonesia
  if (number != "") {
    const regex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;

    // Test nomor telepon terhadap regex
    return number.match(regex);
  } else {
    return true;
  }
};

export const formatRupiah = (angka, prefix) => {
  let number_string = angka.replace(/[^,\d]/g, "").toString(),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik setiap 3 angka
  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return prefix == undefined ? rupiah : prefix + rupiah;
};

export const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatDateIDN = (date) => {
  return format(new Date(date), "dd MMMM yyyy", { locale: id });
};
export const formatDateTimeISO = (date) => {
  return date.format("YYYY-MM-DD");
};

export const formatNumber = (number) => {
  number = parseFloat(number);
  return new Intl.NumberFormat("id-ID", {
    maximumSignificantDigits: 5,
  }).format(number);
};

export const generateRandomColors = (count) => {
  return Array.from(
    { length: count },
    () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
  );
};

export function getMonthName(monthNumber) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[monthNumber - 1] || "Nomor bulan tidak valid";
}

export const getDateDifferenceInDays = (date1, date2) => {
  const oneDay = 1000 * 60 * 60 * 24;

  // Pastikan kedua date sudah berupa objek Date
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Hitung selisih waktu (dalam milidetik)
  const diffInTime = d2.getTime() - d1.getTime();

  // Hitung selisih hari
  return Math.round(diffInTime / oneDay);
};

export function getRandomLetter(length = 3) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export const getMapDirection = async (latitude, longitude) => {
  let url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
  if (Platform.OS === "ios") {
    url = `https://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
  }
  console.log(url);
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
      Linking.openURL(webUrl);
    }
  } catch (error) {
    console.log(error);
  }
};

export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);

    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateString;
  }
};
