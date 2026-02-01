import Loading from "@/components/loading/Loading";
import Icone from "@/components/shared/Icone";
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
    View
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
    candidatosRejeitados: number;
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
        candidatosRejeitados: 0,
        totalCandidaturas: 0,
    });
    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const response = await httpGet("listar/vagas/ong", token || "");
            const vagasArray = Array.isArray(response?.vagas) ? response.vagas : [];
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
        if (!Array.isArray(vagasData)) {
            setStats({
                totalVagas: 0,
                vagasAbertas: 0,
                vagasFechadas: 0,
                candidatosPendentes: 0,
                candidatosAprovados: 0,
                candidatosRejeitados: 0,
                totalCandidaturas: 0,
            });
            return;
        }

        const aberto = (v: VagaData) => v.status === "ABERTO" || (v.status as string) === "aberto";
        const fechado = (v: VagaData) =>
            v.status === "ENCERRADO" || v.status === "FECHADO" || (v.status as string) === "fechado" || (v.status as string) === "encerrado";

        const estatisticas: Estatisticas = {
            totalVagas: vagasData.length,
            vagasAbertas: vagasData.filter(aberto).length,
            vagasFechadas: vagasData.filter(fechado).length,
            candidatosPendentes: 0,
            candidatosAprovados: 0,
            candidatosRejeitados: 0,
            totalCandidaturas: 0,
        };

        vagasData.forEach((vaga) => {
            if (vaga.inscricoes && Array.isArray(vaga.inscricoes)) {
                estatisticas.totalCandidaturas += vaga.inscricoes.length;
                estatisticas.candidatosPendentes += vaga.inscricoes.filter(
                    (i) => (i.status as string) === "pendente" && i.ativo
                ).length;
                estatisticas.candidatosAprovados += vaga.inscricoes.filter(
                    (i) => (i.status as string) === "aprovado"
                ).length;
                estatisticas.candidatosRejeitados += vaga.inscricoes.filter(
                    (i) => (i.status as string) === "rejeitado"
                ).length;
            }
        });

        setStats(estatisticas);
    };

    const maxInscritos = Math.max(
        1,
        ...vagas.map((v) => (v.inscricoes && Array.isArray(v.inscricoes) ? v.inscricoes.length : 0))
    );

    if (loading) {
        return (
            // <View style={styles.loadingContainer}>
            //     <ActivityIndicator size="large" color="#295CA9" />
            //     <Text style={styles.loadingText}>Carregando dashboard...</Text>
            // </View>
            <Loading message="Carregando dashboard..." />
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
                {/* <Pressable onPress={() => navigation.navigate("ConfiguracoesOng" as never)}>
                    <Icone nome="settings-outline" tamanho={24} color="#295CA9" />
                </Pressable>
                <Pressable onPress={() => logout()}>
                    <Icone nome="log-out" tamanho={24} color="#295CA9" />
                </Pressable> */}
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

                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, styles.statCardSuccess]}>
                            <View style={styles.statIconContainer}>
                                <Icone nome="checkmark-circle" tamanho={24} color="#22c55e" />
                            </View>
                            <Text style={styles.statNumber}>{stats.candidatosAprovados}</Text>
                            <Text style={styles.statLabel}>Aprovados</Text>
                        </View>

                        <View style={[styles.statCard, styles.statCardDanger]}>
                            <View style={styles.statIconContainer}>
                                <Icone nome="close-circle" tamanho={24} color="#ef4444" />
                            </View>
                            <Text style={styles.statNumber}>{stats.candidatosRejeitados}</Text>
                            <Text style={styles.statLabel}>Rejeitados</Text>
                        </View>
                    </View>
                </View>

                {/* Gráfico: Inscrições por vaga */}
                {vagas.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Inscrições por vaga</Text>
                        <View style={styles.chartCard}>
                            {vagas.slice(0, 8).map((vaga) => {
                                const count = (vaga.inscricoes && Array.isArray(vaga.inscricoes) ? vaga.inscricoes.length : 0);
                                const pct = maxInscritos > 0 ? (count / maxInscritos) * 100 : 0;
                                return (
                                    <View key={vaga.id} style={styles.chartRow}>
                                        <View style={styles.chartRowLabel}>
                                            <Text style={styles.chartRowTitle} numberOfLines={1}>
                                                {vaga.titulo || "Vaga"}
                                            </Text>
                                            <Text style={styles.chartRowValue}>{count}</Text>
                                        </View>
                                        <View style={styles.chartBarBg}>
                                            <View
                                                style={[
                                                    styles.chartBarFill,
                                                    { width: `${Math.max(pct, 4)}%` },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Gráfico: Status das candidaturas */}
                {stats.totalCandidaturas > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Status das candidaturas</Text>
                        <View style={styles.chartCard}>
                            <View style={styles.statusLegend}>
                                <View style={styles.statusLegendItem}>
                                    <View style={[styles.statusDot, { backgroundColor: "#3b82f6" }]} />
                                    <Text style={styles.statusLegendText}>
                                        Pendentes: {stats.candidatosPendentes}
                                    </Text>
                                </View>
                                <View style={styles.statusLegendItem}>
                                    <View style={[styles.statusDot, { backgroundColor: "#22c55e" }]} />
                                    <Text style={styles.statusLegendText}>
                                        Aprovados: {stats.candidatosAprovados}
                                    </Text>
                                </View>
                                <View style={styles.statusLegendItem}>
                                    <View style={[styles.statusDot, { backgroundColor: "#ef4444" }]} />
                                    <Text style={styles.statusLegendText}>
                                        Rejeitados: {stats.candidatosRejeitados}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.statusBarContainer}>
                                <View
                                    style={[
                                        styles.statusBarSegment,
                                        {
                                            flex: stats.candidatosPendentes || 0.001,
                                            backgroundColor: "#3b82f6",
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.statusBarSegment,
                                        {
                                            flex: stats.candidatosAprovados || 0.001,
                                            backgroundColor: "#22c55e",
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.statusBarSegment,
                                        {
                                            flex: stats.candidatosRejeitados || 0.001,
                                            backgroundColor: "#ef4444",
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                )}

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
                        <Pressable onPress={() => navigation.navigate("MinhasVagas" as never)}>
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
                                    onPress={() => navigation.navigate("DetalheVagaOng" as never, { vagaId: vaga.id })}
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
                                                (vaga.status === "ABERTO" || (vaga.status as string) === "aberto")
                                                    ? styles.statusAberto
                                                    : styles.statusFechado,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.statusText,
                                                    (vaga.status === "ABERTO" || (vaga.status as string) === "aberto")
                                                        ? styles.statusTextAberto
                                                        : styles.statusTextFechado,
                                                ]}
                                            >
                                                {(vaga.status === "ABERTO" || (vaga.status as string) === "aberto") ? "Aberta" : "Fechada"}
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
    statCardDanger: {
        borderColor: "#FCA5A5",
        backgroundColor: "#FEF2F2",
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
    chartCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: screenWidth < 350 ? 14 : 18,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    chartRow: {
        marginBottom: 12,
    },
    chartRowLabel: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    chartRowTitle: {
        fontSize: screenWidth < 350 ? 12 : 13,
        color: "#374151",
        flex: 1,
        marginRight: 8,
    },
    chartRowValue: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#295CA9",
        minWidth: 24,
        textAlign: "right",
    },
    chartBarBg: {
        height: 8,
        backgroundColor: "#E5E7EB",
        borderRadius: 4,
        overflow: "hidden",
    },
    chartBarFill: {
        height: "100%",
        backgroundColor: "#295CA9",
        borderRadius: 4,
        minWidth: 4,
    },
    statusLegend: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 12,
    },
    statusLegendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    statusLegendText: {
        fontSize: screenWidth < 350 ? 12 : 13,
        color: "#374151",
    },
    statusBarContainer: {
        flexDirection: "row",
        height: 24,
        borderRadius: 8,
        overflow: "hidden",
    },
    statusBarSegment: {
        minWidth: 2,
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
