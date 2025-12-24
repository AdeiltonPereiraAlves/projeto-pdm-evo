import { StyleSheet, Text, View } from "react-native";

export default function HeaderMap() {
    return (
        <View style={styles.titulo}>
            <Text style={styles.texto}> Mapa</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    titulo: {
        padding: 4,
        height: 100,
        justifyContent: 'center',

        backgroundColor: '#fff',
        fontSize: 20,

    },
    texto: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 24,
    }
});