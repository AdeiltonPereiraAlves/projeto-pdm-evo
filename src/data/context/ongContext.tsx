// // src/data/context/OngContext.tsx
// import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
// import useAPI from "../hooks/useAPI";
// import { AuthContext } from "./AuthContext";

// interface VagaOng {
//   id: string;
//   titulo: string;
//   descricao: string;
//   localizacao: string;
//   tipoTrabalho: string;
//   status: string;
//   quantidade: number;
//   latitude?: number;
//   longitude?: number;
//   createdAt: string;
//   imagem?: string;
//   inscricoes?: Array<{
//     id: string;
//     status: string;
//     ativo: boolean;
//   }>;
// }

// interface OngProfile {
//   id?: string;
//   nome: string;
//   email: string;
//   descricao: string;
//   visao: string;
//   missao: string;
//   areaAtuacao: string[] | string;
//   endereco: string;
//   imagem?: string;
//   cnpj?: string;
// }

// interface Estatisticas {
//   totalVagas: number;
//   vagasAbertas: number;
//   vagasFechadas: number;
//   candidatosPendentes: number;
//   candidatosAprovados: number;
//   totalCandidaturas: number;
// }

// interface OngContextType {
//   // Perfil da ONG
//   perfilOng: OngProfile | null;
//   imagemPerfil: string | null;
//   loadingPerfil: boolean;
  
//   // Vagas da ONG
//   vagasOng: VagaOng[];
//   loadingVagas: boolean;
  
//   // Estatísticas
//   estatisticas: Estatisticas;
  
//   // Métodos
//   carregarPerfilOng: () => Promise<void>;
//   carregarVagasOng: () => Promise<void>;
//   atualizarPerfil: (dados: Partial<OngProfile>) => Promise<void>;
//   criarVaga: (vagaData: Omit<VagaOng, 'id' | 'createdAt'>) => Promise<void>;
//   editarVaga: (id: string, vagaData: Partial<VagaOng>) => Promise<void>;
//   excluirVaga: (id: string) => Promise<void>;
//   atualizarFotoPerfil: (imagemUrl: string) => void;
//   calcularEstatisticas: (vagas: VagaOng[]) => Estatisticas;
// }

// export const OngContext = createContext<OngContextType | undefined>(undefined);

// export const OngProvider = ({ children }: { children: ReactNode }) => {
//   const { token, usuario, tipoUsuario, logout } = useContext(AuthContext);
//   const { httpGet, httpPost, httpPut, httpDelete } = useAPI();
  
//   const [perfilOng, setPerfilOng] = useState<OngProfile | null>(null);
//   const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
//   const [vagasOng, setVagasOng] = useState<any>([]);
//   const [loadingPerfil, setLoadingPerfil] = useState(false);
//   const [loadingVagas, setLoadingVagas] = useState(false);
//   const [estatisticas, setEstatisticas] = useState<Estatisticas>({
//     totalVagas: 0,
//     vagasAbertas: 0,
//     vagasFechadas: 0,
//     candidatosPendentes: 0,
//     candidatosAprovados: 0,
//     totalCandidaturas: 0,
//   });

//   // Verifica se o usuário atual é uma ONG
//   const isOng = tipoUsuario === "ONG";

//   // Função para calcular estatísticas
//   const calcularEstatisticas = useCallback((vagasData: VagaOng[]): Estatisticas => {
//     // Garantir que vagasData é um array
//     if (!Array.isArray(vagasData)) {
//       console.warn("calcularEstatisticas recebeu dados inválidos:", vagasData);
//       return {
//         totalVagas: 0,
//         vagasAbertas: 0,
//         vagasFechadas: 0,
//         candidatosPendentes: 0,
//         candidatosAprovados: 0,
//         totalCandidaturas: 0,
//       };
//     }

//     const estatisticas: Estatisticas = {
//       totalVagas: vagasData.length,
//       vagasAbertas: vagasData.filter((v) => v.status === "ABERTO" || v.status === "aberto").length,
//       vagasFechadas: vagasData.filter((v) => v.status === "FECHADO" || v.status === "fechado").length,
//       candidatosPendentes: 0,
//       candidatosAprovados: 0,
//       totalCandidaturas: 0,
//     };

//     // Calcular candidaturas (se disponível)
//     vagasData.forEach((vaga) => {
//       if (vaga.inscricoes && Array.isArray(vaga.inscricoes)) {
//         estatisticas.totalCandidaturas += vaga.inscricoes.length;
//         estatisticas.candidatosPendentes += vaga.inscricoes.filter(
//           (i) => i.status === "pendente" && i.ativo
//         ).length;
//         estatisticas.candidatosAprovados += vaga.inscricoes.filter(
//           (i) => i.status === "aprovado"
//         ).length;
//       }
//     });

//     return estatisticas;
//   }, []);

//   // Carrega o perfil da ONG
//   const carregarPerfilOng = async () => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingPerfil(true);
//       const response = await httpGet("ong/perfil", token);
      
//       if (response) {
//         // Verifica se a resposta é o perfil direto ou está dentro de uma propriedade
//         const perfil = response.ong || response;
//         setPerfilOng(perfil);
//         if (perfil.imagem) {
//           setImagemPerfil(perfil.imagem);
//         }
//       }
//     } catch (error: any) {
//       console.error("Erro ao carregar perfil da ONG:", error);
//       if (error.response?.status === 401) {
//         logout();
//       }
//     } finally {
//       setLoadingPerfil(false);
//     }
//   };

//   // Carrega as vagas criadas pela ONG
//   const carregarVagasOng = async () => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingVagas(true);
//       const response = await httpGet("listar/vagas/ong", token);
      
//       // Verifica diferentes formatos de resposta
//       let vagasArray: VagaOng[] = [];
      
//       if (Array.isArray(response)) {
//         vagasArray = response;
//       } else if (response && response.vagas && Array.isArray(response.vagas)) {
//         vagasArray = response.vagas;
//       } else if (response && typeof response === 'object') {
//         // Se for um objeto, tenta extrair as vagas
//         const values = Object.values(response);
//         if (Array.isArray(values[0])) {
//           vagasArray = values[0] as VagaOng[];
//         }
//       }
      
//       setVagasOng(vagasArray);
//       setEstatisticas(calcularEstatisticas(vagasArray));
      
//       return vagasArray;
//     } catch (error: any) {
//       console.error("Erro ao carregar vagas da ONG:", error);
//       if (error.response?.status === 401) {
//         logout();
//       }
//       return [];
//     } finally {
//       setLoadingVagas(false);
//     }
//   };

//   // Atualiza o perfil da ONG
//   const atualizarPerfil = async (dados: Partial<OngProfile>) => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingPerfil(true);
//       const response = await httpPut("ong/editar", dados, token);
      
//       if (response) {
//         const perfilAtualizado = response.ong || response;
//         setPerfilOng(prev => prev ? { ...prev, ...perfilAtualizado } : perfilAtualizado);
//         return response;
//       }
//     } catch (error: any) {
//       console.error("Erro ao atualizar perfil da ONG:", error);
//       throw error;
//     } finally {
//       setLoadingPerfil(false);
//     }
//   };

//   // Cria uma nova vaga
//   const criarVaga = async (vagaData: Omit<VagaOng, 'id' | 'createdAt'>) => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingVagas(true);
//       const response = await httpPost("vaga/criar", vagaData, token);
      
//       if (response) {
//         const novaVaga = response;
//         setVagasOng(prev => [novaVaga, ...prev]);
//         setEstatisticas(calcularEstatisticas([novaVaga, ...prev]));
//         return response;
//       }
//     } catch (error: any) {
//       console.error("Erro ao criar vaga:", error);
//       throw error;
//     } finally {
//       setLoadingVagas(false);
//     }
//   };

//   // Edita uma vaga existente
//   const editarVaga = async (id: string, vagaData: Partial<VagaOng>) => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingVagas(true);
//       const response = await httpPut(`vaga/editar/${id}`, vagaData, token);
      
//       if (response && response.vaga) {
//         const vagaAtualizada = response.vaga;
//         setVagasOng(prev => 
//           prev.map(vaga => vaga.id === id ? { ...vaga, ...vagaAtualizada } : vaga)
//         );
//         setEstatisticas(calcularEstatisticas(vagasOng));
//         return response;
//       }
//     } catch (error: any) {
//       console.error("Erro ao editar vaga:", error);
//       throw error;
//     } finally {
//       setLoadingVagas(false);
//     }
//   };

//   // Exclui uma vaga
//   const excluirVaga = async (id: string) => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingVagas(true);
//       await httpDelete(`vaga/excluir/${id}`, token);
      
//       const novasVagas = vagasOng.filter(vaga => vaga.id !== id);
//       setVagasOng(novasVagas);
//       setEstatisticas(calcularEstatisticas(novasVagas));
//     } catch (error: any) {
//       console.error("Erro ao excluir vaga:", error);
//       throw error;
//     } finally {
//       setLoadingVagas(false);
//     }
//   };

//   // Atualiza a foto de perfil
//   const atualizarFotoPerfil = (imagemUrl: string) => {
//     setImagemPerfil(imagemUrl);
//     if (perfilOng) {
//       setPerfilOng({ ...perfilOng, imagem: imagemUrl });
//     }
//   };

//   // Carrega dados iniciais
//   useEffect(() => {
//     if (token && isOng) {
//       carregarPerfilOng();
//       carregarVagasOng();
//     }
//   }, [token, isOng]);

//   return (
//     <OngContext.Provider value={{
//       perfilOng,
//       imagemPerfil,
//       loadingPerfil,
//       vagasOng,
//       loadingVagas,
//       estatisticas,
//       carregarPerfilOng,
//       carregarVagasOng,
//       atualizarPerfil,
//       criarVaga,
//       editarVaga,
//       excluirVaga,
//       atualizarFotoPerfil,
//       calcularEstatisticas,
//     }}>
//       {children}
//     </OngContext.Provider>
//   );
// };

// export const useOng = () => {
//   const context = useContext(OngContext);
//   if (!context) throw new Error("useOng deve ser usado dentro de OngProvider");
//   return context;
// };


//////////////////////////////////////////////////////////////////


// src/data/context/OngContext.tsx
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import useAPI from "../hooks/useAPI";
import { AuthContext } from "./AuthContext";

interface VagaOng {
  id: string;
  titulo: string;
  descricao: string;
  localizacao: string;
  tipoTrabalho: string;
  status: string;
  quantidade: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  imagem?: string;
  inscricoes?: Array<{
    id: string;
    status: string;
    ativo: boolean;
  }>;
}

interface OngProfile {
  id?: string;
  nome: string;
  email: string;
  descricao: string;
  visao: string;
  missao: string;
  areaAtuacao: string[] | string;
  endereco: string;
  imagem?: string;
  cnpj?: string;
}

interface Estatisticas {
  totalVagas: number;
  vagasAbertas: number;
  vagasFechadas: number;
  candidatosPendentes: number;
  candidatosAprovados: number;
  totalCandidaturas: number;
}

interface OngContextType {
  // Perfil da ONG
//   perfilOng: OngProfile | null;
//   imagemPerfil: string | null;
//   loadingPerfil: boolean;
  
  // Vagas da ONG
  vagasOng: VagaOng[];
  loadingVagas: boolean;
  
  // Estatísticas
  estatisticas: Estatisticas;
  
  // Métodos
//   carregarPerfilOng: () => Promise<void>;
  carregarVagasOng: () => Promise<any>;
//   atualizarPerfil: (dados: Partial<OngProfile>) => Promise<void>;
//   criarVaga: (vagaData: Omit<VagaOng, 'id' | 'createdAt'>) => Promise<void>;
//   editarVaga: (id: string, vagaData: Partial<VagaOng>) => Promise<void>;
//   excluirVaga: (id: string) => Promise<void>;
//   atualizarFotoPerfil: (imagemUrl: string) => void;
//   calcularEstatisticas: (vagas: VagaOng[]) => Estatisticas;
}

export const OngContext = createContext<OngContextType | undefined>(undefined);

export const OngProvider = ({ children }: { children: ReactNode }) => {
  const { token, usuario, tipoUsuario, logout } = useContext(AuthContext);
  const { httpGet, httpPost, httpPut, httpDelete } = useAPI();
  
  const [perfilOng, setPerfilOng] = useState<OngProfile | null>(null);
  const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
  const [vagasOng, setVagasOng] = useState<any>([]);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [loadingVagas, setLoadingVagas] = useState(false);
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    totalVagas: 0,
    vagasAbertas: 0,
    vagasFechadas: 0,
    candidatosPendentes: 0,
    candidatosAprovados: 0,
    totalCandidaturas: 0,
  });

  // Verifica se o usuário atual é uma ONG
  const isOng = tipoUsuario === "ONG";

  // Função para calcular estatísticas
  const calcularEstatisticas = useCallback((vagasData: VagaOng[]): Estatisticas => {
    // Garantir que vagasData é um array
    if (!Array.isArray(vagasData)) {
      console.warn("calcularEstatisticas recebeu dados inválidos:", vagasData);
      return {
        totalVagas: 0,
        vagasAbertas: 0,
        vagasFechadas: 0,
        candidatosPendentes: 0,
        candidatosAprovados: 0,
        totalCandidaturas: 0,
      };
    }

    const estatisticas: Estatisticas = {
      totalVagas: vagasData.length,
      vagasAbertas: vagasData.filter((v) => v.status === "ABERTO" || v.status === "aberto").length,
      vagasFechadas: vagasData.filter((v) => v.status === "FECHADO" || v.status === "fechado").length,
      candidatosPendentes: 0,
      candidatosAprovados: 0,
      totalCandidaturas: 0,
    };

    // Calcular candidaturas (se disponível)
    vagasData.forEach((vaga) => {
      if (vaga.inscricoes && Array.isArray(vaga.inscricoes)) {
        estatisticas.totalCandidaturas += vaga.inscricoes.length;
        estatisticas.candidatosPendentes += vaga.inscricoes.filter(
          (i) => i.status === "pendente" && i.ativo
        ).length;
        estatisticas.candidatosAprovados += vaga.inscricoes.filter(
          (i) => i.status === "aprovado"
        ).length;
      }
    });

    return estatisticas;
  }, []);

  // Carrega o perfil da ONG
//   const carregarPerfilOng = async () => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingPerfil(true);
//       const response = await httpGet("ong/perfil", token);
      
//       if (response) {
//         // Verifica se a resposta é o perfil direto ou está dentro de uma propriedade
//         const perfil = response.ong || response;
//         setPerfilOng(perfil);
//         if (perfil.imagem) {
//           setImagemPerfil(perfil.imagem);
//         }
//       }
//     } catch (error: any) {
//       console.error("Erro ao carregar perfil da ONG:", error);
//       if (error.response?.status === 401) {
//         logout();
//       }
//     } finally {
//       setLoadingPerfil(false);
//     }
//   };

  // Carrega as vagas criadas pela ONG
  const carregarVagasOng = async () => {
    if (!token || !isOng) return;
    
    try {
      setLoadingVagas(true);
      const response = await httpGet("listar/vagas/ong", token);
      
      // Verifica diferentes formatos de resposta
      let vagasArray: VagaOng[] = [];
      
      if (Array.isArray(response)) {
        vagasArray = response;
      } else if (response && response.vagas && Array.isArray(response.vagas)) {
        vagasArray = response.vagas;
      } else if (response && typeof response === 'object') {
        // Se for um objeto, tenta extrair as vagas
        const values = Object.values(response);
        if (Array.isArray(values[0])) {
          vagasArray = values[0] as VagaOng[];
        }
      }
      
      setVagasOng(vagasArray);
      setEstatisticas(calcularEstatisticas(vagasArray));
      
      return vagasArray;
    } catch (error: any) {
      console.error("Erro ao carregar vagas da ONG:", error);
      if (error.response?.status === 401) {
        logout();
      }
      return [];
    } finally {
      setLoadingVagas(false);
    }
  };

  // Atualiza o perfil da ONG
//   const atualizarPerfil = async (dados: Partial<OngProfile>) => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingPerfil(true);
//       const response = await httpPut("ong/editar", dados, token);
      
//       if (response) {
//         const perfilAtualizado = response.ong || response;
//         setPerfilOng(prev => prev ? { ...prev, ...perfilAtualizado } : perfilAtualizado);
//         return response;
//       }
//     } catch (error: any) {
//       console.error("Erro ao atualizar perfil da ONG:", error);
//       throw error;
//     } finally {
//       setLoadingPerfil(false);
//     }
//   };

  // Cria uma nova vaga
//   const criarVaga = async (vagaData: Omit<VagaOng, 'id' | 'createdAt'>) => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingVagas(true);
//       const response = await httpPost("vaga/criar", vagaData, token);
      
//       if (response) {
//         const novaVaga = response;
//         setVagasOng(prev => [novaVaga, ...prev]);
//         setEstatisticas(calcularEstatisticas([novaVaga, ...prev]));
//         return response;
//       }
//     } catch (error: any) {
//       console.error("Erro ao criar vaga:", error);
//       throw error;
//     } finally {
//       setLoadingVagas(false);
//     }
//   };

//   // Edita uma vaga existente
//   const editarVaga = async (id: string, vagaData: Partial<VagaOng>) => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingVagas(true);
//       const response = await httpPut(`vaga/editar/${id}`, vagaData, token);
      
//       if (response && response.vaga) {
//         const vagaAtualizada = response.vaga;
//         setVagasOng(prev => 
//           prev.map(vaga => vaga.id === id ? { ...vaga, ...vagaAtualizada } : vaga)
//         );
//         setEstatisticas(calcularEstatisticas(vagasOng));
//         return response;
//       }
//     } catch (error: any) {
//       console.error("Erro ao editar vaga:", error);
//       throw error;
//     } finally {
//       setLoadingVagas(false);
//     }
//   };

  // Exclui uma vaga
//   const excluirVaga = async (id: string) => {
//     if (!token || !isOng) return;
    
//     try {
//       setLoadingVagas(true);
//       await httpDelete(`vaga/excluir/${id}`, token);
      
//       const novasVagas = vagasOng.filter(vaga => vaga.id !== id);
//       setVagasOng(novasVagas);
//       setEstatisticas(calcularEstatisticas(novasVagas));
//     } catch (error: any) {
//       console.error("Erro ao excluir vaga:", error);
//       throw error;
//     } finally {
//       setLoadingVagas(false);
//     }
//   };

  // Atualiza a foto de perfil
//   const atualizarFotoPerfil = (imagemUrl: string) => {
//     setImagemPerfil(imagemUrl);
//     if (perfilOng) {
//       setPerfilOng({ ...perfilOng, imagem: imagemUrl });
//     }
//   };

  // Carrega dados iniciais
  useEffect(() => {
    if (token && isOng) {
    //   carregarPerfilOng();
      carregarVagasOng();
    }
  }, [token, isOng]);

  return (
    <OngContext.Provider value={{
    //   perfilOng,
    //   imagemPerfil,
    //   loadingPerfil,
      vagasOng,
      loadingVagas,
      estatisticas,
    //   carregarPerfilOng,
      carregarVagasOng,
    //   atualizarPerfil,
    //   criarVaga,
    //   editarVaga,
    //   excluirVaga,
    //   atualizarFotoPerfil,
    //   calcularEstatisticas,
    }}>
      {children}
    </OngContext.Provider>
  );
};

export const useOng = () => {
  const context = useContext(OngContext);
  if (!context) throw new Error("useOng deve ser usado dentro de OngProvider");
  return context;
};