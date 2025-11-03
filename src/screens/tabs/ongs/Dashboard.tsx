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

interface VagaData {
    id: string;
    titulo: string;
    status: string;
    quantidade: number;
    inscricoes?: Array<{
        id: string;
        status: string;
        ativo: boolean;
    }>;
}

interface Estatisticas {
    totalVagas: number;
    vagasAbertas: number;
    vagasFechadas: number;
    candidatosPendentes: number;
    candidatosAprovados: number;
    totalCandidaturas: number;
}

export default function Dashboard() {
    const { token, logout } = useContext(AuthContext);
    const { httpGet } = useAPI();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [vagas, setVagas] = useState<VagaData[]>([]);
    const [stats, setStats] = useState<Estatisticas>({
        totalVagas: 0,
        vagasAbertas: 0,
        vagasFechadas: 0,
        candidatosPendentes: 0,
        candidatosAprovados: 0,
        totalCandidaturas: 0,
    });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const vagasData = await httpGet("listar/vagas/ong", token || "");
            
            console.log("Dashboard - vagasData recebida:", vagasData);
            console.log("Dashboard - tipo de vagasData:", typeof vagasData);
            console.log("Dashboard - é array?", Array.isArray(vagasData));
            
            // Garantir que sempre temos um array
            const vagasArray = Array.isArray(vagasData) ? vagasData : [];
            
            setVagas(vagasArray);
            calcularEstatisticas(vagasArray);
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados do dashboard");
            setVagas([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await carregarDados();
        setRefreshing(false);
    };

    const calcularEstatisticas = (vagasData: VagaData[]) => {
        // Garantir que vagasData é um array
        if (!Array.isArray(vagasData)) {
            console.warn("calcularEstatisticas recebeu dados inválidos:", vagasData);
            setStats({
                totalVagas: 0,
                vagasAbertas: 0,
                vagasFechadas: 0,
                candidatosPendentes: 0,
                candidatosAprovados: 0,
                totalCandidaturas: 0,
            });
            return;
        }

        const estatisticas: Estatisticas = {
            totalVagas: vagasData.length,
            vagasAbertas: vagasData.filter((v) => v.status === "ABERTO").length,
            vagasFechadas: vagasData.filter((v) => v.status === "FECHADO").length,
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

        setStats(estatisticas);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#295CA9" />
                <Text style={styles.loadingText}>Carregando dashboard...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                    <Text style={styles.headerSubtitle}>Visão geral da sua ONG</Text>
                </View>
                <Pressable onPress={() => navigation.navigate("ConfiguracoesOng" as never)}>
                    <Icone nome="settings-outline" tamanho={24} color="#295CA9" />
                </Pressable>
                <Pressable onPress={() => logout()}>
                    <Icone nome="log-out" tamanho={24} color="#295CA9" />
                </Pressable>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#295CA9"]} />
                }
            >
                {/* Cards de Estatísticas */}
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, styles.statCardPrimary]}>
                            <View style={styles.statIconContainer}>
                                <Icone nome="briefcase" tamanho={24} color="#295CA9" />
                            </View>
                            <Text style={styles.statNumber}>{stats.totalVagas}</Text>
                            <Text style={styles.statLabel}>Total de Vagas</Text>
                        </View>

                        <View style={[styles.statCard, styles.statCardSuccess]}>
                            <View style={styles.statIconContainer}>
                                <Icone nome="checkmark-circle" tamanho={24} color="#22c55e" />
                            </View>
                            <Text style={styles.statNumber}>{stats.vagasAbertas}</Text>
                            <Text style={styles.statLabel}>Vagas Abertas</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, styles.statCardWarning]}>
                            <View style={styles.statIconContainer}>
                                <Icone nome="people" tamanho={24} color="#f59e0b" />
                            </View>
                            <Text style={styles.statNumber}>{stats.totalCandidaturas}</Text>
                            <Text style={styles.statLabel}>Candidaturas</Text>
                        </View>

                        <View style={[styles.statCard, styles.statCardInfo]}>
                            <View style={styles.statIconContainer}>
                                <Icone nome="time" tamanho={24} color="#3b82f6" />
                            </View>
                            <Text style={styles.statNumber}>{stats.candidatosPendentes}</Text>
                            <Text style={styles.statLabel}>Pendentes</Text>
                        </View>
                    </View>
                </View>

                {/* Ações Rápidas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                    <View style={styles.actionsContainer}>
                        <Pressable
                            style={styles.actionCard}
                            onPress={() => navigation.navigate("CriarVaga" as never)}
                        >
                            <View style={[styles.actionIconCircle, { backgroundColor: "#EEF2FF" }]}>
                                <Icone nome="add-circle" tamanho={32} color="#295CA9" />
                            </View>
                            <Text style={styles.actionTitle}>Criar Vaga</Text>
                            <Text style={styles.actionDescription}>
                                Adicionar nova oportunidade
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.actionCard}
                            onPress={() => navigation.navigate("GerenciarCandidatos" as never)}
                        >
                            <View style={[styles.actionIconCircle, { backgroundColor: "#FEF3C7" }]}>
                                <Icone nome="people" tamanho={32} color="#f59e0b" />
                            </View>
                            <Text style={styles.actionTitle}>Candidatos</Text>
                            <Text style={styles.actionDescription}>
                                Gerenciar inscrições
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.actionCard}
                            onPress={() => navigation.navigate("AvaliacoesOng" as never)}
                        >
                            <View style={[styles.actionIconCircle, { backgroundColor: "#DCFCE7" }]}>
                                <Icone nome="star" tamanho={32} color="#22c55e" />
                            </View>
                            <Text style={styles.actionTitle}>Avaliações</Text>
                            <Text style={styles.actionDescription}>
                                Ver feedback recebido
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Vagas Recentes */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Vagas Recentes</Text>
                        <Pressable onPress={() => console.log("Ver todas")}>
                            <Text style={styles.seeAllText}>Ver todas</Text>
                        </Pressable>
                    </View>

                    {vagas.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Icone nome="briefcase-outline" tamanho={48} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>Nenhuma vaga criada</Text>
                            <Text style={styles.emptyDescription}>
                                Comece criando sua primeira vaga de voluntariado
                            </Text>
                            <Pressable
                                style={styles.emptyButton}
                                onPress={() => navigation.navigate("CriarVaga" as never)}
                            >
                                <Icone nome="add" tamanho={20} color="#fff" />
                                <Text style={styles.emptyButtonText}>Criar Vaga</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.vagasContainer}>
                            {Array.isArray(vagas) && vagas.slice(0, 5).map((vaga) => (
                                <Pressable
                                    key={vaga.id}
                                    style={styles.vagaCard}
                                    onPress={() => console.log("Vaga:", vaga.id)}
                                >
                                    <View style={styles.vagaHeader}>
                                        <View style={styles.vagaInfo}>
                                            <Text style={styles.vagaTitulo} numberOfLines={1}>
                                                {vaga.titulo}
                                            </Text>
                                            <View style={styles.vagaMetaContainer}>
                                                <Icone nome="people-outline" tamanho={14} color="#6B7280" />
                                                <Text style={styles.vagaMeta}>
                                                    {vaga.quantidade} vagas
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={[
                                                styles.statusBadge,
                                                vaga.status === "ABERTO"
                                                    ? styles.statusAberto
                                                    : styles.statusFechado,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.statusText,
                                                    vaga.status === "ABERTO"
                                                        ? styles.statusTextAberto
                                                        : styles.statusTextFechado,
                                                ]}
                                            >
                                                {vaga.status === "ABERTO" ? "Aberta" : "Fechada"}
                                            </Text>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                <View style={{ height: 40 }} />
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: screenWidth * 0.05,
        paddingTop: screenHeight * 0.06,
        paddingBottom: screenWidth < 350 ? 16 : 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    headerTitle: {
        fontSize: screenWidth < 350 ? 22 : 26,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    headerSubtitle: {
        fontSize: screenWidth < 350 ? 13 : 14,
        color: "#6B7280",
        marginTop: 2,
    },
    scrollView: {
        flex: 1,
    },
    statsContainer: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenWidth < 350 ? 16 : 20,
        gap: 12,
    },
    statsRow: {
        flexDirection: "row",
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: screenWidth < 350 ? 14 : 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    statCardPrimary: {
        borderColor: "#93C5FD",
        backgroundColor: "#EFF6FF",
    },
    statCardSuccess: {
        borderColor: "#86EFAC",
        backgroundColor: "#F0FDF4",
    },
    statCardWarning: {
        borderColor: "#FCD34D",
        backgroundColor: "#FFFBEB",
    },
    statCardInfo: {
        borderColor: "#93C5FD",
        backgroundColor: "#EFF6FF",
    },
    statIconContainer: {
        marginBottom: 8,
    },
    statNumber: {
        fontSize: screenWidth < 350 ? 24 : 28,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: screenWidth < 350 ? 12 : 13,
        color: "#6B7280",
        textAlign: "center",
    },
    section: {
        paddingHorizontal: screenWidth * 0.05,
        marginBottom: screenWidth < 350 ? 20 : 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: screenWidth < 350 ? 16 : 18,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    seeAllText: {
        fontSize: screenWidth < 350 ? 13 : 14,
        color: "#295CA9",
        fontWeight: "600",
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 12,
    },
    actionCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: screenWidth < 350 ? 14 : 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    actionIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: screenWidth < 350 ? 14 : 15,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 4,
        textAlign: "center",
    },
    actionDescription: {
        fontSize: screenWidth < 350 ? 11 : 12,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 16,
    },
    vagasContainer: {
        gap: 12,
    },
    vagaCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: screenWidth < 350 ? 14 : 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    vagaHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    vagaInfo: {
        flex: 1,
        marginRight: 12,
    },
    vagaTitulo: {
        fontSize: screenWidth < 350 ? 15 : 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 6,
    },
    vagaMetaContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    vagaMeta: {
        fontSize: screenWidth < 350 ? 12 : 13,
        color: "#6B7280",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusAberto: {
        backgroundColor: "#D1FAE5",
    },
    statusFechado: {
        backgroundColor: "#FEE2E2",
    },
    statusText: {
        fontSize: screenWidth < 350 ? 11 : 12,
        fontWeight: "600",
    },
    statusTextAberto: {
        color: "#059669",
    },
    statusTextFechado: {
        color: "#DC2626",
    },
    emptyCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: screenWidth < 350 ? 28 : 32,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    emptyTitle: {
        fontSize: screenWidth < 350 ? 17 : 18,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: screenWidth < 350 ? 13 : 14,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20,
    },
    emptyButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#295CA9",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: "#fff",
        fontSize: screenWidth < 350 ? 14 : 15,
        fontWeight: "600",
    },
});
