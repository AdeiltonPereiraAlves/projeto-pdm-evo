import CandidaturaCard from "@/components/candidaturas/CandidaturaCard";
import Icone from "@/components/shared/Icone";
import { AuthContext } from "@/data/context/AuthContext";
import { Inscricao, useInscricoes } from "@/data/context/InscricaoContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
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

type StackParamList = {
    DetalheVaga: { vagaId: string };
};

type MinhasCandidaturasNavigationProp = NativeStackNavigationProp<StackParamList>;

type FiltroStatus = "todas" | "pendente" | "aprovado" | "rejeitado";

export default function MinhasCandidaturas() {
    const navigation = useNavigation<MinhasCandidaturasNavigationProp>();
    const { token } = useContext(AuthContext);
    const { inscricoes, loading, atualizarInscricoes, cancelarInscricao } = useInscricoes();

    const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todas");
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (token) {
            atualizarInscricoes();
        }
    }, [token]);

    const handleCancelar = (inscricao: Inscricao) => {
        Alert.alert(
            "Cancelar Candidatura",
            `Tem certeza que deseja cancelar a candidatura para "${inscricao.vaga?.titulo}"?`,
            [
                { text: "Não", style: "cancel" },
                {
                    text: "Sim, Cancelar",
                    style: "destructive",
                    onPress: async () => {
                        const sucesso = await cancelarInscricao(inscricao.id);
                        if (sucesso) {
                            Alert.alert("Sucesso", "Candidatura cancelada com sucesso");
                        } else {
                            Alert.alert("Erro", "Não foi possível cancelar a candidatura");
                        }
                    },
                },
            ]
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await atualizarInscricoes();
        setRefreshing(false);
    };

    const inscricoesFiltradas = inscricoes.filter(inscricao => {
        if (filtroStatus === "todas") return true;
        return inscricao.status === filtroStatus;
    });

    const contadores = {
        todas: inscricoes.length,
        pendente: inscricoes.filter(i => i.status === "pendente").length,
        aprovado: inscricoes.filter(i => i.status === "aprovado").length,
        rejeitado: inscricoes.filter(i => i.status === "rejeitado").length,
    };

    if (loading && inscricoes.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#295CA9" />
                <Text style={styles.loadingText}>Carregando candidaturas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Minhas Candidaturas</Text>
            </View>

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
                        Todas ({contadores.todas})
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
                        Aprovadas ({contadores.aprovado})
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
                        Rejeitadas ({contadores.rejeitado})
                    </Text>
                </Pressable>
            </ScrollView>

            {/* Lista de Candidaturas */}
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {inscricoesFiltradas.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icone nome="document-text-outline" tamanho={64} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>
                            {filtroStatus === "todas"
                                ? "Nenhuma candidatura"
                                : `Nenhuma candidatura ${filtroStatus}`}
                        </Text>
                        <Text style={styles.emptyText}>
                            {filtroStatus === "todas"
                                ? "Explore vagas disponíveis e candidate-se!"
                                : `Você não tem candidaturas com status "${filtroStatus}"`}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {inscricoesFiltradas.map((inscricao) => (
                            <CandidaturaCard
                                key={inscricao.id}
                                titulo={inscricao.vaga?.titulo || "Vaga"}
                                nomeOng={inscricao.vaga?.ong?.nome || "ONG"}
                                imagemOng={inscricao.vaga?.ong?.imagem}
                                localizacao={inscricao.vaga?.localizacao || "Não informado"}
                                dataCandidatura={inscricao.data}
                                status={inscricao.status}
                                onPress={() => {
                                    if (inscricao.vagaId) {
                                        navigation.navigate("DetalheVaga", { vagaId: inscricao.vagaId });
                                    }
                                }}
                                onCancelar={
                                    inscricao.status === "pendente"
                                        ? () => handleCancelar(inscricao)
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

