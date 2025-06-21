import React, { useEffect, useState, type JSX } from "react";
import {
  loginWithGoogle,
  logout as fbLogout,
  waitForAuth,
  auth,
} from "../firebase";
import { Navigate } from "react-router-dom";
import { AuthContext, useAuth } from "./useAuth.tsx";

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    waitForAuth().then((user) => {
      setAuthed(!!user);
      setLoading(false);
    });
    return auth.onAuthStateChanged((user) => setAuthed(!!user));
  }, []);

  const value: AuthState = {
    isAuthenticated,
    loading,
    login: () => loginWithGoogle(),
    logout: () => fbLogout(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to="/"
      replace
    />
  );
}
