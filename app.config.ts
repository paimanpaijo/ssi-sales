/** @format */
import "dotenv/config";

export default {
  expo: {
    name: "SSI Sales",
    slug: "ssi-sales",
    scheme: "ssisales",
    android: {
      config: {
        googleMaps: {
          apiKey: "AIzaSyBkfeyIR8_4Ve13Nz9wjoYWt4jCLlrezV8",
        },
      },
      package: "com.devtim.ops.SsiSales",
      permissions: [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "RECORD_AUDIO",
      ],
    },
    extra: {
      apiUrlOdoo: process.env.URL_BASE,
      apiURLZurra: process.env.URL_API_BASE,
      googleMapsApiKey: "AIzaSyBkfeyIR8_4Ve13Nz9wjoYWt4jCLlrezV8",
      eas: {
        projectId: "71e81eb0-aa59-4cdf-95ca-db41f685f35c",
      },
    },
    plugins: [
      "expo-secure-store",
      [
        "expo-media-library",
        {
          photosPermission: "Akses foto diperlukan untuk upload gambar.",
          audioPermission:
            "Akses audio diperlukan untuk mengambil media yang berisi suara.",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Aplikasi memerlukan akses lokasi untuk menandai posisi pengambilan foto.",
        },
      ],
    ],
  },
};
