import useAPI from "@/data/hooks/useAPI";
import React, { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

export type StatusInscricao = "pendente" | "aprovado" | "rejeitado";

export interface Inscricao {
    id: string;
    vagaId: string;
    voluntarioId: string;
    status: StatusInscricao;
    ativo: boolean;
    data: string;
    vaga?: {
        id: string;
        titulo: string;
        descricao: string;
        localizacao: string;
        ong: {
            nome: string;
            imagem?: string;
        };
    };
}

export interface InscricaoContextType {
    inscricoes: Inscricao[];
    loading: boolean;
    inscrever: (vagaId: string) => Promise<boolean>;
    cancelarInscricao: (inscricaoId: string) => Promise<boolean>;
    verificarInscricao: (vagaId: string) => Promise<{ ativo: boolean }>;
    atualizarInscricoes: () => Promise<void>;
    atualizarStatusInscricao: (inscricaoId: string, ativo: boolean) => Promise<boolean>;
}

export const InscricaoContext = createContext<InscricaoContextType>({} as InscricaoContextType);

export const InscricaoProvider = ({ children }: { children: React.ReactNode }) => {
    const { token } = useContext(AuthContext);
    const { httpPost, httpGet, httpPut, httpDelete, buscarStatusInscricao } = useAPI();
    
    const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
    const [loading, setLoading] = useState(false);

    const atualizarInscricoes = async () => {
        if (!token) return;
        
        try {
            setLoading(true);
            const data = await httpGet("listar/inscricoes", token);
            setInscricoes(data || []);
        } catch (error) {
            console.error("Erro ao atualizar inscrições:", error);
            setInscricoes([]);
        } finally {
            setLoading(false);
        }
    };

    const inscrever = async (vagaId: string): Promise<boolean> => {
        if (!token) return false;

        try {
            const response = await httpPost(
                `inscricao/${vagaId}`,
                { ativo: true },
                token
            );

            if (response.ok) {
                await atualizarInscricoes();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao se inscrever:", error);
            return false;
        }
    };

    const cancelarInscricao = async (inscricaoId: string): Promise<boolean> => {
        if (!token) return false;

        try {
            const response = await httpDelete(`inscricao/${inscricaoId}`, token);

            if (response.ok) {
                await atualizarInscricoes();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao cancelar inscrição:", error);
            return false;
        }
    };

    const atualizarStatusInscricao = async (inscricaoId: string, ativo: boolean): Promise<boolean> => {
        if (!token) return false;

        try {
            const response = await httpPut(
                `atualizar/inscricao/${inscricaoId}`,
                { ativo },
                token
            );

            if (response.ok) {
                await atualizarInscricoes();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            return false;
        }
    };

    const verificarInscricao = async (vagaId: string): Promise<{ ativo: boolean }> => {
        if (!token) return { ativo: false };

        try {
            const response = await buscarStatusInscricao(`inscricao/status/${vagaId}`, token);
            
            if (response.ok) {
                const data = await response.json();
                return data;
            }
            return { ativo: false };
        } catch (error) {
            console.error("Erro ao verificar inscrição:", error);
            return { ativo: false };
        }
    };

    return (
        <InscricaoContext.Provider
            value={{
                inscricoes,
                loading,
                inscrever,
                cancelarInscricao,
                verificarInscricao,
                atualizarInscricoes,
                atualizarStatusInscricao,
            }}
        >
            {children}
        </InscricaoContext.Provider>
    );
};

export const useInscricoes = () => useContext(InscricaoContext);

