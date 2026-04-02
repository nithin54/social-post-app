import React, { createContext, useContext, useEffect, useState } from "react";
import { authLogin, authSignup, setAuthToken } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "social-post-auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        const session = JSON.parse(raw);
        setToken(session.token || "");
        setUser(session.user || null);
        setAuthToken(session.token || "");
      } catch (_error) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const saveSession = (session) => {
    setToken(session.token);
    setUser(session.user);
    setAuthToken(session.token);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const clearSession = () => {
    setToken("");
    setUser(null);
    setError("");
    setAuthToken("");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (credentials) => {
    setError("");

    try {
      const session = await authLogin(credentials);
      saveSession(session);
      return session;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const signup = async (payload) => {
    setError("");

    try {
      const session = await authSignup(payload);
      saveSession(session);
      return session;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const value = {
    error,
    loading,
    login,
    logout: clearSession,
    signup,
    token,
    user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
