/** @format */

import { login as loginApi } from "@/src/api/auth";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";
import { getEmployeeByEmail } from "../api/master/EmployeeAPI";

const SECURE_KEY_TOKEN = "token_v1";
const SECURE_KEY_USER = "user_v1";

// ⏰ 24 jam (1 hari)
const TOKEN_TTL_SECONDS = 24 * 60 * 60;

type AuthResponse = {
  access_token?: string;
  token?: string;
  user?: any;
};

type AuthContextType = {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string>;
  logout: (silent?: boolean) => Promise<void>;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const parseStored = (raw: string | null) => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { token: string; ts: number };
    } catch {
      return null;
    }
  };

  const isTokenExpired = (ts: number) => {
    const age = Math.floor(Date.now() / 1000) - ts;
    return age >= TOKEN_TTL_SECONDS;
  };

  const scheduleAutoLogout = (ts: number) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    const expiresAt = ts + TOKEN_TTL_SECONDS;
    const now = Math.floor(Date.now() / 1000);
    const secsLeft = Math.max(0, expiresAt - now);

    if (secsLeft <= 0) {
      handleAutoLogout();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      handleAutoLogout();
    }, secsLeft * 1000);
  };

  const handleAutoLogout = async () => {
    await logout(true); // silent
    Alert.alert("Session expired", "Please login again.");
    router.replace("/login"); // arahkan ke form login
  };

  // 🔁 Restore token saat startup
  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(SECURE_KEY_TOKEN);
        const stored = parseStored(raw);

        if (stored && stored.token && stored.ts) {
          if (isTokenExpired(stored.ts)) {
            await logout(true);
          } else {
            setToken(stored.token);
            scheduleAutoLogout(stored.ts);

            const rawUser = await SecureStore.getItemAsync(SECURE_KEY_USER);
            if (rawUser) {
              try {
                const parsedUser = JSON.parse(rawUser);
                setUser(parsedUser);
              } catch {
                setUser(null);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Auth restore error", err);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  const persistToken = async (tok: string, userObj?: any) => {
    const payload = { token: tok, ts: Math.floor(Date.now() / 1000) };
    await SecureStore.setItemAsync(SECURE_KEY_TOKEN, JSON.stringify(payload));
    if (userObj) {
      await SecureStore.setItemAsync(SECURE_KEY_USER, JSON.stringify(userObj));
    }
    scheduleAutoLogout(payload.ts);
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await loginApi(email, password);

      if (data.success === false) {
        Alert.alert("Login failed", data.message);
        throw new Error(data.message || "Login failed");
      }

      const accessToken = data.access_token ?? data.token;
      if (!data || !accessToken) {
        Alert.alert("Login failed", "Invalid credentials or response.");
        throw new Error("Invalid credentials or response.");
      }

      const res = await getEmployeeByEmail(data.user.email);
      if (!res || !res.success) {
        Alert.alert("Login failed", "Employee data not found.");
        throw new Error("Employee data not found.");
      }

      const userdata = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.work_email,
        mobile: res.data.mobile_phone,
        job_title: res.data.job_id ? res.data.job_id[1] : "user",
      };

      setToken(accessToken);
      setUser(userdata);
      await persistToken(accessToken, userdata);

      // setelah login sukses
      router.replace("/(tabs)"); // langsung ke halaman utama
      return accessToken;
    } catch (err) {
      throw err;
    }
  };

  const logout = async (silent = false) => {
    try {
      setUser(null);
      setToken(null);
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
      await SecureStore.deleteItemAsync(SECURE_KEY_TOKEN);
      await SecureStore.deleteItemAsync(SECURE_KEY_USER);

      if (!silent) router.replace("/login");
    } catch (err) {
      console.warn("Logout error", err);
    }
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
