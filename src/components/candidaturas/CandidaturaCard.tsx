import FormatarData from "@/components/shared/FormatarData";
import Icone from "@/components/shared/Icone";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export type StatusInscricao = "pendente" | "aprovado" | "rejeitado";

export interface CandidaturaCardProps {
    titulo: string;
    nomeOng: string;
    imagemOng?: string;
    localizacao: string;
    dataCandidatura: string;
    status: StatusInscricao;
    onPress?: () => void;
    onCancelar?: () => void;
}

export default function CandidaturaCard({
    titulo,
    nomeOng,
    imagemOng,
    localizacao,
    dataCandidatura,
    status,
    onPress,
    onCancelar,
}: CandidaturaCardProps) {
    
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
        <Pressable 
            style={styles.card}
            onPress={onPress}
        >
            {/* Header com ONG */}
            <View style={styles.header}>
                <View style={styles.ongInfo}>
                    {imagemOng ? (
                        <Image 
                            source={{ uri: imagemOng }} 
                            style={styles.ongImage}
                        />
                    ) : (
                        <View style={styles.ongImagePlaceholder}>
                            <Icone nome="business" tamanho={20} color="#295CA9" />
                        </View>
                    )}
                    <View style={styles.ongTexts}>
                        <Text style={styles.ongNome} numberOfLines={1}>
                            {nomeOng}
                        </Text>
                        <View style={styles.locationContainer}>
                            <Icone nome="location-outline" tamanho={14} color="#6B7280" />
                            <Text style={styles.localizacao} numberOfLines={1}>
                                {localizacao}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Badge de Status */}
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
                    <Icone nome={statusInfo.icon} tamanho={16} color={statusInfo.color} />
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>
                        {statusInfo.text}
                    </Text>
                </View>
            </View>

            {/* Título da Vaga */}
            <Text style={styles.titulo} numberOfLines={2}>
                {titulo}
            </Text>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.dataContainer}>
                    <Icone nome="calendar-outline" tamanho={16} color="#6B7280" />
                    <Text style={styles.data}>
                        Candidatura: <FormatarData data={dataCandidatura} />
                    </Text>
                </View>

                {status === "pendente" && onCancelar && (
                    <Pressable 
                        style={styles.cancelButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onCancelar();
                        }}
                    >
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </Pressable>
                )}
            </View>
        </Pressable>
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
    ongInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    ongImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    ongImagePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    ongTexts: {
        flex: 1,
        gap: 2,
    },
    ongNome: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#1A1A1A",
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    localizacao: {
        fontSize: screenWidth < 350 ? 11 : 12,
        color: "#6B7280",
        flex: 1,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: screenWidth < 350 ? 11 : 12,
        fontWeight: "600",
    },
    titulo: {
        fontSize: screenWidth < 350 ? 15 : 16,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 12,
        lineHeight: 22,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    dataContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flex: 1,
    },
    data: {
        fontSize: screenWidth < 350 ? 11 : 12,
        color: "#6B7280",
    },
    cancelButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: "#FEE2E2",
        borderWidth: 1,
        borderColor: "#DC2626",
    },
    cancelText: {
        fontSize: screenWidth < 350 ? 11 : 12,
        fontWeight: "600",
        color: "#DC2626",
    },
});

