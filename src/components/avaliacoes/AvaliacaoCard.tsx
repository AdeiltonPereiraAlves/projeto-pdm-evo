import Avatar from "@/components/shared/Avatar";
import FormatarData from "@/components/shared/FormatarData";
import Icone from "@/components/shared/Icone";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export interface AvaliacaoCardProps {
    nome: string;
    foto?: string;
    nota: number;
    comentario: string;
    data: string;
    tipo: "feita" | "recebida";
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function AvaliacaoCard({
    nome,
    foto,
    nota,
    comentario,
    data,
    tipo,
    onEdit,
    onDelete,
}: AvaliacaoCardProps) {
    
    const renderEstrelas = () => {
        return (
            <View style={styles.estrelasContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Icone
                        key={star}
                        nome={star <= nota ? "star" : "star-outline"}
                        tamanho={18}
                        color={star <= nota ? "#FBBF24" : "#D1D5DB"}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.profileInfo}>
                    <Avatar
                        uri={foto}
                        size={50}
                        iconName={tipo === "recebida" ? "person" : "business"}
                    />
                    <View style={styles.infoTexts}>
                        <Text style={styles.nome} numberOfLines={1}>
                            {nome}
                        </Text>
                        <View style={styles.dataContainer}>
                            <Icone nome="calendar-outline" tamanho={14} color="#6B7280" />
                            <Text style={styles.data}>
                                <FormatarData data={data} />
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Ações (apenas para avaliações feitas) */}
                {tipo === "feita" && (onEdit || onDelete) && (
                    <View style={styles.actionsContainer}>
                        {onEdit && (
                            <Pressable style={styles.actionButton} onPress={onEdit}>
                                <Icone nome="create-outline" tamanho={20} color="#295CA9" />
                            </Pressable>
                        )}
                        {onDelete && (
                            <Pressable style={styles.actionButton} onPress={onDelete}>
                                <Icone nome="trash-outline" tamanho={20} color="#DC2626" />
                            </Pressable>
                        )}
                    </View>
                )}
            </View>

            {/* Estrelas */}
            {renderEstrelas()}

            {/* Comentário */}
            {comentario && (
                <Text style={styles.comentario} numberOfLines={3}>
                    {comentario}
                </Text>
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
    dataContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    data: {
        fontSize: screenWidth < 350 ? 11 : 12,
        color: "#6B7280",
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
        backgroundColor: "#F3F4F6",
    },
    estrelasContainer: {
        flexDirection: "row",
        gap: 4,
        marginBottom: 12,
    },
    comentario: {
        fontSize: screenWidth < 350 ? 14 : 15,
        color: "#374151",
        lineHeight: 22,
    },
});

