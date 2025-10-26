/** @format */
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token) => {
  await AsyncStorage.setItem("token", token);
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return token;
};

export const removeToken = async () => {
  await AsyncStorage.removeItem("token");
};

const getFileExtensionFromBase64 = (base64String) => {
  // Cek data URI terlebih dahulu
  if (base64String.startsWith("data:")) {
    const mimeType = base64String.split(";")[0].split(":")[1];
    const mimeToExtension = {
      "image/webp": "webp",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "application/pdf": "pdf",
      // tambahkan lainnya
    };
    return mimeToExtension[mimeType] || "bin";
  }

  // Ambil 20 karakter pertama untuk deteksi signature
  const signature = base64String.substring(0, 20);

  // Deteksi WebP (baik dengan 'UklGR' atau 'RIFF' + 'WEBP')
  if (
    signature.includes("UklGR") ||
    (signature.includes("RIFF") && signature.includes("WEBP"))
  ) {
    return "webp";
  }
  // Deteksi format lainnya...

  return "bin"; // default
};
export const saveUserData = async (user, groups) => {
  const base64String = user.avatar.replace(/^data:image\/\w+;base64,/, "");
  const extension = getFileExtensionFromBase64(base64String);
  const path =
    FileSystem.documentDirectory + `profiletmp_${Date.now()}.${extension}`;
  await FileSystem.writeAsStringAsync(path, base64String, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const usrdt = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phone2: user.phone2,

    username: user.username,
    avatar: path,
  };
  const listGroups = [];

  groups.map((group) => {
    listGroups.push(group);
  });

  await AsyncStorage.setItem("user", JSON.stringify(usrdt)); // storeuser);
  await AsyncStorage.setItem("groups", JSON.stringify(listGroups));
};
export const updateUserData = async (user) => {
  const base64String = user.avatar.replace(/^data:image\/\w+;base64,/, "");
  const extension = getFileExtensionFromBase64(base64String);
  const path =
    FileSystem.documentDirectory + `profiletmp_${Date.now()}.${extension}`;
  await FileSystem.writeAsStringAsync(path, base64String, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const usrdt = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phone2: user.phone2,

    username: user.username,
    avatar: path,
  };

  await AsyncStorage.setItem("user", JSON.stringify(usrdt)); // storeuser);
  await AsyncStorage.setItem("groups", JSON.stringify(listGroups));
};
export const getUserData = async () => {
  const user = await AsyncStorage.getItem("user");
  return JSON.parse(user); // user;
};

export const getGroupUser = async () => {
  const groups = await AsyncStorage.getItem("groups");
  return JSON.parse(groups); // groups; // groups;
};

export const removeUserData = async () => {
  const userString = await AsyncStorage.getItem("user");
  if (userString) {
    const user = JSON.parse(userString);

    // Hapus file foto kalau ada
    if (user.avatarPath) {
      const fileInfo = await FileSystem.getInfoAsync(user.avatarPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(user.avatarPath, { idempotent: true });
      }
    }
  }
  await AsyncStorage.removeItem("user");
  await AsyncStorage.removeItem("groups");
};
