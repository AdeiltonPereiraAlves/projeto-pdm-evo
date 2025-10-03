// // context/AuthContext.tsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { createContext, useEffect, useState } from "react";

// export interface AuthContextType {
//   token: string | null;
//   tipoUsuario: "ONG" | "VOLUNTARIO" | null;
//   login: (token: string, tipo: "ONG" | "VOLUNTARIO") => Promise<void>;
//   logout: () => Promise<void>;
//   loading: boolean;
// }

// export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [tipoUsuario, setTipoUsuario] = useState<"ONG" | "VOLUNTARIO" | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const savedToken = await AsyncStorage.getItem("token");
//         const savedTipo = await AsyncStorage.getItem("tipoUsuario");

//         if (savedToken) setToken(savedToken);
//         if (savedTipo) setTipoUsuario(savedTipo as "ONG" | "VOLUNTARIO");
//       } catch (error) {
//         console.error("Erro ao ler AsyncStorage:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkToken();
//   }, []);

//   const login = async (t: string, tipo: "ONG" | "VOLUNTARIO") => {
//     try {
//       setToken(t);
//       setTipoUsuario(tipo);
//       await AsyncStorage.setItem("token", t);
//       await AsyncStorage.setItem("tipoUsuario", tipo);
//     } catch (error) {
//       console.error("Erro ao salvar no AsyncStorage:", error);
//     }
//   };

//   const logout = async () => {
//     try {
//       setToken(null);
//       setTipoUsuario(null);
//       await AsyncStorage.removeItem("token");
//       await AsyncStorage.removeItem("tipoUsuario");
//     } catch (error) {
//       console.error("Erro ao limpar AsyncStorage:", error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ token, tipoUsuario, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // precisa instalar: npm i jwt-decode
import React, { createContext, useEffect, useState } from "react";

export interface AuthContextType {
  token: string | null;
  tipoUsuario: "ONG" | "VOLUNTARIO" | null;
  login: (token: string, tipo: "ONG" | "VOLUNTARIO") => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface JWTPayload {
  exp: number; // exp vem em segundos no JWT
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [tipoUsuario, setTipoUsuario] = useState<"ONG" | "VOLUNTARIO" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedTipo = await AsyncStorage.getItem("tipoUsuario");

        if (savedToken) {
          // verifica expiração
          const decoded: JWTPayload = jwtDecode(savedToken);
          const now = Date.now() / 1000; // segundos

          if (decoded.exp && decoded.exp > now) {
            setToken(savedToken);
            if (savedTipo) setTipoUsuario(savedTipo as "ONG" | "VOLUNTARIO");
          } else {
            // token expirado → limpa
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("tipoUsuario");
            await logout();
            setToken(null);
            setTipoUsuario(null);
          }
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
      } finally {
        setLoading(false);
      }
    };


    checkToken();
  }, []);

  const login = async (t: string, tipo: "ONG" | "VOLUNTARIO") => {
    try {
      setToken(t);
      setTipoUsuario(tipo);
      await AsyncStorage.setItem("token", t);
      await AsyncStorage.setItem("tipoUsuario", tipo);
    } catch (error) {
      console.error("Erro ao salvar no AsyncStorage:", error);
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setTipoUsuario(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("tipoUsuario");
    } catch (error) {
      console.error("Erro ao limpar AsyncStorage:", error);
    }
  };


  

  return (
    <AuthContext.Provider value={{ token, tipoUsuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
