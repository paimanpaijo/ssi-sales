/** @format */

// CheckboxPaper.tsx
import React, { useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import { Checkbox as PaperCheckbox, useTheme } from "react-native-paper";

type CheckboxProps = {
  checked?: boolean; // controlled
  defaultChecked?: boolean; // uncontrolled default
  onChange?: (checked: boolean) => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
  color?: string; // when checked
  uncheckedColor?: string; // when unchecked
  indeterminate?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: any;
};

/**
 * Checkbox (react-native-paper)
 * - Uses Paper's Checkbox under the hood
 * - Supports controlled & uncontrolled modes
 * - Supports indeterminate (mapped to Paper's 'indeterminate' status)
 * - Small press animation for feedback
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  color,
  uncheckedColor,
  indeterminate = false,
  accessibilityLabel,
  testID,
  style,
}) => {
  const theme = useTheme();
  const isControlled = typeof checked === "boolean";
  const [internal, setInternal] = useState<boolean>(defaultChecked);
  const value = isControlled ? (checked as boolean) : internal;

  // small scale animation for press feedback
  const scale = useRef(new Animated.Value(1)).current;

  const toggle = (e?: GestureResponderEvent) => {
    if (disabled) return;
    const next = indeterminate ? true : !value;
    if (!isControlled) setInternal(next);
    onChange && onChange(next);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // map to Paper status
  const status: "checked" | "unchecked" | "indeterminate" = indeterminate
    ? "indeterminate"
    : value
    ? "checked"
    : "unchecked";

  const checkboxColor = color ?? theme.colors.primary;

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: status === "checked", disabled }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[{ flexDirection: "row", alignItems: "center" }, style]}
    >
      <Animated.View
        style={{ transform: [{ scale }], marginRight: label ? 8 : 0 }}
      >
        <PaperCheckbox
          status={status}
          onPress={toggle}
          disabled={disabled}
          color={checkboxColor}
          uncheckedColor={uncheckedColor}
        />
      </Animated.View>

      {label ? (
        typeof label === "string" ? (
          <Text
            selectable={false}
            style={{ fontSize: 14, color: disabled ? "#999" : "#000" }}
          >
            {label}
          </Text>
        ) : (
          label
        )
      ) : null}
    </Pressable>
  );
};

/* ---------------- CheckboxGroup ---------------- */
export const CheckboxGroup: React.FC<{
  options: { label: string | React.ReactNode; value: string }[];
  values: string[]; // selected values
  onChange: (next: string[]) => void;
  direction?: "row" | "column";
  disabled?: boolean;
  checkboxProps?: Partial<CheckboxProps>;
}> = ({
  options,
  values,
  onChange,
  direction = "column",
  disabled = false,
  checkboxProps = {},
}) => {
  const toggle = (val: string) => {
    const exists = values.includes(val);
    const next = exists ? values.filter((v) => v !== val) : [...values, val];
    onChange(next);
  };

  return (
    <View
      style={[
        {
          flexDirection: direction === "row" ? "row" : "column",
          gap: 8 as any,
        },
      ]}
    >
      {options.map((opt) => (
        <Checkbox
          key={opt.value}
          checked={values.includes(opt.value)}
          onChange={() => toggle(opt.value)}
          label={opt.label}
          disabled={disabled}
          {...checkboxProps}
        />
      ))}
    </View>
  );
};

/* ---------------- Example usage ----------------

import React, { useState } from "react";
import { View } from "react-native";
import { Checkbox, CheckboxGroup } from "./CheckboxPaper";

export default function Example() {
  const [isChecked, setIsChecked] = useState(false);
  const [vals, setVals] = useState<string[]>([]);

  return (
    <View style={{ padding: 16 }}>
      <Checkbox
        checked={isChecked}
        onChange={setIsChecked}
        label="Saya setuju"
      />

      <Checkbox defaultChecked label="Default checked (uncontrolled)" onChange={(v)=>console.log(v)} />

      <Checkbox indeterminate checked={false} label="Pilih semua (indeterminate)" onChange={(v)=>console.log(v)} />

      <CheckboxGroup
        options={[{ label: "Satu", value: "1" }, { label: "Dua", value: "2" }]}
        values={vals}
        onChange={setVals}
        direction="column"
      />
    </View>
  );
}

*/

/* Notes:
- Make sure react-native-paper is installed and set up in your project:
  npm install react-native-paper
  and wrap your App with Provider from react-native-paper and provide a theme.
- Paper's Checkbox supports status 'checked' | 'unchecked' | 'indeterminate'.
- If you want custom sized checkboxes, you'd need to replace the PaperCheckbox with a custom icon (or wrap and scale), but Paper's default sizes are platform-consistent.
*/
