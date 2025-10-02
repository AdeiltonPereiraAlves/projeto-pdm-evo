// app/(auth)/login.tsx
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext } from "react";
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import * as yup from 'yup';
import Botao from "../../../components/ui/Botao";
import RodapeLogin from "../../../components/ui/RodapeLogin";
import { AuthContext } from "../../../data/context/AuthContext";
import useAPI from '../../../data/hooks/useAPI';

// Schema de validação
const loginSchema = yup.object({
    email: yup
        .string()
        .email('Email deve ter um formato válido')
        .required('Email é obrigatório'),
    senha: yup
        .string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .required('Senha é obrigatória'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

type RootStackParamList = {
    Inicio: undefined;
    Login: undefined;
    Cadastro: undefined;
    Abas: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
    const { login } = useContext(AuthContext);
    const { httpPost } = useAPI();
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            senha: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            console.log("Dados do formulário:", data);
            const res = await httpPost("login", data);

            console.log(res, "res")

            if (res.ok) {
                const responseData = await res.json();
                console.log(responseData, "data")
                
                const tipoUsuario = responseData.usuario.tipo as "ONG" | "VOLUNTARIO";
                await login(responseData.token, responseData.usuario.tipo);
                console.log("Login realizado com sucesso", tipoUsuario);
                
                navigation.reset({
                    index: 0,
                    routes: [
                        { name: "Abas" }
                    ],
                });
            } else {
                // Capturar erro do backend
                try {
                    const errorData = await res.json();
                    console.log("Erro do backend:", errorData);
                    
                    // Exibir mensagem específica do backend
                    const errorMessage = errorData.message || errorData.error || errorData.msg || "Erro ao fazer login";
                    Alert.alert("Erro", errorMessage);
                } catch (parseError) {
                    // Se não conseguir fazer parse do JSON, tentar como texto
                    const errorText = await res.text();
                    console.log("Erro como texto:", errorText);
                    Alert.alert("Erro", errorText || "Erro ao fazer login");
                }
            }
        } catch (err) {
            console.log("Erro de conexão:", err);
            Alert.alert("Erro", "Erro de conexão. Verifique sua internet e tente novamente.");
        }
    };

    return (
        <View style={{ flex: 1, alignItems: "center", height: '100%', }}>

            <Text style={{ fontSize: 34, fontWeight: "bold", marginTop: 60, marginBottom: 6, height: 50, textAlign: 'center' }}>
                Login
            </Text>

            <View style={{ flex: 1, alignItems: "center", height: '100%', width: '100%', borderTopWidth: 1, borderTopColor: '#eeeeeeff' }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: '100%', height: 300, justifyContent: 'center', marginTop: 100 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%', paddingLeft: 30, paddingRight: 30, marginBottom: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>E-mail:</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.email && styles.inputError]}
                                    placeholder="seu.email@exemplo.com"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            )}
                        />
                        {errors.email && (
                            <Text style={styles.errorText}>{errors.email.message}</Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%', paddingLeft: 30, paddingRight: 30, marginBottom: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Senha:</Text>
                        <Controller
                            control={control}
                            name="senha"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.senha && styles.inputError]}
                                    placeholder="***************"
                                    secureTextEntry
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                            )}
                        />
                        {errors.senha && (
                            <Text style={styles.errorText}>{errors.senha.message}</Text>
                        )}
                    </View>
                </View>


                <Botao 
                    title={isSubmitting ? "Entrando..." : "Entrar"} 
                    largura={330} 
                    altura={56} 
                    color="#295CA9" 
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                />

                <View style={{ height: 50, marginTop: 186 }}>
                    <RodapeLogin 
                        title="Não tem uma conta? " 
                        subtitle="Cadastre-se" 
                        onPress={() => {
                            try {
                                console.log("Navegando para Cadastro...");
                                navigation.navigate("Cadastro");
                            } catch (error) {
                                console.error("Erro ao navegar para Cadastro:", error);
                                Alert.alert("Erro", "Não foi possível navegar para a tela de cadastro");
                            }
                        }} 
                    />
                </View>
            </View>

            {/* <Button title="Entrar" onPress={handleLogin} color={red} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1, 
        borderColor: '#eeeeeeff', 
        padding: 10, 
        width: '100%', 
        marginBottom: 10, 
        borderRadius: 8, 
        marginTop: 10, 
        height: 56,
        color: "#939EAA",
    },
    inputError: {
        borderColor: '#ff4444',
        borderWidth: 2,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
})