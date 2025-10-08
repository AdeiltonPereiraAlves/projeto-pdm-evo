import AvaliacaoCard from "@/components/avaliacoes/AvaliacaoCard";
import Icone from "@/components/shared/Icone";
import { AuthContext } from "@/data/context/AuthContext";
import { useAvaliacoes } from "@/data/context/AvaliacaoContext";
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

type TipoAba = "feitas" | "recebidas";

export default function MinhasAvaliacoes() {
    const { token } = useContext(AuthContext);
    const {
        avaliacoesFeitas,
        avaliacoesRecebidas,
        loading,
        carregarAvaliacoesFeitas,
        carregarAvaliacoesRecebidas,
        excluirAvaliacao,
    } = useAvaliacoes();

    const [abaAtiva, setAbaAtiva] = useState<TipoAba>("recebidas");
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (token) {
            carregarAvaliacoesFeitas();
            carregarAvaliacoesRecebidas();
        }
    }, [token]);

    const handleExcluir = (avaliacaoId: string, ongNome: string) => {
        Alert.alert(
            "Excluir Avaliação",
            `Deseja excluir sua avaliação para ${ongNome}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        const sucesso = await excluirAvaliacao(avaliacaoId);
                        if (sucesso) {
                            Alert.alert("Sucesso", "Avaliação excluída");
                        } else {
                            Alert.alert("Erro", "Não foi possível excluir");
                        }
                    },
                },
            ]
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await carregarAvaliacoesFeitas();
        await carregarAvaliacoesRecebidas();
        setRefreshing(false);
    };

    const avaliacoesExibidas = abaAtiva === "feitas" ? avaliacoesFeitas : avaliacoesRecebidas;

    const calcularMediaNotas = () => {
        if (avaliacoesRecebidas.length === 0) return 0;
        const soma = avaliacoesRecebidas.reduce((acc, av) => acc + av.nota, 0);
        return (soma / avaliacoesRecebidas.length).toFixed(1);
    };

    if (loading && avaliacoesExibidas.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#295CA9" />
                <Text style={styles.loadingText}>Carregando avaliações...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Avaliações</Text>
            </View>

            {/* Abas */}
            <View style={styles.tabsContainer}>
                <Pressable
                    style={[
                        styles.tab,
                        abaAtiva === "recebidas" && styles.tabActive,
                    ]}
                    onPress={() => setAbaAtiva("recebidas")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            abaAtiva === "recebidas" && styles.tabTextActive,
                        ]}
                    >
                        Recebidas ({avaliacoesRecebidas.length})
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.tab,
                        abaAtiva === "feitas" && styles.tabActive,
                    ]}
                    onPress={() => setAbaAtiva("feitas")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            abaAtiva === "feitas" && styles.tabTextActive,
                        ]}
                    >
                        Feitas ({avaliacoesFeitas.length})
                    </Text>
                </Pressable>
            </View>

            {/* Média (apenas para recebidas) */}
            {abaAtiva === "recebidas" && avaliacoesRecebidas.length > 0 && (
                <View style={styles.mediaContainer}>
                    <View style={styles.mediaCard}>
                        <Text style={styles.mediaNumero}>{calcularMediaNotas()}</Text>
                        <View style={styles.estrelasMedia}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Icone
                                    key={star}
                                    nome={star <= parseFloat(calcularMediaNotas()) ? "star" : "star-outline"}
                                    tamanho={20}
                                    color="#FBBF24"
                                />
                            ))}
                        </View>
                        <Text style={styles.mediaTexto}>
                            Média de {avaliacoesRecebidas.length} avaliações
                        </Text>
                    </View>
                </View>
            )}

            {/* Lista de Avaliações */}
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {avaliacoesExibidas.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icone nome="star-outline" tamanho={64} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>
                            {abaAtiva === "feitas"
                                ? "Nenhuma avaliação feita"
                                : "Nenhuma avaliação recebida"}
                        </Text>
                        <Text style={styles.emptyText}>
                            {abaAtiva === "feitas"
                                ? "Avalie ONGs após participar de suas vagas"
                                : "Ainda não recebeu avaliações"}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {avaliacoesExibidas.map((avaliacao) => (
                            <AvaliacaoCard
                                key={avaliacao.id}
                                nome={
                                    abaAtiva === "feitas"
                                        ? avaliacao.ong?.nome || "ONG"
                                        : avaliacao.voluntario?.nome || "Voluntário"
                                }
                                foto={
                                    abaAtiva === "feitas"
                                        ? avaliacao.ong?.imagem
                                        : avaliacao.voluntario?.imagem
                                }
                                nota={avaliacao.nota}
                                comentario={avaliacao.comentario}
                                data={avaliacao.createdAt}
                                tipo={abaAtiva}
                                onDelete={
                                    abaAtiva === "feitas"
                                        ? () => handleExcluir(avaliacao.id, avaliacao.ong?.nome || "ONG")
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
    tabsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: "center",
        borderBottomWidth: 3,
        borderBottomColor: "transparent",
    },
    tabActive: {
        borderBottomColor: "#295CA9",
    },
    tabText: {
        fontSize: screenWidth < 350 ? 14 : 16,
        fontWeight: "600",
        color: "#6B7280",
    },
    tabTextActive: {
        color: "#295CA9",
    },
    mediaContainer: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    mediaCard: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "#FFFBEB",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FDE68A",
    },
    mediaNumero: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    estrelasMedia: {
        flexDirection: "row",
        gap: 4,
        marginVertical: 8,
    },
    mediaTexto: {
        fontSize: screenWidth < 350 ? 13 : 14,
        color: "#6B7280",
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

