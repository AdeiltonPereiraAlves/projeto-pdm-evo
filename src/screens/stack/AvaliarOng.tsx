import Icone from "@/components/shared/Icone";
import Botao from "@/components/ui/Botao";
import { AuthContext } from "@/data/context/AuthContext";
import { useAvaliacoes } from "@/data/context/AvaliacaoContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
    Alert,
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AvaliarOng() {
    const navigation = useNavigation();
    const route = useRoute();
    const { ongId, ongNome } = route.params as { ongId: string; ongNome: string };
    
    const { token } = useContext(AuthContext);
    const { criarAvaliacao } = useAvaliacoes();

    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState("");
    const [salvando, setSalvando] = useState(false);

    const handleAvaliar = async () => {
        if (nota === 0) {
            Alert.alert("Erro", "Por favor, selecione uma nota de 1 a 5 estrelas");
            return;
        }

        if (comentario.trim().length < 10) {
            Alert.alert("Erro", "O comentário deve ter pelo menos 10 caracteres");
            return;
        }

        try {
            setSalvando(true);
            const sucesso = await criarAvaliacao(ongId, nota, comentario);

            if (sucesso) {
                Alert.alert(
                    "Sucesso",
                    "Avaliação enviada com sucesso!",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            } else {
                Alert.alert("Erro", "Não foi possível enviar a avaliação");
            }
        } catch (error) {
            console.error("Erro ao avaliar:", error);
            Alert.alert("Erro", "Erro ao enviar avaliação");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icone nome="arrow-back" tamanho={24} color="#1A1A1A" />
                </Pressable>
                <Text style={styles.headerTitle}>Avaliar ONG</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    {/* Nome da ONG */}
                    <View style={styles.ongContainer}>
                        <Icone nome="business" tamanho={48} color="#295CA9" />
                        <Text style={styles.ongNome}>{ongNome}</Text>
                    </View>

                    {/* Seletor de Estrelas */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Como foi sua experiência?</Text>
                        <View style={styles.estrelasContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable
                                    key={star}
                                    onPress={() => setNota(star)}
                                    style={styles.estrelaButton}
                                >
                                    <Icone
                                        nome={star <= nota ? "star" : "star-outline"}
                                        tamanho={40}
                                        color={star <= nota ? "#FBBF24" : "#D1D5DB"}
                                    />
                                </Pressable>
                            ))}
                        </View>
                        {nota > 0 && (
                            <Text style={styles.notaTexto}>
                                {nota === 1 && "Muito ruim"}
                                {nota === 2 && "Ruim"}
                                {nota === 3 && "Regular"}
                                {nota === 4 && "Bom"}
                                {nota === 5 && "Excelente"}
                            </Text>
                        )}
                    </View>

                    {/* Comentário */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Conte mais sobre sua experiência</Text>
                        <TextInput
                            style={styles.comentarioInput}
                            value={comentario}
                            onChangeText={setComentario}
                            placeholder="Compartilhe detalhes sobre sua experiência com esta ONG..."
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="sentences"
                            keyboardType="default"
                            autoCorrect={true}
                        />
                        <Text style={styles.caracteresContador}>
                            {comentario.length} caracteres (mínimo 10)
                        </Text>
                    </View>

                    {/* Botão Enviar */}
                    <View style={styles.buttonContainer}>
                        <Botao
                            title={salvando ? "Enviando..." : "Enviar Avaliação"}
                            color="#295CA9"
                            textColor="#fff"
                            onPress={handleAvaliar}
                            disabled={salvando || nota === 0}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
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
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: screenWidth < 350 ? 18 : 20,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: 20,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
    },
    ongContainer: {
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    ongNome: {
        fontSize: screenWidth < 350 ? 18 : 20,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginTop: 12,
        textAlign: "center",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: screenWidth < 350 ? 16 : 18,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 16,
    },
    estrelasContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        marginBottom: 12,
    },
    estrelaButton: {
        padding: 4,
    },
    notaTexto: {
        fontSize: screenWidth < 350 ? 15 : 16,
        fontWeight: "600",
        color: "#295CA9",
        textAlign: "center",
        marginTop: 8,
    },
    comentarioInput: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: screenWidth < 350 ? 12 : 16,
        fontSize: screenWidth < 350 ? 14 : 16,
        color: "#1A1A1A",
        height: 150,
        textAlignVertical: "top",
    },
    caracteresContador: {
        fontSize: screenWidth < 350 ? 11 : 12,
        color: "#9CA3AF",
        textAlign: "right",
        marginTop: 8,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

