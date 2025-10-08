import Icone from "@/components/shared/Icone";
import Botao from "@/components/ui/Botao";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const TIPOS_TRABALHO = ["PRESENCIAL", "REMOTO", "HIBRIDO"];
const STATUS_OPCOES = ["ABERTO", "FECHADO"];

export default function CriarVaga() {
    const { token } = useContext(AuthContext);
    const { httpPost } = useAPI();
    const navigation = useNavigation();

    const [salvando, setSalvando] = useState(false);
    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        requisitos: "",
        quantidade: "",
        duracao: "",
        localizacao: "",
        tipoTrabalho: "PRESENCIAL",
        status: "ABERTO",
        latitude: "",
        longitude: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validarFormulario = (): boolean => {
        if (!formData.titulo.trim()) {
            Alert.alert("Erro", "O título da vaga é obrigatório");
            return false;
        }

        if (!formData.descricao.trim()) {
            Alert.alert("Erro", "A descrição da vaga é obrigatória");
            return false;
        }

        if (!formData.requisitos.trim()) {
            Alert.alert("Erro", "Os requisitos da vaga são obrigatórios");
            return false;
        }

        const quantidade = parseInt(formData.quantidade);
        if (!formData.quantidade || isNaN(quantidade) || quantidade <= 0) {
            Alert.alert("Erro", "A quantidade de vagas deve ser um número maior que zero");
            return false;
        }

        if (!formData.duracao.trim()) {
            Alert.alert("Erro", "A duração da vaga é obrigatória");
            return false;
        }

        if (!formData.localizacao.trim()) {
            Alert.alert("Erro", "A localização da vaga é obrigatória");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validarFormulario()) return;

        try {
            setSalvando(true);

            // Processar requisitos (separar por vírgula ou linha)
            const requisitosArray = formData.requisitos
                .split(/[,\n]/)
                .map((r) => r.trim())
                .filter((r) => r.length > 0);

            // Preparar dados para enviar
            const vagaData = {
                titulo: formData.titulo.trim(),
                descricao: formData.descricao.trim(),
                requisitos: requisitosArray,
                quantidade: parseInt(formData.quantidade),
                duracao: formData.duracao.trim(),
                localizacao: formData.localizacao.trim(),
                tipoTrabalho: formData.tipoTrabalho,
                status: formData.status,
                latitude: formData.latitude ? parseFloat(formData.latitude) : -23.55052,
                longitude: formData.longitude ? parseFloat(formData.longitude) : -46.633308,
            };

            console.log("Enviando vaga:", vagaData);

            const response = await httpPost("cadastrar/vaga", vagaData, token || "");

            if (response.ok) {
                Alert.alert(
                    "Sucesso!",
                    "Vaga criada com sucesso!",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // Limpar formulário
                                setFormData({
                                    titulo: "",
                                    descricao: "",
                                    requisitos: "",
                                    quantidade: "",
                                    duracao: "",
                                    localizacao: "",
                                    tipoTrabalho: "PRESENCIAL",
                                    status: "ABERTO",
                                    latitude: "",
                                    longitude: "",
                                });
                                // Voltar ou navegar para dashboard
                                navigation.navigate("Dashboard" as never);
                            },
                        },
                    ]
                );
            } else {
                const errorData = await response.json();
                Alert.alert("Erro", errorData.messagem || "Não foi possível criar a vaga");
            }
        } catch (error) {
            console.error("Erro ao criar vaga:", error);
            Alert.alert("Erro", "Ocorreu um erro ao criar a vaga. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icone nome="arrow-back" tamanho={24} color="#1A1A1A" />
                </Pressable>
                <Text style={styles.headerTitle}>Nova Vaga</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formContainer}>
                    {/* Informações Básicas */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Informações Básicas</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Título da Vaga <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={formData.titulo}
                                onChangeText={(value) => handleChange("titulo", value)}
                                placeholder="Ex: Voluntário para Apoio Educacional"
                                placeholderTextColor="#939EAA"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Descrição <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.descricao}
                                onChangeText={(value) => handleChange("descricao", value)}
                                placeholder="Descreva as atividades e responsabilidades..."
                                placeholderTextColor="#939EAA"
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Requisitos <Text style={styles.required}>*</Text>
                            </Text>
                            <Text style={styles.hint}>
                                Separe cada requisito por vírgula ou linha
                            </Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.requisitos}
                                onChangeText={(value) => handleChange("requisitos", value)}
                                placeholder="Ex: Proatividade, Boa comunicação, Disponibilidade"
                                placeholderTextColor="#939EAA"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
                                    Quantidade <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.quantidade}
                                    onChangeText={(value) => handleChange("quantidade", value)}
                                    placeholder="0"
                                    placeholderTextColor="#939EAA"
                                    keyboardType="number-pad"
                                />
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>
                                    Duração <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.duracao}
                                    onChangeText={(value) => handleChange("duracao", value)}
                                    placeholder="Ex: 3 meses"
                                    placeholderTextColor="#939EAA"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Localização */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Localização</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Endereço/Local <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={formData.localizacao}
                                onChangeText={(value) => handleChange("localizacao", value)}
                                placeholder="Ex: Rua Exemplo, 123 - Bairro, Cidade"
                                placeholderTextColor="#939EAA"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>Latitude (opcional)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.latitude}
                                    onChangeText={(value) => handleChange("latitude", value)}
                                    placeholder="-23.55052"
                                    placeholderTextColor="#939EAA"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>Longitude (opcional)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.longitude}
                                    onChangeText={(value) => handleChange("longitude", value)}
                                    placeholder="-46.633308"
                                    placeholderTextColor="#939EAA"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Tipo de Trabalho */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tipo de Trabalho</Text>
                        <View style={styles.optionsContainer}>
                            {TIPOS_TRABALHO.map((tipo) => (
                                <Pressable
                                    key={tipo}
                                    style={[
                                        styles.optionButton,
                                        formData.tipoTrabalho === tipo && styles.optionButtonActive,
                                    ]}
                                    onPress={() => handleChange("tipoTrabalho", tipo)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            formData.tipoTrabalho === tipo && styles.optionTextActive,
                                        ]}
                                    >
                                        {tipo}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Status */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Status da Vaga</Text>
                        <View style={styles.optionsContainer}>
                            {STATUS_OPCOES.map((status) => (
                                <Pressable
                                    key={status}
                                    style={[
                                        styles.optionButton,
                                        formData.status === status && styles.optionButtonActive,
                                    ]}
                                    onPress={() => handleChange("status", status)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            formData.status === status && styles.optionTextActive,
                                        ]}
                                    >
                                        {status}
                                    </Text>
            </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Botão de Criar */}
                    <View style={styles.buttonContainer}>
                        <Botao
                            title={salvando ? "Criando Vaga..." : "Criar Vaga"}
                            color="#295CA9"
                            textColor="#fff"
                            onPress={handleSubmit}
                            disabled={salvando}
                        />
                    </View>
        </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
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
    formContainer: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenWidth < 350 ? 16 : 20,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
    },
    section: {
        marginBottom: screenWidth < 350 ? 20 : 24,
    },
    sectionTitle: {
        fontSize: screenWidth < 350 ? 16 : 18,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: screenWidth < 350 ? 14 : 16,
    },
    label: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    required: {
        color: "#DC2626",
    },
    hint: {
        fontSize: screenWidth < 350 ? 11 : 12,
        color: "#6B7280",
        marginBottom: 8,
        fontStyle: "italic",
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        padding: screenWidth < 350 ? 10 : 12,
        fontSize: screenWidth < 350 ? 14 : 16,
        color: "#1A1A1A",
        height: screenWidth < 350 ? 44 : 48,
    },
    textArea: {
        height: "auto",
        minHeight: 100,
        paddingTop: 12,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    optionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    optionButtonActive: {
        backgroundColor: "#295CA9",
        borderColor: "#295CA9",
    },
    optionText: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#6B7280",
    },
    optionTextActive: {
        color: "#fff",
    },
    buttonContainer: {
        marginTop: 8,
    },
});
