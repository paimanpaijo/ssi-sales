/** @format */

import React, { useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { MD2Colors } from "react-native-paper";

type Item = {
  id: string | number;
  label?: string | null;
  [k: string]: any;
};

type StyleProps = {
  container?: ViewStyle;
  input?: TextStyle;
  modalContainer?: ViewStyle;
  searchInput?: TextStyle;
  item?: ViewStyle;
  itemText?: TextStyle;
  headerText?: TextStyle;
  emptyText?: TextStyle;
};

type Props = {
  data?: Item[]; // default []
  onSelect: (item: Item) => void;
  placeholder?: string;
  renderItem?: (item: Item, onSelect: (item: Item) => void) => React.ReactNode;
  renderHeader?: (closeModal: () => void) => React.ReactNode;
  renderFooter?: (closeModal: () => void) => React.ReactNode;
  value?: string;
  label?: string;
  style?: StyleProps; // <-- custom style overrides
  modalProps?: Partial<React.ComponentProps<typeof Modal>>; // pass-thru modal props
};

const SelectModalInput: React.FC<Props> = ({
  data = [],
  onSelect,
  placeholder,
  label,
  renderItem,
  renderHeader,
  renderFooter,
  value,
  style,
  modalProps,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [searchText, setSearchText] = useState("");

  const closeModal = () => setModalVisible(false);

  const normalizedSearch = (searchText ?? "").toString().trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!normalizedSearch) return data;
    return data.filter((item) => {
      if (!item) return false;
      const label = (item.label ?? "").toString();
      return label.toLowerCase().includes(normalizedSearch);
    });
  }, [data, normalizedSearch]);

  const handleSelect = (item: Item) => {
    setSelectedLabel(item.label ?? String(item.id ?? ""));
    closeModal();
    onSelect(item);
  };
  React.useEffect(() => {
    if (!value || !data.length) return;

    const found = data.find((item) => String(item.id) === String(value));
    if (found) {
      setSelectedLabel(found.label ?? String(found.id));
    }
  }, [value, data]);
  const defaultRenderItem: ListRenderItem<Item> = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, style?.item]}
      onPress={() => handleSelect(item)}
    >
      <Text style={[styles.itemText, style?.itemText]}>
        {item.label ?? String(item.id ?? "")}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style?.container]}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          style={[styles.input, style?.input]}
          value={selectedLabel || value}
          placeholder={placeholder || "Pilih item"}
          editable={false}
          pointerEvents="none"
          label={label}
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" {...modalProps}>
        {renderHeader ? (
          renderHeader(closeModal)
        ) : (
          <Text
            style={[
              {
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: MD2Colors.lightBlueA700,
                color: "white",
                padding: 10,
              },
              style?.headerText,
            ]}
          >
            {placeholder || "Pilih Item"}
          </Text>
        )}

        <View style={[styles.modalContainer, style?.modalContainer]}>
          <TextInput
            style={[styles.searchInput, style?.searchInput]}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />

          <FlatList
            data={filteredData}
            keyExtractor={(item) => String(item?.id ?? Math.random())}
            renderItem={
              renderItem
                ? ({ item }) => renderItem(item, handleSelect)
                : defaultRenderItem
            }
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
              <View style={{ padding: 12, alignItems: "center" }}>
                <Text style={[styles.emptyText, style?.emptyText]}>
                  Tidak ada hasil
                </Text>
              </View>
            )}
          />

          {renderFooter && renderFooter(closeModal)}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    padding: 10,

    borderRadius: 5,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemText: {
    color: "#000",
  },
  emptyText: {
    color: "#666",
  },
});

export default SelectModalInput;
