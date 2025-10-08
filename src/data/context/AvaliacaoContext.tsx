import useAPI from "@/data/hooks/useAPI";
import React, { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

export interface Avaliacao {
    id: string;
    voluntarioId: string;
    ongId: string;
    tipo: "VOLUNTARIO" | "ONG";
    comentario: string;
    nota: number;
    createdAt: string;
    voluntario?: {
        id: string;
        nome: string;
        imagem?: string;
    };
    ong?: {
        id: string;
        nome: string;
        imagem?: string;
    };
}

export interface AvaliacaoContextType {
    avaliacoesFeitas: Avaliacao[];
    avaliacoesRecebidas: Avaliacao[];
    loading: boolean;
    criarAvaliacao: (ongId: string, nota: number, comentario: string) => Promise<boolean>;
    atualizarAvaliacao: (avaliacaoId: string, nota: number, comentario: string) => Promise<boolean>;
    excluirAvaliacao: (avaliacaoId: string) => Promise<boolean>;
    carregarAvaliacoesFeitas: () => Promise<void>;
    carregarAvaliacoesRecebidas: () => Promise<void>;
}

export const AvaliacaoContext = createContext<AvaliacaoContextType>({} as AvaliacaoContextType);

export const AvaliacaoProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, tipoUsuario } = useContext(AuthContext);
    const { httpPost, httpGet, httpPut, httpDelete } = useAPI();
    
    const [avaliacoesFeitas, setAvaliacoesFeitas] = useState<Avaliacao[]>([]);
    const [avaliacoesRecebidas, setAvaliacoesRecebidas] = useState<Avaliacao[]>([]);
    const [loading, setLoading] = useState(false);

    const carregarAvaliacoesFeitas = async () => {
        if (!token) return;
        
        try {
            setLoading(true);
            // Rotas corretas do backend conforme verificado em CHECKLIST_DESENVOLVIMENTO.md
            const endpoint = tipoUsuario === "VOLUNTARIO" 
                ? "listar/avaliacoes/feitas"  // Corrigido para rota real do backend
                : "listar/avaliacoes/feitas";
            
            const data = await httpGet(endpoint, token);
            setAvaliacoesFeitas(data || []);
        } catch (error) {
            console.error("Erro ao carregar avaliações feitas:", error);
            setAvaliacoesFeitas([]);
        } finally {
            setLoading(false);
        }
    };

    const carregarAvaliacoesRecebidas = async () => {
        if (!token) return;
        
        try {
            setLoading(true);
            // Rotas corretas do backend conforme verificado em CHECKLIST_DESENVOLVIMENTO.md
            const endpoint = tipoUsuario === "VOLUNTARIO" 
                ? "listar/avaliacoes/recebidas"  // Corrigido para rota real do backend
                : "avaliacoes/recebidas";
            
            const data = await httpGet(endpoint, token);
            setAvaliacoesRecebidas(data || []);
        } catch (error) {
            console.error("Erro ao carregar avaliações recebidas:", error);
            setAvaliacoesRecebidas([]);
        } finally {
            setLoading(false);
        }
    };

    const criarAvaliacao = async (ongId: string, nota: number, comentario: string): Promise<boolean> => {
        if (!token) return false;

        try {
            const response = await httpPost(
                "registrar/avaliacao/voluntario",
                {
                    ongId,
                    nota,
                    comentario,
                    tipo: tipoUsuario,
                },
                token
            );

            if (response.ok) {
                await carregarAvaliacoesFeitas();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao criar avaliação:", error);
            return false;
        }
    };

    const atualizarAvaliacao = async (avaliacaoId: string, nota: number, comentario: string): Promise<boolean> => {
        if (!token) return false;

        try {
            const response = await httpPut(
                `atualizar/avaliacao/${avaliacaoId}`,
                { nota, comentario },
                token
            );

            if (response.ok) {
                await carregarAvaliacoesFeitas();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao atualizar avaliação:", error);
            return false;
        }
    };

    const excluirAvaliacao = async (avaliacaoId: string): Promise<boolean> => {
        if (!token) return false;

        try {
            const response = await httpDelete(`excluir/avaliacao/${avaliacaoId}`, token);

            if (response.ok) {
                await carregarAvaliacoesFeitas();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao excluir avaliação:", error);
            return false;
        }
    };

    return (
        <AvaliacaoContext.Provider
            value={{
                avaliacoesFeitas,
                avaliacoesRecebidas,
                loading,
                criarAvaliacao,
                atualizarAvaliacao,
                excluirAvaliacao,
                carregarAvaliacoesFeitas,
                carregarAvaliacoesRecebidas,
            }}
        >
            {children}
        </AvaliacaoContext.Provider>
    );
};

export const useAvaliacoes = () => useContext(AvaliacaoContext);

