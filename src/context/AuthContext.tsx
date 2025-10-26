/** @format */

import { login as loginApi } from "@/src/api/auth";
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
// optional key untuk user agar bisa restore user tanpa panggil API profil
const SECURE_KEY_USER = "user_v1";
// store JSON: { token: string, ts: number }
const TOKEN_TTL_SECONDS = 60 * 60; // 1 hour

type AuthResponse = {
  access_token?: string;
  token?: string; // in case your API uses different key
  user?: any;
};

type AuthContextType = {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parseStored = (raw: string | null) => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { token: string; ts: number };
    } catch (err) {
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
      (async () => await logout())();
      return;
    }
    logoutTimerRef.current = setTimeout(() => {
      (async () => {
        await logout();
      })();
    }, secsLeft * 1000);
  };

  // restore token & user from secure store on app startup
  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(SECURE_KEY_TOKEN);
        const stored = parseStored(raw);
        if (stored && stored.token && stored.ts) {
          if (isTokenExpired(stored.ts)) {
            // expired: remove everything
            await SecureStore.deleteItemAsync(SECURE_KEY_TOKEN);
            await SecureStore.deleteItemAsync(SECURE_KEY_USER);
            setToken(null);
            setUser(null);
          } else {
            // restore token
            setToken(stored.token);
            scheduleAutoLogout(stored.ts);

            // try restore user (if stored). If not stored, you can fetch profile from backend here.
            const rawUser = await SecureStore.getItemAsync(SECURE_KEY_USER);
            if (rawUser) {
              try {
                const parsedUser = JSON.parse(rawUser);
                setUser(parsedUser);
              } catch (err) {
                console.warn("Failed to parse stored user", err);
                setUser(null);
              }
            } else {
              // optionally: fetch profile via API using stored.token
              setUser(null); // or call fetchProfile(stored.token)
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
      try {
        await SecureStore.setItemAsync(
          SECURE_KEY_USER,
          JSON.stringify(userObj)
        );
      } catch (err) {
        console.warn("Failed to persist user to secure store", err);
      }
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
      // Normalize token key: prefer access_token, fallback to token
      const accessToken = data.access_token ?? data.token;
      if (!data || !accessToken) {
        Alert.alert("Login failed", "Invalid credentials or response.");
        throw new Error("Invalid credentials or response.");
      }

      // cek employee data ada atau tidak

      const res = await getEmployeeByEmail(data.user.email);

      if (!res || !res.success) {
        Alert.alert("Login failed", "Employee data not found.");
        Alert.alert("Login failed", "Employee data not found.");
      }

      setToken(accessToken);
      const userdata = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.work_email,
        mobile: res.data.mobile_phone,
        job_title: res.data.job_id ? res.data.job_id[1] : "",
      };
      setUser(userdata ?? null);

      // persist token + user
      await persistToken(accessToken, userdata ?? null);

      return accessToken;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
      await SecureStore.deleteItemAsync(SECURE_KEY_TOKEN);
      await SecureStore.deleteItemAsync(SECURE_KEY_USER);
    } catch (err) {
      console.warn("Logout error", err);
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };

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
