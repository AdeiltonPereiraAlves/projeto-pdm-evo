
import { View, Text,Pressable, StyleSheet } from "react-native";
import { AuthContext} from "@/src/data/context/AuthContext";
import { useContext } from "react";
export default function Cadastro() {
    const { token, tipoUsuario, loading, logout } = useContext(AuthContext);
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Cadastro</Text>
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