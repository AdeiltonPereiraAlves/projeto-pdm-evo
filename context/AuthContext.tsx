// context/AuthContext.tsx
import * as SecureStore from "expo-secure-store";
import React, { createContext, useEffect, useState } from "react";

export interface AuthContextType {
  token: string | null;
  tipoUsuario: "ONG" | "VOLUNTARIO" | null;
  login: (token: string, tipo: "ONG" | "VOLUNTARIO") => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [tipoUsuario, setTipoUsuario] = useState<"ONG" | "VOLUNTARIO" | null>(null);

  useEffect(() => {
    const carregarToken = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync("token");
        const savedTipo = await SecureStore.getItemAsync("tipoUsuario");

        if (savedToken && savedTipo && (savedTipo === "ONG" || savedTipo === "VOLUNTARIO")) {
          setToken(savedToken);
          setTipoUsuario(savedTipo);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do SecureStore:", error);
      }
    };
    carregarToken();
  }, []);

  const login = async (t: string, tipo: "ONG" | "VOLUNTARIO") => {
    try {
      setToken(t);
      setTipoUsuario(tipo);
      await SecureStore.setItemAsync("token", String(t));
      await SecureStore.setItemAsync("tipoUsuario", String(tipo));
    } catch (error) {
      console.error("Erro ao salvar no SecureStore:", error);
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setTipoUsuario(null);
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("tipoUsuario");
    } catch (error) {
      console.error("Erro ao limpar SecureStore:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, tipoUsuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
