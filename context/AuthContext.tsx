// context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  token: string | null;
  tipoUsuario: "ong" | "voluntario" | null;
  login: (token: string, tipo: "ong" | "voluntario") => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [tipoUsuario, setTipoUsuario] = useState<"ong" | "voluntario" | null>(null);

  useEffect(() => {
    const carregarToken = async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      const savedTipo = await SecureStore.getItemAsync("tipoUsuario");
      if (savedToken && savedTipo) {
        setToken(savedToken);
        setTipoUsuario(savedTipo as "ong" | "voluntario");
      }
    };
    carregarToken();
  }, []);

  const login = async (t: string, tipo: "ong" | "voluntario") => {
    setToken(t);
    setTipoUsuario(tipo);
    await SecureStore.setItemAsync("token", t);
    await SecureStore.setItemAsync("tipoUsuario", tipo);
  };

  const logout = async () => {
    setToken(null);
    setTipoUsuario(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("tipoUsuario");
  };

  return (
    <AuthContext.Provider value={{ token, tipoUsuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
