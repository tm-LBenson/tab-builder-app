import { createContext, useContext } from "react";
import type { AuthState } from "./AuthContext";

export const AuthContext = createContext<AuthState>({} as AuthState);

export const useAuth = () => useContext(AuthContext);
