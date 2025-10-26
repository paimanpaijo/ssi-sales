/** @format */
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";

type FormHeaderProps = {
  title: string;
  onSave: () => void;
  onClose: () => void;
  backgroundColor?: string; // opsional
};

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  onSave,
  onClose,
  backgroundColor = "#0d6efd", // default warna biru
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginBottom: 5,
      }}
    >
      {/* Judul */}
      <Text
        style={{
          color: "white",
          fontSize: 15,
          fontWeight: "600",
        }}
      >
        {title}
      </Text>

      {/* Tombol kanan */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 7,
        }}
      >
        {/* Tombol Save */}
        <TouchableOpacity
          onPress={onSave}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <IconButton
            icon="content-save"
            iconColor="blue"
            size={15}
            style={{
              backgroundColor: "white",
              margin: 5,
            }}
          />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 10,
              textAlign: "center",
              marginTop: -6,
            }}
          >
            Save
          </Text>
        </TouchableOpacity>

        {/* Tombol Close */}
        <TouchableOpacity
          onPress={onClose}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <IconButton
            icon="close"
            iconColor="grey"
            size={15}
            style={{
              backgroundColor: "white",
              margin: 5,
            }}
          />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 10,
              textAlign: "center",
              marginTop: -6,
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FormHeader;
