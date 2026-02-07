import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '@/data/context/AuthContext';
import useAPI from '@/data/hooks/useAPI';
import Icone from '../shared/Icone';

export interface VagaCardProps {
    titulo: string;
    nomeOng: string;
    imagemOng: string;
    areaAtuacao: string[];
    localizacao: string;
    data: string;
    descricao: string;
    tag?: string;
    vagaId: string;
    onPress?: () => void;
}

export default function VagaCard({
    titulo,
    nomeOng,
    imagemOng,
    areaAtuacao,
    localizacao,
    data,
    descricao,
    tag,
    vagaId,
    onPress
}: VagaCardProps) {
    const { token } = useContext(AuthContext);
    const { httpPost, buscarStatusInscricao } = useAPI();
    const [ativo, setAtivo] = useState<boolean | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    // Buscar status da inscrição ao montar o card
    useEffect(() => {
        if (!token || !vagaId) return;
        let mounted = true;

        const buscarStatus = async () => {
            try {
                const res = await buscarStatusInscricao(`inscricao/status/${vagaId}`, token);
                if (!res.ok) {
                    if (mounted) setAtivo(false);
                    return;
                }
                const data = await res.json();
                if (mounted) setAtivo(Boolean(data.ativo));
            } catch (err) {
                console.log("Erro buscar status card:", err);
                if (mounted) setAtivo(false);
            }
        };

        buscarStatus();
        return () => { mounted = false; };
    }, [vagaId, token]);

    // Toggle inscrição (mesmo padrão do VagaDetalhe)
    const handleInscricao = async () => {
        if (!token || loading) return;
        setLoading(true);

        const previous = ativo;
        const novo = !previous;
        setAtivo(novo);

        try {
            const res = await httpPost(`inscricao/${vagaId}`, { ativo: novo }, token);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status}: ${text}`);
            }
            const data = await res.json();
            setAtivo(Boolean(data.ativo));
        } catch (err) {
            console.log("Erro ao togglear inscrição card:", err);
            setAtivo(previous);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                    <Image
                        source={{ uri:imagemOng }}
                        style={{ width: 100, height: 100, borderRadius: 60 , backgroundColor:"#f5f5f5", marginRight:8}}
                    />
                <View style={styles.tituloContainer}>
                    <Text style={styles.titulo}>{titulo}</Text>
                    <Text style={styles.ong}>{nomeOng}</Text>
                   
                </View>
                {/* <View style={styles.favoritoContainer}>
                    <Icone nome="heart-outline" tamanho={20} color="#666" />
                </View> */}
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Icone nome="location-outline" tamanho={16} color="#666" />
                    <Text style={styles.infoText} numberOfLines={1}>{localizacao}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Icone nome="calendar-outline" tamanho={16} color="#666" />
                    <Text style={styles.infoText} numberOfLines={1}>{data}</Text>
                </View>
            </View>

            {/* <Text style={styles.descricao} numberOfLines={2}>
                {descricao}
            </Text> */}

            <View style={styles.footer}>
                <View style={styles.tagsContainer}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.botaoCandidatar, ativo ? { backgroundColor: '#008EFF' } : undefined]}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleInscricao();
                    }}
                    disabled={loading || ativo === undefined}
                >
                    <Text style={styles.botaoText}>
                        {ativo === undefined ? "..." : ativo ? "Inscrito" : "Candidatar-se"}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    tituloContainer: {
        flex: 1,
        marginRight: 8,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    ong: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    favoritoContainer: {
        padding: 4,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-evenly',
        flex: 1,
        minWidth: 0,
        maxWidth: '35%',
        
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
        flex: 1,
        flexShrink: 1,
    },
    descricao: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
    },
    tag: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        color: '#1976d2',
        fontWeight: '500',
    },
    botaoCandidatar: {
        backgroundColor: '#295CA9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    botaoText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
