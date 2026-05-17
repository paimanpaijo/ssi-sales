/** @format */

import { useAuth } from "@/src/context/AuthContext";
import { useUserContext } from "@/src/context/UserContext";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";

const ProfileAvatar = () => {
  const { user } = useAuth();

  const {
    setIsProfile,
    setUserData,
    handleUpdateProfile,
    handleOnChange,
    image,
    setImage,
    setImageData,
  } = useUserContext();

  // 🔥 PILIH SUMBER GAMBAR
  const chooseImageSource = () => {
    Alert.alert("Update Avatar", "Pilih sumber gambar", [
      { text: "Kamera", onPress: openCamera },
      { text: "Galeri", onPress: openGallery },
      { text: "Batal", style: "cancel" },
    ]);
  };

  // 📸 CAMERA
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission ditolak", "Izinkan akses kamera dulu");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true, // crop langsung
      aspect: [1, 1], // avatar square
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  // 🖼️ GALLERY
  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission ditolak", "Izinkan akses galeri dulu");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  // ⚙️ PROCESS IMAGE → RESIZE + WEBP

  const processImage = async (uri) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      setImage(result.uri);
    } catch (err) {
      console.log("Image error:", err);
    }
  };
  return (
    <View style={{ alignItems: "center", marginVertical: 16 }}>
      <TouchableOpacity onPress={chooseImageSource}>
        <View style={{ position: "relative", marginBottom: 10 }}>
          <Avatar.Image size={200} source={{ uri: image }} />

          {/* ICON CAMERA */}
          <IconButton
            icon="camera"
            size={20}
            onPress={chooseImageSource}
            style={{
              position: "absolute",
              bottom: -5,
              right: -5,
              backgroundColor: "white",
            }}
          />
        </View>
      </TouchableOpacity>

      <Card
        style={{
          borderRadius: 16,
          paddingVertical: 10,
          elevation: 3,
          width: "95%",
          alignContent: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: 10,
        }}
      >
        {/* HEADER */}
        <Card.Title
          title={"Profile"}
          subtitle={user?.name}
          titleStyle={{ color: "#111", fontWeight: "bold" }}
          subtitleStyle={{ color: "#666" }}
          left={() => <Avatar.Image size={50} source={{ uri: user?.avatar }} />}
        />
        <Card.Content>
          {/* AVATAR BESAR */}

          {/* INFO USER */}
          <View
            style={{
              gap: 12,
              marginVertical: 5,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              Informasi User
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 0,
              }}
            >
              <TextInput
                mode="outlined"
                label="username"
                editable={false}
                left={<TextInput.Icon icon="account" />}
                value={user?.username}
                style={{ flex: 1 }}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                mode="outlined"
                label="Email"
                editable={false}
                left={<TextInput.Icon icon="email" />}
                value={user?.email}
                style={{ flex: 1 }}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                mode="outlined"
                label="Full Name"
                left={<TextInput.Icon icon="account" />}
                value={user?.name}
                style={{ flex: 1 }}
                onChangeText={(text) => {
                  handleOnChange("name", text);
                }}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                mode="outlined"
                label="Phone"
                left={<TextInput.Icon icon="phone" />}
                value={user?.phone}
                style={{ flex: 1 }}
                onChangeText={(text) => handleOnChange("phone", text)}
              />
            </View>
          </View>
        </Card.Content>
        {/* ACTION BUTTON */}
        <Card.Actions
          style={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginTop: 10,
          }}
        >
          <Button
            mode="contained"
            style={{
              flex: 1,
              marginRight: 8,
              borderRadius: 10,
            }}
            onPress={() => handleUpdateProfile()}
          >
            Update
          </Button>

          <Button
            mode="outlined"
            textColor="black"
            style={{
              flex: 1,
              marginLeft: 8,
              borderRadius: 10,
              color: "white",
              backgroundColor: "#f0ad4e",
            }}
            onPress={() => setIsProfile(false)}
          >
            Password
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default ProfileAvatar;
