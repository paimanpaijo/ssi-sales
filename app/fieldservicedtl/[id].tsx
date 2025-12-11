/** @format */

import FieldServiceDtl from "@/src/screens/App/FieldService/FieldServiceDtl";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function FieldServiceDetail() {
  const { id } = useLocalSearchParams();
  return <FieldServiceDtl id={id} />;
}
