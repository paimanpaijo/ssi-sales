/** @format */

import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MD2Colors, TextInput } from "react-native-paper";

// ... (Type definitions tetap sama seperti kode awal kamu)

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
  visible,
  onClose,
}) => {
  const [internalVisible, setInternalVisible] = useState(false);
  const modalVisible = visible ?? internalVisible;

  const closeModal = () => {
    if (onClose) onClose();
    else setInternalVisible(false);
  };

  const [selectedLabel, setSelectedLabel] = useState("");
  const [searchText, setSearchText] = useState("");

  const normalizedSearch = (searchText ?? "").toString().trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!normalizedSearch) return data;
    return data.filter((item) => {
      if (!item) return false;
      const labelStr = (item.label ?? "").toString();
      return labelStr.toLowerCase().includes(normalizedSearch);
    });
  }, [data, normalizedSearch]);

  const handleSelect = (item: Item) => {
    setSelectedLabel(item.label ?? String(item.id ?? ""));
    closeModal();
    onSelect(item);
  };

  // Sync label saat value dari luar berubah
  useEffect(() => {
    if (value === undefined || value === null || !data.length) {
      if (!value) setSelectedLabel(""); // Reset jika value kosong
      return;
    }
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
      <View>
        <TextInput
          mode="outlined"
          label={label}
          value={selectedLabel} // Gunakan selectedLabel agar TextInput tahu ada isinya
          placeholder={placeholder}
          editable={false}
          right={<TextInput.Icon icon="chevron-down" />}
          style={[styles.paperInput, style?.input]}
        />
        {/* Overlay tombol transparan agar TextInput tidak fokus tapi modal terbuka */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={() =>
            visible === undefined ? setInternalVisible(true) : null
          }
        />
      </View>

      <Modal visible={modalVisible} animationType="slide" {...modalProps}>
        {/* Bagian Header Modal */}
        {renderHeader ? (
          renderHeader(closeModal)
        ) : (
          <View style={styles.defaultHeader}>
            <Text style={[styles.headerText, style?.headerText]}>
              {placeholder || "Pilih Item"}
            </Text>
          </View>
        )}

        <View style={[styles.modalContainer, style?.modalContainer]}>
          <TextInput
            mode="outlined"
            label="Cari..."
            value={searchText}
            onChangeText={setSearchText}
            style={{ marginBottom: 10 }}
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
  container: { width: "100%", marginBottom: 10 },
  paperInput: {
    backgroundColor: "white",
  },
  defaultHeader: {
    backgroundColor: MD2Colors.lightBlueA700,
    padding: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemText: {
    color: "#333",
    fontSize: 16,
  },
  emptyText: {
    color: "#999",
  },
});

export default SelectModalInput;
