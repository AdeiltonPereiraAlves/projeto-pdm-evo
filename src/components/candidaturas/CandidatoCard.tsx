import Avatar from "@/components/shared/Avatar";
import Icone from "@/components/shared/Icone";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export interface CandidatoCardProps {
    nome: string;
    foto?: string;
    habilidades: string[];
    contato: string;
    status: "pendente" | "aprovado" | "rejeitado";
    onVerPerfil: () => void;
    onAprovar?: () => void;
    onRejeitar?: () => void;
}

export default function CandidatoCard({
    nome,
    foto,
    habilidades,
    contato,
    status,
    onVerPerfil,
    onAprovar,
    onRejeitar,
}: CandidatoCardProps) {
    
    const getStatusInfo = () => {
        switch (status) {
            case "aprovado":
                return {
                    color: "#22C55E",
                    backgroundColor: "#DCFCE7",
                    icon: "checkmark-circle",
                    text: "Aprovado",
                };
            case "rejeitado":
                return {
                    color: "#DC2626",
                    backgroundColor: "#FEE2E2",
                    icon: "close-circle",
                    text: "Rejeitado",
                };
            default:
                return {
                    color: "#F59E0B",
                    backgroundColor: "#FEF3C7",
                    icon: "time",
                    text: "Pendente",
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <View style={styles.card}>
            {/* Header com Foto e Nome */}
            <View style={styles.header}>
                <Pressable style={styles.profileInfo} onPress={onVerPerfil}>
                    <Avatar
                        uri={foto}
                        size={60}
                        iconName="person"
                    />
                    <View style={styles.infoTexts}>
                        <Text style={styles.nome} numberOfLines={1}>
                            {nome}
                        </Text>
                        <View style={styles.contatoContainer}>
                            <Icone nome="call-outline" tamanho={14} color="#6B7280" />
                            <Text style={styles.contato} numberOfLines={1}>
                                {contato}
                            </Text>
                        </View>
                    </View>
                </Pressable>

                {/* Badge de Status */}
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
                    <Icone nome={statusInfo.icon} tamanho={14} color={statusInfo.color} />
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>
                        {statusInfo.text}
                    </Text>
                </View>
            </View>

            {/* Habilidades */}
            {habilidades && habilidades.length > 0 && (
                <View style={styles.habilidadesContainer}>
                    <Icone nome="star-outline" tamanho={16} color="#295CA9" />
                    <View style={styles.habilidadesList}>
                        {habilidades.slice(0, 3).map((habilidade, index) => (
                            <View key={index} style={styles.habilidadeTag}>
                                <Text style={styles.habilidadeText} numberOfLines={1}>
                                    {habilidade}
                                </Text>
                            </View>
                        ))}
                        {habilidades.length > 3 && (
                            <Text style={styles.maisHabilidades}>
                                +{habilidades.length - 3}
                            </Text>
                        )}
                    </View>
                </View>
            )}

            {/* Botões de Ação (apenas para status pendente) */}
            {status === "pendente" && (onAprovar || onRejeitar) && (
                <View style={styles.actionsContainer}>
                    {onRejeitar && (
                        <Pressable
                            style={styles.rejectButton}
                            onPress={onRejeitar}
                        >
                            <Icone nome="close" tamanho={18} color="#DC2626" />
                            <Text style={styles.rejectText}>Rejeitar</Text>
                        </Pressable>
                    )}
                    {onAprovar && (
                        <Pressable
                            style={styles.approveButton}
                            onPress={onAprovar}
                        >
                            <Icone nome="checkmark" tamanho={18} color="#fff" />
                            <Text style={styles.approveText}>Aprovar</Text>
                        </Pressable>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: screenWidth < 350 ? 14 : 16,
        marginHorizontal: screenWidth * 0.05,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
        gap: 8,
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    infoTexts: {
        flex: 1,
        gap: 4,
    },
    nome: {
        fontSize: screenWidth < 350 ? 15 : 16,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    contatoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    contato: {
        fontSize: screenWidth < 350 ? 12 : 13,
        color: "#6B7280",
        flex: 1,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: screenWidth < 350 ? 10 : 11,
        fontWeight: "600",
    },
    habilidadesContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    habilidadesList: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        flex: 1,
    },
    habilidadeTag: {
        backgroundColor: "#EFF6FF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#DBEAFE",
    },
    habilidadeText: {
        fontSize: screenWidth < 350 ? 11 : 12,
        color: "#295CA9",
        fontWeight: "500",
    },
    maisHabilidades: {
        fontSize: screenWidth < 350 ? 11 : 12,
        color: "#6B7280",
        fontWeight: "500",
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    rejectButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#FEE2E2",
        borderWidth: 1,
        borderColor: "#DC2626",
    },
    rejectText: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#DC2626",
    },
    approveButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#22C55E",
        borderWidth: 1,
        borderColor: "#22C55E",
    },
    approveText: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#fff",
    },
});

