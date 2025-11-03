import Avatar from "@/components/shared/Avatar";
import Icone from "@/components/shared/Icone";
import Botao from "@/components/ui/Botao";
import { AuthContext } from "@/data/context/AuthContext";
import { useVagas } from "@/data/context/VagaContext";
import useAPI from "@/data/hooks/useAPI";
import { arrayParaString, mascaraCPF, mascaraTelefone, stringParaArray } from "@/utils/masks";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
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

interface VoluntarioData {
    id: string;
    nome: string;
    email: string;
    cpf: string;
    contato: string;
    habilidades: string;
    imagem?: string;
}

export default function Perfil() {
    const { token, logout } = useContext(AuthContext);
    
    const { httpGet, httpPost,httpPut } = useAPI();
    
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [lista, setLista] = useState([]);
    const {carregarFotoPerfil} =useVagas()
    
    const [perfil, setPerfil] = useState<VoluntarioData>({
        id: "",
        nome: "",
        email: "",
        cpf: "",
        contato: "",
        habilidades: "",
        imagem: "",
    });

    const [editData, setEditData] = useState<VoluntarioData>({
        id: "",
        nome: "",
        email: "",
        cpf: "",
        contato: "",
        habilidades: "",
        imagem: "",
    });

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            setLoading(true);
            const data = await httpGet("buscar", token || "");
            
            // Aplica máscaras nos dados recebidos
            const dataFormatada = {
                ...data,
                cpf: mascaraCPF(data.cpf || ""),
                contato: mascaraTelefone(data.contato || ""),
                habilidades:arrayParaString(data.habilidades)
            };
            console.log(data,"dataPerfil")
            setPerfil(dataFormatada);
           
            setEditData(dataFormatada);
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados do perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleSalvar = async () => {
        try {
            setSaving(true);
            const response = await httpPut("voluntario/editar", editData, token || "");
            console.log(editData, "editeData")
            const dataParaSalvar = {
                ...editData,
                // interesses: stringParaArray(editData.interesses),
                habilidades: stringParaArray(editData.habilidades),
                // disponibilidade: stringParaArray(editData.disponibilidade),
              };
           
          
            
            if (response.ok) {
                const data = await response.json();
                setPerfil(data);
                setEditMode(false);
                Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
                await carregarPerfil()
            } else {
                Alert.alert("Erro", "Não foi possível atualizar o perfil");
            }
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            Alert.alert("Erro", "Erro ao salvar as alterações");
        } finally {
            setSaving(false);
        }
    };

    const handleCancelar = () => {
        setEditData(perfil);
        setEditMode(false);
    };

    const handleLogout = () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", onPress: logout, style: "destructive" }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#295CA9" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable 
                    onPress={() => Alert.alert("Configurações", "Navegação para configurações em desenvolvimento")} 
                    style={styles.settingsButton}
                >
                    <Icone nome="settings-outline" tamanho={24} color="#295CA9" />
                </Pressable>
                <Text style={styles.headerTitle}>Meu Perfil</Text>
                {!editMode && (
                    <Pressable onPress={() => setEditMode(true)} style={styles.editButton}>
                        <Icone nome="create-outline" tamanho={24} color="#295CA9" />
                    </Pressable>
                )}
            </View>

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Foto de Perfil */}
                <View style={styles.profileImageContainer}>

                  
                    <Avatar
                        uri={perfil.imagem}
                        size={120}
                        iconName="person"
                        editable={editMode}
                        onPress={() => Alert.alert("Foto", "Funcionalidade de troca de foto em desenvolvimento",)}
                       
                    />
                    <Text style={styles.profileName}>{perfil.nome}</Text>
                    <Text style={styles.profileType}>Voluntário</Text>
                </View>

                {/* Informações do Perfil */}
                <View style={styles.formContainer}>
                    {/* Nome */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome Completo</Text>
                        {editMode ? (
                            <TextInput
                                style={styles.input}
                                value={editData.nome}
                                onChangeText={(text) => setEditData({ ...editData, nome: text })}
                                placeholder="Seu nome completo"
                                placeholderTextColor="#939EAA"
                            />
                        ) : (
                            <View style={styles.infoCard}>
                                <Text style={styles.infoText}>{perfil.nome}</Text>
                            </View>
                        )}
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>E-mail</Text>
                        {editMode ? (
                            <TextInput
                                style={styles.input}
                                value={editData.email}
                                onChangeText={(text) => setEditData({ ...editData, email: text })}
                                placeholder="seu.email@exemplo.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#939EAA"
                            />
                        ) : (
                            <View style={styles.infoCard}>
                                <Icone nome="mail-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>{perfil.email}</Text>
                            </View>
                        )}
                    </View>

                    {/* CPF */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CPF</Text>
                        {editMode ? (
                            <TextInput
                                style={styles.input}
                                value={editData.cpf}
                                onChangeText={(text) => {
                                    const cpfFormatado = mascaraCPF(text);
                                    setEditData({ ...editData, cpf: cpfFormatado });
                                }}
                                placeholder="000.000.000-00"
                                keyboardType="numeric"
                                placeholderTextColor="#939EAA"
                                maxLength={14}
                            />
                        ) : (
                            <View style={styles.infoCard}>
                                <Icone nome="card-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>{perfil.cpf || "Não informado"}</Text>
                            </View>
                        )}
                    </View>

                    {/* Contato */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contato</Text>
                        {editMode ? (
                            <TextInput
                                style={styles.input}
                                value={editData.contato}
                                onChangeText={(text) => {
                                    const telefoneFormatado = mascaraTelefone(text);
                                    setEditData({ ...editData, contato: telefoneFormatado });
                                }}
                                placeholder="(00) 00000-0000"
                                keyboardType="phone-pad"
                                placeholderTextColor="#939EAA"
                                maxLength={15}
                            />
                        ) : (
                            <View style={styles.infoCard}>
                                <Icone nome="call-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>{perfil.contato || "Não informado"}</Text>
                            </View>
                        )}
                    </View>

                    {/* Habilidades */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Habilidades</Text>
                        {editMode ? (
                            <TextInput
                                style={[styles.input, styles.inputMultiline]}
                                value={editData.habilidades}
                                onChangeText={(text) => setEditData({ ...editData, habilidades: text })}
                                placeholder="Ex: Ensino, Tecnologia, Culinária"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                placeholderTextColor="#939EAA"
                            />
                        ) : (
                            <View style={[styles.infoCard, styles.habilidadesCard]}>
                                <Icone nome="star-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>{perfil.habilidades}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Botões de Ação */}
                <View style={styles.buttonContainer}>
                    {editMode ? (
                        <>
                            <Botao
                                title={saving ? "Salvando..." : "Salvar Alterações"}
                                color="#295CA9"
                                textColor="#fff"
                                onPress={handleSalvar}
                                disabled={saving}
                            />
                            <View style={{ marginTop: 12 }}>
                                <Botao
                                    title="Cancelar"
                                    color="#fff"
                                    textColor="#295CA9"
                                    onPress={handleCancelar}
                                    variant="secondary"
                                />
                            </View>
                        </>
                    ) : (
                        <Botao
                            title="Sair da Conta"
                            color="#DC2626"
                            textColor="#fff"
                            onPress={handleLogout}
                        />
                    )}
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
        fontSize: screenWidth < 350 ? 20 : 24,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    settingsButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "#EFF6FF",
    },
    editButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "#EFF6FF",
    },
    scrollView: {
        flex: 1,
    },
    profileImageContainer: {
        alignItems: "center",
        paddingVertical: screenWidth < 350 ? 20 : 30,
        backgroundColor: "#fff",
        marginBottom: screenWidth < 350 ? 16 : 20,
    },
    profileName: {
        fontSize: screenWidth < 350 ? 20 : 24,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 4,
        marginTop: 12,
        textAlign: "center",
        paddingHorizontal: screenWidth * 0.05,
    },
    profileType: {
        fontSize: screenWidth < 350 ? 14 : 16,
        color: "#6B7280",
    },
    formContainer: {
        paddingHorizontal: screenWidth * 0.05,
        gap: screenWidth < 350 ? 16 : 20,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#374151",
        marginLeft: 4,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: screenWidth < 350 ? 12 : 16,
        fontSize: screenWidth < 350 ? 14 : 16,
        color: "#1A1A1A",
        height: screenWidth < 350 ? 48 : 56,
    },
    inputMultiline: {
        height: screenWidth < 350 ? 100 : 120,
        paddingTop: screenWidth < 350 ? 12 : 16,
        textAlignVertical: "top",
    },
    infoCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: screenWidth < 350 ? 12 : 16,
        gap: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    habilidadesCard: {
        alignItems: "flex-start",
        minHeight: screenWidth < 350 ? 70 : 80,
    },
    infoText: {
        fontSize: screenWidth < 350 ? 14 : 16,
        color: "#1A1A1A",
        flex: 1,
        margin:4,
        lineHeight: screenWidth < 350 ? 20 : 22,
    },
    buttonContainer: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenWidth < 350 ? 20 : 30,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
    },
});
