import { AuthContext } from "@/src/data/context/AuthContext";
import { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CriarVaga() {
    const { token, tipoUsuario, loading, logout } = useContext(AuthContext);
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Criar Nova Vaga</Text>
            <Pressable style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>sair</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '40%',
        height: 40,
        backgroundColor: '#22c55e',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
})
