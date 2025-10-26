/** @format */

import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

const ListComponent = ({
  data,
  onSelectItem,
  renderItem,
  style = {},
  formStyles = {},
  placeholder,
  label,
  iconsearch = true,
  onChangeText, // <-- baru
  searchValue, // <-- baru
  onClearSearch,
}) => {
  // const [searchText, setSearchText] = useState(
  //   searchValue !== undefined ? searchValue : internalSearchText
  // );
  // const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [internalSearchText, setInternalSearchText] = useState("");
  const searchText =
    searchValue !== undefined ? searchValue : internalSearchText;

  const handleChangeText = (text) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setInternalSearchText(text);
    }
  };
  useEffect(() => {
    if (selectedId != null) {
      setFilteredData([]);
      setSelectedId(null);
    } else {
      if (searchText.length === 0) {
        setFilteredData([]);
      } else {
        const lowerSearch = searchText.toLowerCase();
        const filtered = data.filter((item) =>
          item.name.toLowerCase().includes(lowerSearch)
        );
        setFilteredData(filtered);
      }
    }
  }, [searchText, data]);

  const defaultRenderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    return (
      <Pressable
        onPress={() => handleSelectItem(item)}
        style={[styles.listitem, isSelected && styles.selectedItem]}
      >
        <Text style={[styles.label, isSelected && styles.selectedText]}>
          {item.name}
        </Text>
      </Pressable>
    );
  };
  const handleSelectItem = (item) => {
    setSelectedId(item.id);
    setInternalSearchText(item.name);
    setFilteredData([]);
    if (onSelectItem) {
      onSelectItem(item); // jika parent ingin ambil data
    }
  };
  const renderWrappedItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    const content = renderItem ? (
      renderItem({ item, isSelected })
    ) : (
      <Text style={[styles.label, isSelected && styles.selectedText]}>
        {item.name}
      </Text>
    );

    return (
      <Pressable
        onPress={() => handleSelectItem(item)}
        style={[styles.listitem, isSelected && styles.selectedItem]}
      >
        {content}
      </Pressable>
    );
  };

  return (
    <View style={[{ position: "relative" }, style]}>
      <TextInput
        mode="outlined"
        label={label || "Search"}
        placeholder={placeholder || "Type to search..."}
        value={searchText}
        onChangeText={handleChangeText}
        left={iconsearch && <TextInput.Icon icon="magnify" />}
        right={
          searchText.length > 0 ? (
            <TextInput.Icon
              icon="close"
              onPress={() => {
                setInternalSearchText("");
                setFilteredData([]);
                setSelectedId(null);
                if (onClearSearch) {
                  onClearSearch();
                }
              }}
            />
          ) : null
        }
        style={[styles.input]}
      />

      {filteredData.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 5,
            right: 5,
            padding: 5,
            backgroundColor: "white",
            borderRadius: 5,
            elevation: 5,
            zIndex: 1000,
            maxHeight: 200,
          }}
        >
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderWrappedItem}
            extraData={selectedId}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginHorizontal: 5,
    width: "100%",
    flexShrink: 1, // agar tidak memaksa tetap di satu baris
    flexWrap: "wrap", //
    color: "black",
  },
  selectedItem: {
    backgroundColor: "#4caf50",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
  listitem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 5,
    marginBottom: 1,
  },
  input: {
    borderWidth: 0,
    borderRadius: 5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    height: 40,
    backgroundColor: "white",
    marginBottom: 5,
  },
});
export default ListComponent;
