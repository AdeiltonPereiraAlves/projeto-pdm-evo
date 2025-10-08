import CandidatoCard from "@/components/candidaturas/CandidatoCard";
import Icone from "@/components/shared/Icone";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
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
    const navigation = useNavigation();
    const { token } = useContext(AuthContext);
    const { httpGet, httpPut } = useAPI();

    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [vagaSelecionada, setVagaSelecionada] = useState<string | null>(null);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [filtroStatus, setFiltroStatus] = useState<"todas" | StatusInscricao>("todas");
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

    const candidatosFiltrados = candidatos.filter(candidato => {
        if (filtroStatus === "todas") return true;
        return candidato.status === filtroStatus;
    });

    const contadores = {
        todas: candidatos.length,
        pendente: candidatos.filter(c => c.status === "pendente").length,
        aprovado: candidatos.filter(c => c.status === "aprovado").length,
        rejeitado: candidatos.filter(c => c.status === "rejeitado").length,
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#295CA9" />
                <Text style={styles.loadingText}>Carregando candidatos...</Text>
            </View>
        );
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

            {/* Filtros por Status */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersScroll}
                contentContainerStyle={styles.filtersContainer}
            >
                <Pressable
                    style={[
                        styles.filterButton,
                        filtroStatus === "todas" && styles.filterButtonActive,
                    ]}
                    onPress={() => setFiltroStatus("todas")}
                >
                    <Text
                        style={[
                            styles.filterText,
                            filtroStatus === "todas" && styles.filterTextActive,
                        ]}
                    >
                        Todos ({contadores.todas})
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.filterButton,
                        filtroStatus === "pendente" && styles.filterButtonActive,
                    ]}
                    onPress={() => setFiltroStatus("pendente")}
                >
                    <Icone nome="time" tamanho={16} color={filtroStatus === "pendente" ? "#fff" : "#F59E0B"} />
                    <Text
                        style={[
                            styles.filterText,
                            filtroStatus === "pendente" && styles.filterTextActive,
                        ]}
                    >
                        Pendente ({contadores.pendente})
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.filterButton,
                        filtroStatus === "aprovado" && styles.filterButtonActive,
                    ]}
                    onPress={() => setFiltroStatus("aprovado")}
                >
                    <Icone nome="checkmark-circle" tamanho={16} color={filtroStatus === "aprovado" ? "#fff" : "#22C55E"} />
                    <Text
                        style={[
                            styles.filterText,
                            filtroStatus === "aprovado" && styles.filterTextActive,
                        ]}
                    >
                        Aprovados ({contadores.aprovado})
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.filterButton,
                        filtroStatus === "rejeitado" && styles.filterButtonActive,
                    ]}
                    onPress={() => setFiltroStatus("rejeitado")}
                >
                    <Icone nome="close-circle" tamanho={16} color={filtroStatus === "rejeitado" ? "#fff" : "#DC2626"} />
                    <Text
                        style={[
                            styles.filterText,
                            filtroStatus === "rejeitado" && styles.filterTextActive,
                        ]}
                    >
                        Rejeitados ({contadores.rejeitado})
                    </Text>
                </Pressable>
            </ScrollView>

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
                                : `Não há candidatos com status "${filtroStatus}" para esta vaga`}
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
                                onVerPerfil={() => {
                                    Alert.alert(
                                        "Perfil",
                                        `Ver perfil de ${candidato.voluntario.nome}`,
                                    );
                                }}
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
        paddingTop: screenHeight * 0.06,
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
    filtersScroll: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    filtersContainer: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: 12,
        gap: 8,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    filterButtonActive: {
        backgroundColor: "#295CA9",
        borderColor: "#295CA9",
    },
    filterText: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#6B7280",
    },
    filterTextActive: {
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

