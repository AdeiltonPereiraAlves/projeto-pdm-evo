import HeaderMap from "@/components/map/HeaderMap";
import Map from "@/components/map/Map";
import { AuthContext } from "@/data/context/AuthContext";
import { useVagas } from "@/data/context/VagaContext";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
export default function Mapa() {
    const { token, tipoUsuario, loading, logout } = useContext(AuthContext);
    const {imagem} =useVagas()
    return (
        <View style={styles.container}>
            <HeaderMap/>
             {/* <HeaderHome
              
              nomeUsuario="Voluntário"
              imagem={imagem} 
              onProfilePress={() => Alert.alert("Perfil", "Abrir perfil")}
              onNotificationPress={() => Alert.alert("Notificações", "Ver notificações")}
          /> */}
       <Map/>
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
    },container: { flex: 1 },
    map: { flex: 1 },
})
