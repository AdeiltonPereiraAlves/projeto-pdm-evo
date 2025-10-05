// import { Vaga } from "@/src/screens/tabs/voluntario/Home";
// import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import useAPI from "../hooks/useAPI";
// import { AuthContext } from "./AuthContext";
// interface VagaContextType {
//   vagas: Vaga[];
//   atualizarVagas: () => Promise<void>;
// }

// export const VagaContext = createContext<VagaContextType | undefined>(undefined);

// export const VagaProvider = ({ children }: { children: ReactNode }) => {
//     const { logout, token } = useContext(AuthContext);
//   const [vagas, setVagas] = useState<Vaga[]>([]);
//   const { listarVagas } = useAPI();

//   const atualizarVagas = async () => {
//     try {
//       const dados = await listarVagas(token!);
//       setVagas(dados);
//     } catch (error) {
//       console.error("Erro ao atualizar vagas:", error);
//     }
//   };


//   useEffect(() => {
//     const verificarToken = async () => {
//       try {
//          await atualizarVagas()
        
//       } catch (error: any) {
//         if (error.response?.status === 401) { // token expirado
//           logout(); // dispara o logout global
//         }
//       }
//     };
  
//     verificarToken();
//   }, [token]);

//   return (
//     <VagaContext.Provider value={{ vagas, atualizarVagas }}>
//       {children}
//     </VagaContext.Provider>
//   );
// };

// export const useVagas = () => {
//   const context = useContext(VagaContext);
//   if (!context) throw new Error("useVagas deve ser usado dentro de VagaProvider");
//   return context;
// };
import { formatarData } from "@/src/components/shared/FormatarData";
import { Vaga } from "@/src/screens/tabs/voluntario/Home";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useAPI from "../hooks/useAPI";
import { AuthContext } from "./AuthContext";

interface VagaContextType {
  vagas: Vaga[];
  atualizarVagas: () => Promise<void>;
  loading: boolean;
}

export const VagaContext = createContext<VagaContextType | undefined>(undefined);

export const VagaProvider = ({ children }: { children: ReactNode }) => {
  const { logout, token } = useContext(AuthContext);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(false);
  const { listarVagas } = useAPI();

  const atualizarVagas = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const dados = await listarVagas(token);
      const vagasFormatadas = dados.map((vaga: any) => ({
        id: vaga.id || vaga._id,
        titulo: vaga.titulo,
        nomeOng: vaga.ong?.nome || "ONG",
        imagemOng: vaga.ong?.imagem || "",
        areaAtuacao: Array.isArray(vaga.areaAtuacao) ? vaga.areaAtuacao : [],
        localizacao: vaga.localizacao || "Local não informado",
        data: formatarData(vaga.createdAt) ,
        descricao: vaga.descricao || "Descrição não disponível",
        tipoTrabalho: vaga.tipoTrabalho || "",
        categoria: vaga.categoria || "Geral",
      }));
      setVagas(vagasFormatadas);
    } catch (error: any) {
      console.error("Erro ao atualizar vagas:", error);
      // Logout automático se token expirado
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    atualizarVagas();
  }, [token]);

  return (
    <VagaContext.Provider value={{ vagas, atualizarVagas, loading }}>
      {children}
    </VagaContext.Provider>
  );
};

export const useVagas = () => {
  const context = useContext(VagaContext);
  if (!context) throw new Error("useVagas deve ser usado dentro de VagaProvider");
  return context;
};
