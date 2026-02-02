

import Avatar from "@/components/shared/Avatar";
import Icone from "@/components/shared/Icone";
import Loading from "@/components/loading/Loading";
import Botao from "@/components/ui/Botao";
import { AuthContext } from "@/data/context/AuthContext";
import { useVagas } from "@/data/context/VagaContext";
import useAPI from "@/data/hooks/useAPI";
import {
    arrayParaString,
    mascaraCPF,
    mascaraTelefone,
    removerMascara,
    stringParaArray
} from "@/utils/masks";
import { API_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    Pressable,
    RefreshControl,
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
    const { httpGet, httpPut } = useAPI();
    const { carregarFotoPerfil } = useVagas();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [previewFotoUri, setPreviewFotoUri] = useState<string | null>(null);
    const [previewFotoAsset, setPreviewFotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const [perfil, setPerfil] = useState<VoluntarioData>({
        id: "",
        nome: "",
        email: "",
        cpf: "",
        contato: "",
        habilidades: "",
        imagem: "",
    });

    const [editData, setEditData] = useState<VoluntarioData>({ ...perfil });

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            const data = await httpGet("buscar", token || "");

            const dataFormatada = {
                ...data,
                cpf: mascaraCPF(data.cpf || ""),
                contato: mascaraTelefone(data.contato || ""),
                habilidades: arrayParaString(data.habilidades),
            };

            setPerfil(dataFormatada);
            setEditData(dataFormatada);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar o perfil");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await carregarPerfil();
    };

    const handleSalvar = async () => {
        try {
            setSaving(true);

            const payload = {
                ...editData,
                contato: removerMascara(editData.contato || ""),
                habilidades: stringParaArray(editData.habilidades),
            };

            const response = await httpPut("voluntario/editar", payload, token || "");

            if (response.ok) {
                Alert.alert("Sucesso", "Perfil atualizado!");
                setEditMode(false);
                carregarPerfil();
            } else {
                Alert.alert("Erro", "Erro ao atualizar perfil");
            }
        } catch {
            Alert.alert("Erro", "Erro ao salvar alterações");
        } finally {
            setSaving(false);
        }
    };

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
            setPreviewFotoUri(result.assets[0].uri);
            setPreviewFotoAsset(result.assets[0]);
        }
    };

    const fecharPreviewFoto = () => {
        setPreviewFotoUri(null);
        setPreviewFotoAsset(null);
    };

    const uploadImagem = async (image: ImagePicker.ImagePickerAsset) => {
        try {
            const formData = new FormData();
            formData.append("imagem", {
                uri: image.uri,
                name: "perfil.jpg",
                type: "image/jpeg",
            } as any);

            const response = await fetch(`${API_URL}/voluntario/imagem/perfil`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            setPerfil(prev => ({ ...prev, imagem: data.imagem }));
            fecharPreviewFoto();
            Alert.alert("Sucesso", "Foto atualizada!");
        } catch {
            Alert.alert("Erro", "Erro ao atualizar foto");
        }
    };

    const confirmarEnvioFoto = () => {
        if (previewFotoAsset) {
            uploadImagem(previewFotoAsset);
        }
    };

    if (loading) {
        return <Loading message="Carregando perfil..." />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.settingsButton}>
                    <Icone nome="settings-outline" tamanho={24} color="#295CA9" />
                </View>
                <Text style={styles.headerTitle}>Meu Perfil</Text>
                {!editMode && (
                    <Pressable onPress={() => setEditMode(true)} style={styles.editButton}>
                        <Icone nome="create-outline" tamanho={24} color="#295CA9" />
                    </Pressable>
                )}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#295CA9"]}
                    />
                }
            >
                {/* Avatar */}
                <View style={styles.profileImageContainer}>
                    <Avatar
                        uri={perfil.imagem}
                        size={120}
                        editable={editMode}
                        iconName="person"
                        onPress={editMode ? escolherImagem : undefined}
                    />
                    <Text style={styles.profileName}>{perfil.nome}</Text>
                    <Text style={styles.profileType}>Voluntário</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <Campo label="Nome" valor={perfil.nome} editMode={editMode}>
                        <TextInput
                            style={styles.input}
                            value={editData.nome}
                            onChangeText={nome => setEditData({ ...editData, nome })}
                        />
                    </Campo>

                    <Campo label="Email" valor={perfil.email} icone="mail-outline" />
                    <Campo label="CPF" valor={perfil.cpf} icone="card-outline" />
                    <Campo label="Contato" valor={perfil.contato} editMode={editMode} icone="call-outline">
                        <TextInput
                            style={styles.input}
                            value={editData.contato}
                            onChangeText={contato => setEditData({ ...editData, contato: mascaraTelefone(contato) })}
                            placeholder="(00) 00000-0000"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                        />
                    </Campo>

                    <Campo label="Habilidades" valor={perfil.habilidades} editMode={editMode}>
                        <TextInput
                            style={[styles.input, styles.inputMultiline]}
                            multiline
                            value={editData.habilidades}
                            onChangeText={habilidades =>
                                setEditData({ ...editData, habilidades })
                            }
                        />
                    </Campo>
                </View>

                {/* Modal: prévia da foto antes de enviar */}
                <Modal
                    visible={!!previewFotoUri}
                    transparent
                    animationType="fade"
                    onRequestClose={fecharPreviewFoto}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalPreviewContent}>
                            <Text style={styles.modalPreviewTitle}>Prévia da foto</Text>
                            {previewFotoUri && (
                                <Image
                                    source={{ uri: previewFotoUri }}
                                    style={styles.modalPreviewImage}
                                    resizeMode="cover"
                                />
                            )}
                            <View style={styles.modalPreviewButtons}>
                                <Pressable style={styles.modalPreviewBtnCancelar} onPress={fecharPreviewFoto}>
                                    <Text style={styles.modalPreviewBtnTextCancelar}>Cancelar</Text>
                                </Pressable>
                                <Pressable style={styles.modalPreviewBtnEnviar} onPress={confirmarEnvioFoto}>
                                    <Text style={styles.modalPreviewBtnTextEnviar}>Enviar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Ações */}
                <View style={styles.buttonContainer}>
                    {editMode ? (
                        <>
                            <Botao
                                title={saving ? "Salvando..." : "Salvar"}
                                onPress={handleSalvar}
                                disabled={saving}
                                color="#295CA9"
                            />
                            <Botao
                                textColor="#295CA9"
                                title="Cancelar"
                                onPress={() => setEditMode(false)}
                                variant="secondary"
                            />
                        </>
                    ) : (
                        <Botao
                            title="Sair da Conta"
                            onPress={logout}
                            color="#DC2626"
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

/* ===== COMPONENTE AUXILIAR ===== */
function Campo({ label, valor, editMode, children, icone }: any) {
    return (
        <View style={{ gap: 8 }}>
            <Text style={styles.label}>{label}</Text>
            {editMode && children ? (
                children
            ) : (
                <View style={styles.infoCard}>
                    {icone && <Icone nome={icone} tamanho={18} color="#295CA9" />}
                    <Text style={styles.infoText}>{valor || "Não informado"}</Text>
                </View>
            )}
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
        margin: 4,
        lineHeight: screenWidth < 350 ? 20 : 22,
    },
    buttonContainer: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenWidth < 350 ? 20 : 30,
        maxWidth: 600,
        gap: 6,
        width: "100%",
        alignSelf: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalPreviewContent: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        width: "100%",
        maxWidth: 340,
        alignItems: "center",
    },
    modalPreviewTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 16,
    },
    modalPreviewImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    modalPreviewButtons: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    modalPreviewBtnCancelar: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
    },
    modalPreviewBtnTextCancelar: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
    },
    modalPreviewBtnEnviar: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#295CA9",
        alignItems: "center",
    },
    modalPreviewBtnTextEnviar: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
});
