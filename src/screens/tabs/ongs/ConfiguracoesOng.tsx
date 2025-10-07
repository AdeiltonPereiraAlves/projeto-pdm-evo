import Icone from "@/components/shared/Icone";
import Botao from "@/components/ui/Botao";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
    Alert,
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ConfiguracoesOng() {
    const navigation = useNavigation();
    const { token, logout } = useContext(AuthContext);
    const { httpPost } = useAPI();

    // Estados para alteração de senha
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
    const [salvandoSenha, setSalvandoSenha] = useState(false);

    // Estados para preferências
    const [notificacoesPush, setNotificacoesPush] = useState(true);
    const [notificacoesEmail, setNotificacoesEmail] = useState(true);
    const [notificacoesCandidatos, setNotificacoesCandidatos] = useState(true);

    const handleAlterarSenha = async () => {
        if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        if (novaSenha !== confirmarNovaSenha) {
            Alert.alert("Erro", "A nova senha e a confirmação não coincidem");
            return;
        }

        if (novaSenha.length < 6) {
            Alert.alert("Erro", "A nova senha deve ter pelo menos 6 caracteres");
            return;
        }

        try {
            setSalvandoSenha(true);
            const response = await httpPost(
                "perfil/alterar-senha",
                {
                    senhaAtual,
                    novaSenha,
                },
                token || ""
            );

            if (response.ok) {
                Alert.alert("Sucesso", "Senha alterada com sucesso!");
                setSenhaAtual("");
                setNovaSenha("");
                setConfirmarNovaSenha("");
            } else {
                const data = await response.json();
                Alert.alert("Erro", data.message || "Erro ao alterar senha");
            }
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            Alert.alert("Erro", "Não foi possível alterar a senha");
        } finally {
            setSalvandoSenha(false);
        }
    };

    const handleExcluirConta = () => {
        Alert.alert(
            "Excluir Conta da ONG",
            "Tem certeza que deseja excluir a conta da ONG? Todas as vagas criadas serão removidas. Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await httpPost("perfil/excluir", {}, token || "");
                            if (response.ok) {
                                Alert.alert("Conta Excluída", "A conta da ONG foi excluída com sucesso");
                                logout();
                            } else {
                                Alert.alert("Erro", "Não foi possível excluir a conta");
                            }
                        } catch (error) {
                            console.error("Erro ao excluir conta:", error);
                            Alert.alert("Erro", "Não foi possível excluir a conta");
                        }
                    },
                },
            ]
        );
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
                <Text style={styles.headerTitle}>Configurações</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Seção: Segurança */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Segurança</Text>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Alterar Senha</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha Atual</Text>
                            <TextInput
                                style={styles.input}
                                value={senhaAtual}
                                onChangeText={setSenhaAtual}
                                placeholder="Digite sua senha atual"
                                secureTextEntry
                                placeholderTextColor="#939EAA"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nova Senha</Text>
                            <TextInput
                                style={styles.input}
                                value={novaSenha}
                                onChangeText={setNovaSenha}
                                placeholder="Digite a nova senha"
                                secureTextEntry
                                placeholderTextColor="#939EAA"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirmar Nova Senha</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmarNovaSenha}
                                onChangeText={setConfirmarNovaSenha}
                                placeholder="Digite novamente a nova senha"
                                secureTextEntry
                                placeholderTextColor="#939EAA"
                            />
                        </View>

                        <View style={styles.buttonWrapper}>
                            <Botao
                                title={salvandoSenha ? "Salvando..." : "Alterar Senha"}
                                color="#295CA9"
                                textColor="#fff"
                                onPress={handleAlterarSenha}
                                disabled={salvandoSenha}
                            />
                        </View>
                    </View>
                </View>

                {/* Seção: Notificações */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificações</Text>

                    <View style={styles.card}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Icone nome="notifications-outline" tamanho={24} color="#295CA9" />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Notificações Push</Text>
                                    <Text style={styles.settingDescription}>
                                        Receba alertas sobre sua ONG
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={notificacoesPush}
                                onValueChange={setNotificacoesPush}
                                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                                thumbColor={notificacoesPush ? "#295CA9" : "#f4f3f4"}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Icone nome="mail-outline" tamanho={24} color="#295CA9" />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Notificações por E-mail</Text>
                                    <Text style={styles.settingDescription}>
                                        Receba atualizações por e-mail
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={notificacoesEmail}
                                onValueChange={setNotificacoesEmail}
                                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                                thumbColor={notificacoesEmail ? "#295CA9" : "#f4f3f4"}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Icone nome="people-outline" tamanho={24} color="#295CA9" />
                                <View style={styles.settingTextContainer}>
                                    <Text style={styles.settingTitle}>Novos Candidatos</Text>
                                    <Text style={styles.settingDescription}>
                                        Notificações sobre candidaturas às vagas
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={notificacoesCandidatos}
                                onValueChange={setNotificacoesCandidatos}
                                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                                thumbColor={notificacoesCandidatos ? "#295CA9" : "#f4f3f4"}
                            />
                        </View>
                    </View>
                </View>

                {/* Seção: Gestão da ONG */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gestão da ONG</Text>

                    <View style={styles.card}>
                        <Pressable style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <Icone nome="people-outline" tamanho={24} color="#295CA9" />
                                <Text style={styles.menuItemText}>Gerenciar Membros</Text>
                            </View>
                            <Icone nome="chevron-forward" tamanho={20} color="#9CA3AF" />
                        </Pressable>

                        <View style={styles.divider} />

                        <Pressable style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <Icone nome="stats-chart-outline" tamanho={24} color="#295CA9" />
                                <Text style={styles.menuItemText}>Relatórios</Text>
                            </View>
                            <Icone nome="chevron-forward" tamanho={20} color="#9CA3AF" />
                        </Pressable>
                    </View>
                </View>

                {/* Seção: Privacidade */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacidade e Dados</Text>

                    <View style={styles.card}>
                        <Pressable style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <Icone nome="shield-outline" tamanho={24} color="#295CA9" />
                                <Text style={styles.menuItemText}>Política de Privacidade</Text>
                            </View>
                            <Icone nome="chevron-forward" tamanho={20} color="#9CA3AF" />
                        </Pressable>

                        <View style={styles.divider} />

                        <Pressable style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <Icone nome="document-text-outline" tamanho={24} color="#295CA9" />
                                <Text style={styles.menuItemText}>Termos de Uso</Text>
                            </View>
                            <Icone nome="chevron-forward" tamanho={20} color="#9CA3AF" />
                        </Pressable>
                    </View>
                </View>

                {/* Seção: Zona de Perigo */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, styles.dangerText]}>Zona de Perigo</Text>

                    <View style={styles.card}>
                        <View style={styles.dangerZone}>
                            <View style={styles.dangerInfo}>
                                <Icone nome="warning-outline" tamanho={24} color="#DC2626" />
                                <View style={styles.dangerTextContainer}>
                                    <Text style={styles.dangerTitle}>Excluir Conta da ONG</Text>
                                    <Text style={styles.dangerDescription}>
                                        Remove todas as vagas e dados
                                    </Text>
                                </View>
                            </View>
                            <Pressable
                                style={styles.dangerButton}
                                onPress={handleExcluirConta}
                            >
                                <Text style={styles.dangerButtonText}>Excluir</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={{ height: 40 }} />
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
    section: {
        marginTop: screenWidth < 350 ? 20 : 24,
        paddingHorizontal: screenWidth * 0.05,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
    },
    sectionTitle: {
        fontSize: screenWidth < 350 ? 16 : 18,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: screenWidth < 350 ? 16 : 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    cardTitle: {
        fontSize: screenWidth < 350 ? 15 : 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: screenWidth < 350 ? 12 : 16,
    },
    inputGroup: {
        marginBottom: screenWidth < 350 ? 12 : 16,
    },
    label: {
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        padding: screenWidth < 350 ? 10 : 12,
        fontSize: screenWidth < 350 ? 14 : 16,
        color: "#1A1A1A",
        height: screenWidth < 350 ? 44 : 48,
    },
    buttonWrapper: {
        marginTop: 8,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: screenWidth < 350 ? 10 : 12,
    },
    settingInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },
    settingTextContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: screenWidth < 350 ? 15 : 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: screenWidth < 350 ? 13 : 14,
        color: "#6B7280",
        lineHeight: screenWidth < 350 ? 18 : 20,
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 8,
    },
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: screenWidth < 350 ? 10 : 12,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    menuItemText: {
        fontSize: screenWidth < 350 ? 15 : 16,
        color: "#1A1A1A",
    },
    dangerZone: {
        flexDirection: screenWidth < 350 ? "column" : "row",
        justifyContent: "space-between",
        alignItems: screenWidth < 350 ? "stretch" : "center",
        gap: screenWidth < 350 ? 12 : 0,
    },
    dangerInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    dangerTextContainer: {
        flex: 1,
    },
    dangerTitle: {
        fontSize: screenWidth < 350 ? 15 : 16,
        fontWeight: "600",
        color: "#DC2626",
        marginBottom: 2,
    },
    dangerDescription: {
        fontSize: screenWidth < 350 ? 13 : 14,
        color: "#6B7280",
        lineHeight: screenWidth < 350 ? 18 : 20,
    },
    dangerText: {
        color: "#DC2626",
    },
    dangerButton: {
        backgroundColor: "#FEE2E2",
        paddingHorizontal: screenWidth < 350 ? 16 : 20,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#DC2626",
        alignSelf: screenWidth < 350 ? "stretch" : "auto",
        alignItems: "center",
    },
    dangerButtonText: {
        color: "#DC2626",
        fontSize: screenWidth < 350 ? 13 : 14,
        fontWeight: "600",
    },
});

