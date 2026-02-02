import Avatar from "@/components/shared/Avatar";
import Icone from "@/components/shared/Icone";
import Loading from "@/components/loading/Loading";
import Botao from "@/components/ui/Botao";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { mascaraCNPJ } from "@/utils/masks";
import { API_URL } from "@env";
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";
import { useContext, useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface OngData {
    id: string;
    nome: string;
    email: string;
    imagem: string;
    cnpj?: string;
    areaAtuacao: string;
    endereco: string;
    descricao?: string;
    visao?: string;
    missao?: string;
}
export default function PerfilOng() {
    const { token, logout } = useContext(AuthContext);
    const { httpGet, httpPut } = useAPI();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [prevImg, setPrevImg] = useState<string>("");
    const route = useRoute();
   
    const [perfil, setPerfil] = useState<OngData>({
        id: "",
        nome: "",
        email: "",
        imagem: "",
        cnpj: "",
        areaAtuacao: "",
        endereco: "",
        descricao: "",
        missao: "",
        visao: "",
    });

    const [editData, setEditData] = useState<any>({
        id: "",
        nome: "",
        email: "",
        imagem: "",
        
        areaAtuacao: "",
        endereco: "",
        descricao: "",
        missao: "",
        visao: "",
    });

    useEffect(() => {
        carregarPerfil();
    }, []);


    //refresh 
    const onRefresh = async () => {
        setRefreshing(true);
        await carregarPerfil();
    };
    //carregar perfil
    const carregarPerfil = async () => {
        try {
            setLoading(true);
            const data = await httpGet('perfil', token || "");

            if(!data){
                throw new Error("Dados do perfil não encontrados");
            }
            console.log("Dados do perfil recebidos:", data);
           
            // Aplica máscara no CNPJ recebido
            const dataFormatada = {
                ...data,
                cnpj: mascaraCNPJ(data.cnpj || ""),
            };
            console.log("Dados do perfil carregados:", dataFormatada);

            setPerfil(dataFormatada);
            setEditData(dataFormatada);
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados do perfil");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSalvar = async () => {
        try {
            setSaving(true);
            const response = await httpPut("ong/editar", editData, token || "");
            console.log("Resposta da atualização do perfil:", response);

            if (response.ok) {
               
                setPerfil(response.data);
                setEditMode(false);
                Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
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
    //escolher imagem 
     const escolherImagem = async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Permissão necessária", "Permita acesso à galeria");
                return;
            }
    
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [1, 1],
            });
    
            if (!result.canceled) {
                uploadImagem(result.assets[0]);
            }
        };

     //upload imagem
      const uploadImagem = async (image: ImagePicker.ImagePickerAsset) => {
        try {
            const formData = new FormData();
            formData.append("imagem", {
                uri: image.uri,
                name: "perfil.jpg",
                type: "image/jpeg",
            } as any);

            const response = await fetch(`${API_URL}/ong/imagem/perfil`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            setPerfil(prev => ({ ...prev, imagem: data.imagem }));
            Alert.alert("Sucesso", "Foto atualizada!");
        } catch {
            Alert.alert("Erro", "Erro ao atualizar foto");
        }
    };

    if (loading) {
        return <Loading message="Carregando perfil..." />;
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
                <Text style={styles.headerTitle}>Perfil da ONG</Text>
                {!editMode && (
                    <Pressable onPress={() => setEditMode(true)} style={styles.editButton}>
                        <Icone nome="create-outline" tamanho={24} color="#295CA9" />
                    </Pressable>
                )}
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#295CA9"]}
                    />
                }
            >
                {/* Foto de Perfil */}
                <View style={styles.profileImageContainer}>
                    <Avatar
                        uri={perfil.imagem}
                        size={120}
                        iconName="business"
                        editable={editMode}
                        onPress={editMode ? escolherImagem : undefined}
                    />
                    <Text style={styles.profileName}>{perfil.nome}</Text>
                    <Text style={styles.profileType}>Organização Não Governamental</Text>
                </View>

                {/* Informações do Perfil */}
                <View style={styles.formContainer}>
                    {/* Nome */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome da ONG</Text>
                        {editMode ? (
                            <TextInput
                                style={styles.input}
                                value={editData.nome}
                                onChangeText={(text) => setEditData({ ...editData, nome: text })}
                                placeholder="Nome da organização"
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
                       
                            <View style={styles.infoCard}>
                                <Icone nome="mail-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>{perfil.email}</Text>
                            </View>
                        
                    </View>

                    {/* CNPJ */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CNPJ</Text>
                        
                            <View style={styles.infoCard}>
                                <Icone nome="document-text-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>{perfil.cnpj || "Não informado"}</Text>
                            </View>
                        
                    </View>

                    {/* Área de Atuação */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Área de Atuação</Text>
                        {editMode ? (
                            <TextInput
                                style={styles.input}
                                value={editData.areaAtuacao}
                                onChangeText={(text) => setEditData({ ...editData, areaAtuacao: text })}
                                placeholder="Ex: Educação, Saúde, Meio Ambiente"
                                placeholderTextColor="#939EAA"
                            />
                        ) : (
                            <View style={styles.infoCard}>
                                <Icone nome="briefcase-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>{perfil.areaAtuacao}</Text>
                            </View>
                        )}
                    </View>

                    {/* Endereço */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Endereço</Text>
                        {editMode ? (
                            <TextInput
                                style={[styles.input, styles.inputMultiline]}
                                value={editData.endereco}
                                onChangeText={(text) => setEditData({ ...editData, endereco: text })}
                                placeholder="Rua, número, bairro, cidade"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                placeholderTextColor="#939EAA"
                            />
                        ) : (
                            <View style={[styles.infoCard, styles.enderecoCard]}>
                                <Icone nome="location-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>{perfil.endereco}</Text>
                            </View>
                        )}
                    </View>
                    {/* Missão */}
                     <View style={styles.inputGroup}>
                        <Text style={styles.label}>Missão</Text>
                        {editMode ? (
                            <TextInput
                                style={[styles.input, styles.inputMultiline, styles.inputLarge]}
                                value={editData.missao}
                                onChangeText={(text) => setEditData({ ...editData, missao: text })}
                                placeholder="Conte mais sobre a missão e os projetos da sua organização"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                placeholderTextColor="#939EAA"
                            />
                        ) : (
                            <View style={[styles.infoCard, styles.descricaoCard]}>
                                <Icone nome="information-circle-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>
                                    {perfil.missao || "Nenhuma descrição adicionada"}
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* Visão */}
                   
                     <View style={styles.inputGroup}>
                        <Text style={styles.label}>Visão</Text>
                        {editMode ? (
                            <TextInput
                                style={[styles.input, styles.inputMultiline, styles.inputLarge]}
                                value={editData.visao}
                                onChangeText={(text) => setEditData({ ...editData, visao: text })}
                                placeholder="Conte mais sobre a missão e os projetos da sua organização"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                placeholderTextColor="#939EAA"
                            />
                        ) : (
                            <View style={[styles.infoCard, styles.descricaoCard]}>
                                <Icone nome="information-circle-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>
                                    {perfil.visao || "Nenhuma descrição adicionada"}
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* Descrição */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sobre a ONG</Text>
                        {editMode ? (
                            <TextInput
                                style={[styles.input, styles.inputMultiline, styles.inputLarge]}
                                value={editData.descricao}
                                onChangeText={(text) => setEditData({ ...editData, descricao: text })}
                                placeholder="Conte mais sobre a missão e os projetos da sua organização"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                placeholderTextColor="#939EAA"
                            />
                        ) : (
                            <View style={[styles.infoCard, styles.descricaoCard]}>
                                <Icone nome="information-circle-outline" tamanho={20} color="#295CA9" />
                                <Text style={styles.infoText}>
                                    {perfil.descricao || "Nenhuma descrição adicionada"}
                                </Text>
                            </View>
                        )}
                    </View>

                </View>

                {/* Estatísticas (Opcional) */}
                {/* {!editMode && (
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Icone nome="briefcase" tamanho={32} color="#295CA9" />
                            <Text style={styles.statNumber}>12</Text>
                            <Text style={styles.statLabel}>Vagas Criadas</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Icone nome="people" tamanho={32} color="#22C55E" />
                            <Text style={styles.statNumber}>45</Text>
                            <Text style={styles.statLabel}>Voluntários</Text>
                        </View>
                    </View>
                )} */}

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
        fontSize: screenWidth < 350 ? 12 : 14,
        color: "#6B7280",
        textAlign: "center",
    },
    formContainer: {
        paddingHorizontal: screenWidth * 0.05,
        gap: screenWidth < 350 ? 16 : 20,
        marginBottom: screenWidth < 350 ? 16 : 20,
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
        height: screenWidth < 350 ? 90 : 100,
        paddingTop: screenWidth < 350 ? 12 : 16,
        textAlignVertical: "top",
    },
    inputLarge: {
        height: screenWidth < 350 ? 120 : 140,
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
    enderecoCard: {
        alignItems: "flex-start",
        minHeight: screenWidth < 350 ? 70 : 80,
    },
    descricaoCard: {
        alignItems: "flex-start",
        minHeight: screenWidth < 350 ? 90 : 100,
    },
    infoText: {
        fontSize: screenWidth < 350 ? 14 : 16,
        color: "#1A1A1A",
        flex: 1,
        lineHeight: screenWidth < 350 ? 20 : 22,
    },
    statsContainer: {
        flexDirection: screenWidth < 350 ? "column" : "row",
        paddingHorizontal: screenWidth * 0.05,
        gap: 12,
        marginBottom: screenWidth < 350 ? 16 : 20,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: screenWidth < 350 ? 16 : 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        minWidth: screenWidth < 350 ? "100%" : "auto",
    },
    statNumber: {
        fontSize: screenWidth < 350 ? 28 : 32,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginTop: 8,
    },
    statLabel: {
        fontSize: screenWidth < 350 ? 13 : 14,
        color: "#6B7280",
        marginTop: 4,
        textAlign: "center",
    },
    buttonContainer: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenWidth < 350 ? 20 : 30,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
    },
});
