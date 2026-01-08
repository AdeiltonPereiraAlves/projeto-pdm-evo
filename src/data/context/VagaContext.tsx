// // import { Vaga } from "@/screens/tabs/voluntario/Home";
// // import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
// // import useAPI from "../hooks/useAPI";
// // import { AuthContext } from "./AuthContext";
// // interface VagaContextType {
// //   vagas: Vaga[];
// //   atualizarVagas: () => Promise<void>;
// // }

// // export const VagaContext = createContext<VagaContextType | undefined>(undefined);

// // export const VagaProvider = ({ children }: { children: ReactNode }) => {
// //     const { logout, token } = useContext(AuthContext);
// //   const [vagas, setVagas] = useState<Vaga[]>([]);
// //   const { listarVagas } = useAPI();

// //   const atualizarVagas = async () => {
// //     try {
// //       const dados = await listarVagas(token!);
// //       setVagas(dados);
// //     } catch (error) {
// //       console.error("Erro ao atualizar vagas:", error);
// //     }
// //   };


// //   useEffect(() => {
// //     const verificarToken = async () => {
// //       try {
// //          await atualizarVagas()

// //       } catch (error: any) {
// //         if (error.response?.status === 401) { // token expirado
// //           logout(); // dispara o logout global
// //         }
// //       }
// //     };

// //     verificarToken();
// //   }, [token]);

// //   return (
// //     <VagaContext.Provider value={{ vagas, atualizarVagas }}>
// //       {children}
// //     </VagaContext.Provider>
// //   );
// // };

// // export const useVagas = () => {
// //   const context = useContext(VagaContext);
// //   if (!context) throw new Error("useVagas deve ser usado dentro de VagaProvider");
// //   return context;
// // };
// import { formatarData } from "@/components/shared/DataFormatada";
// import { Vaga } from "@/screens/tabs/voluntario/Home";
// import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import useAPI from "../hooks/useAPI";
// import { AuthContext } from "./AuthContext";

// interface VagaContextType {
//   vagas: Vaga[];
//   vagasOng: any[];
//   atualizarVagas: () => Promise<void>;
//   loading: boolean;
//   imagem: any,
//   carregarFotoPerfil: (imagem: any) => any
//   listarVagasOng: (token: string) => Promise<any>;
// }

// export const VagaContext = createContext<VagaContextType | undefined>(undefined);

// export const VagaProvider = ({ children }: { children: ReactNode }) => {
//   const { logout, token } = useContext(AuthContext);
//   const [vagas, setVagas] = useState<Vaga[]>([]);
//   const [vagasOng, setVagasOng] = useState<any>([]);
//   const [loading, setLoading] = useState(false);
//   const [imagem, setImagem] = useState()
//   const { listarVagas, httpGet } = useAPI();

//   function carregarFotoPerfil(imagem: any) {
//     setImagem(imagem)
//   }
  
  

//   // vagas criadas pela ong

//   const listarVagasOng = async (token: string): Promise<any> => {
//     try {
//       if (!token) return;
//       setLoading(true);
//         const dados = await httpGet("listar/vagas/ong", token);
//         const vagas = await dados.vagas;
//         console.log(vagas, "dadosVagas")
//         if (!Array.isArray(vagas)) {
//           setVagas([]);
//           return;
//         }
//        setVagasOng(vagas);
//       } catch (error) {
//         console.error("Erro ao listar vagas da ong:", error);
//         throw error;
//       }
//     };
   


//     const atualizarVagas = async () => {
//       if (!token) return;
//       setLoading(true);
//       try {
//         const dados = await listarVagas(token);
       
//         if (!Array.isArray(dados)) {
//           setVagas([]);
//           return;
//         }
//         const vagasFormatadas = dados.map((vaga: any) => ({
//           id: vaga.id,
//           titulo: vaga.titulo,
//           nomeOng: vaga.ong?.nome || "ONG",
//           imagemOng: vaga.ong?.imagem || "",
//           areaAtuacao: vaga.ong?.areaAtuacao ?? [],
//           localizacao: vaga.localizacao || "Local não informado",
//           latitude: Number(vaga.latitude),
//           longitude: Number(vaga.longitude),
//           data: formatarData(vaga.createdAt),
//           descricao: vaga.descricao || "Descrição não disponível",
//           tipoTrabalho: vaga.tipoTrabalho || "",
//           categoria: vaga.ong?.areaAtuacao?.[0] || "Geral",
//         }));


//         // carregarFotoPerfil(vagasFormatadas.imagemOng)
//         setVagas(vagasFormatadas);
//       } catch (error: any) {
//         console.error("Erro ao atualizar vagas:", error);
//         // Logout automático se token expirado
//         if (error.response?.status === 401) {
//           logout();
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     useEffect(() => {
//       atualizarVagas();
//       listarVagasOng(token!);

//     }, [token]);

 

//     return (
//       <VagaContext.Provider value={{ vagas, atualizarVagas, loading, carregarFotoPerfil, imagem, vagasOng, listarVagasOng}}>
//         {children}
//       </VagaContext.Provider>
//     );
//   };

//   export const useVagas = () => {
//     const context = useContext(VagaContext);
//     if (!context) throw new Error("useVagas deve ser usado dentro de VagaProvider");
//     return context;
//   };


//////////////////////////////////////////////////

// src/data/context/VagaContext.tsx
import { formatarData } from "@/components/shared/DataFormatada";
import { Vaga } from "@/screens/tabs/voluntario/Home";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useAPI from "../hooks/useAPI";
import { AuthContext } from "./AuthContext";

interface VagaContextType {
  vagas: Vaga[];
  atualizarVagas: () => Promise<void>;
  loading: boolean;
  imagem: any;
  carregarFotoPerfil: (imagem: any) => void;
}

export const VagaContext = createContext<VagaContextType | undefined>(undefined);

export const VagaProvider = ({ children }: { children: ReactNode }) => {
  const { logout, token, tipoUsuario } = useContext(AuthContext);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagem, setImagem] = useState();
  const { listarVagas } = useAPI();

  // Verifica se é voluntário
  const isVoluntario = tipoUsuario === "VOLUNTARIO";

  function carregarFotoPerfil(imagem: any) {
    setImagem(imagem);
  }

  const atualizarVagas = async () => {
    if (!token || !isVoluntario) return;
    
    setLoading(true);
    try {
      const dados = await listarVagas(token);
     
      if (!Array.isArray(dados)) {
        setVagas([]);
        return;
      }
      
      const vagasFormatadas = dados.map((vaga: any) => ({
        id: vaga.id,
        titulo: vaga.titulo,
        nomeOng: vaga.ong?.nome || "ONG",
        imagemOng: vaga.ong?.imagem || "",
        areaAtuacao: vaga.ong?.areaAtuacao ?? [],
        localizacao: vaga.localizacao || "Local não informado",
        latitude: Number(vaga.latitude),
        longitude: Number(vaga.longitude),
        data: formatarData(vaga.createdAt),
        descricao: vaga.descricao || "Descrição não disponível",
        tipoTrabalho: vaga.tipoTrabalho || "",
        categoria: vaga.ong?.areaAtuacao?.[0] || "Geral",
      }));

      setVagas(vagasFormatadas);
    } catch (error: any) {
      console.error("Erro ao atualizar vagas:", error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isVoluntario) {
      atualizarVagas();
    }
  }, [token, isVoluntario]);

  return (
    <VagaContext.Provider value={{ 
      vagas, 
      atualizarVagas, 
      loading, 
      carregarFotoPerfil, 
      imagem 
    }}>
      {children}
    </VagaContext.Provider>
  );
};

export const useVagas = () => {
  const context = useContext(VagaContext);
  if (!context) throw new Error("useVagas deve ser usado dentro de VagaProvider");
  return context;
};