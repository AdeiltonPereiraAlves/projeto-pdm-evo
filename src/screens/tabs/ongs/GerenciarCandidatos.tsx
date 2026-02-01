import CandidatoCard from "@/components/candidaturas/CandidatoCard";
import Icone from "@/components/shared/Icone";
import Loading from "@/components/loading/Loading";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type StatusInscricao = "pendente" | "aprovado" | "rejeitado";

interface Candidato {
    id: string;
    voluntarioId: string;
    vagaId: string;
    status: StatusInscricao;
    data: string;
    voluntario: {
        id: string;
        nome: string;
        imagem?: string;
        habilidades: string[];
        contato: string;
    };
    vaga: {
        id: string;
        titulo: string;
    };
}

interface Vaga {
    id: string;
    titulo: string;
}

export default function GerenciarCandidatos() {
    const navigation = useNavigation<any>();
    const { token } = useContext(AuthContext);
    const { httpGet, httpPut } = useAPI();

    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [vagaSelecionada, setVagaSelecionada] = useState<string | null>(null);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        carregarVagas();
    }, []);

    useEffect(() => {
        if (vagaSelecionada) {
            carregarCandidatos(vagaSelecionada);
        }
    }, [vagaSelecionada]);

    const carregarVagas = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const data = await httpGet("listar/vagas/ong", token);
            setVagas(data || []);
            
            // Seleciona a primeira vaga automaticamente
            if (data && data.length > 0) {
                setVagaSelecionada(data[0].id);
            }
        } catch (error) {
            console.error("Erro ao carregar vagas:", error);
            Alert.alert("Erro", "Não foi possível carregar as vagas");
        } finally {
            setLoading(false);
        }
    };

    const carregarCandidatos = async (vagaId: string) => {
        if (!token) return;

        try {
            // NOTA: O backend ainda não tem endpoint específico para listar inscrições por vaga
            // TODO: Implementar endpoint GET /inscricoes/vaga/:id no backend
            // Por enquanto, retornaremos array vazio até que o backend implemente esta rota
            console.log("Carregando candidatos para vaga:", vagaId);
            console.warn("Endpoint de listar inscrições por vaga ainda não implementado no backend");
            setCandidatos([]);
        } catch (error) {
            console.error("Erro ao carregar candidatos:", error);
            setCandidatos([]);
        }
    };

    const handleAprovar = async (inscricaoId: string, candidatoNome: string) => {
        Alert.alert(
            "Aprovar Candidato",
            `Deseja aprovar ${candidatoNome} para esta vaga?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Aprovar",
                    onPress: async () => {
                        try {
                            const response = await httpPut(
                                `atualizar/inscricao/${inscricaoId}`,
                                { status: "aprovado" },
                                token || ""
                            );

                            if (response.ok) {
                                Alert.alert("Sucesso", "Candidato aprovado!");
                                if (vagaSelecionada) {
                                    carregarCandidatos(vagaSelecionada);
                                }
                            } else {
                                Alert.alert("Erro", "Não foi possível aprovar o candidato");
                            }
                        } catch (error) {
                            console.error("Erro ao aprovar:", error);
                            Alert.alert("Erro", "Erro ao aprovar candidato");
                        }
                    },
                },
            ]
        );
    };

    const handleRejeitar = async (inscricaoId: string, candidatoNome: string) => {
        Alert.alert(
            "Rejeitar Candidato",
            `Deseja rejeitar ${candidatoNome}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Rejeitar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await httpPut(
                                `atualizar/inscricao/${inscricaoId}`,
                                { status: "rejeitado" },
                                token || ""
                            );

                            if (response.ok) {
                                Alert.alert("Candidato rejeitado");
                                if (vagaSelecionada) {
                                    carregarCandidatos(vagaSelecionada);
                                }
                            } else {
                                Alert.alert("Erro", "Não foi possível rejeitar o candidato");
                            }
                        } catch (error) {
                            console.error("Erro ao rejeitar:", error);
                            Alert.alert("Erro", "Erro ao rejeitar candidato");
                        }
                    },
                },
            ]
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await carregarVagas();
        if (vagaSelecionada) {
            await carregarCandidatos(vagaSelecionada);
        }
        setRefreshing(false);
    };

    const candidatosFiltrados = candidatos;

    if (loading) {
        return <Loading message="Carregando candidatos..." />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Gerenciar Candidatos</Text>
            </View>

            {/* Seletor de Vaga */}
            {vagas.length > 0 && (
                <View style={styles.vagaSelectorContainer}>
                    <Text style={styles.selectorLabel}>Vaga:</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.vagasScroll}
                    >
                        {vagas.map(vaga => (
                            <Pressable
                                key={vaga.id}
                                style={[
                                    styles.vagaChip,
                                    vagaSelecionada === vaga.id && styles.vagaChipActive,
                                ]}
                                onPress={() => setVagaSelecionada(vaga.id)}
                            >
                                <Text
                                    style={[
                                        styles.vagaChipText,
                                        vagaSelecionada === vaga.id && styles.vagaChipTextActive,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {vaga.titulo}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Lista de Candidatos */}
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {candidatosFiltrados.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icone nome="people-outline" tamanho={64} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>
                            {vagas.length === 0
                                ? "Nenhuma vaga criada"
                                : "Nenhum candidato"}
                        </Text>
                        <Text style={styles.emptyText}>
                            {vagas.length === 0
                                ? "Crie uma vaga para receber candidaturas"
                                : "Esta vaga ainda não possui candidaturas"}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {candidatosFiltrados.map((candidato) => (
                            <CandidatoCard
                                key={candidato.id}
                                nome={candidato.voluntario.nome}
                                foto={candidato.voluntario.imagem}
                                habilidades={candidato.voluntario.habilidades || []}
                                contato={candidato.voluntario.contato}
                                status={candidato.status}
                                onVerPerfil={() => navigation.navigate("DetalheVoluntario", { voluntarioId: candidato.voluntario.id })}
                                onAprovar={
                                    candidato.status === "pendente"
                                        ? () => handleAprovar(candidato.id, candidato.voluntario.nome)
                                        : undefined
                                }
                                onRejeitar={
                                    candidato.status === "pendente"
                                        ? () => handleRejeitar(candidato.id, candidato.voluntario.nome)
                                        : undefined
                                }
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
    loadingText: {
        marginTop: 12,
        fontSize: screenWidth < 350 ? 14 : 16,
        color: "#6B7280",
    },
    header: {
        paddingHorizontal: screenWidth * 0.05,
        paddingTop: 56,
        paddingBottom: screenWidth < 350 ? 16 : 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    headerTitle: {
        fontSize: screenWidth < 350 ? 20 : 24,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    vagaSelectorContainer: {
        backgroundColor: "#fff",
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    selectorLabel: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 8,
    },
    vagasScroll: {
        flexGrow: 0,
    },
    vagaChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginRight: 8,
        maxWidth: 200,
    },
    vagaChipActive: {
        backgroundColor: "#295CA9",
        borderColor: "#295CA9",
    },
    vagaChipText: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#6B7280",
    },
    vagaChipTextActive: {
        color: "#fff",
    },
    scrollView: {
        flex: 1,
    },
    listContainer: {
        paddingVertical: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: screenWidth * 0.1,
    },
    emptyTitle: {
        fontSize: screenWidth < 350 ? 18 : 20,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    emptyText: {
        fontSize: screenWidth < 350 ? 14 : 16,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 22,
    },
});

