import Icone from "@/components/shared/Icone";
import { AuthContext } from "@/data/context/AuthContext";
import { useAuthRedirect } from "@/data/hooks/useAuthRedirect";
import { createBottomTabNavigator, } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import { StyleSheet, Text, View } from 'react-native';
import CriarVaga from "./ongs/CriarVaga";
import Dashboard from "./ongs/Dashboard";
import PerfilOng from "./ongs/PerfilOng";
import VagasOng from "./ongs/VagasOng";
import Home from "./voluntario/Home";
import Inscricoes from "./voluntario/Inscricoes";
import Mapa from "./voluntario/Mapa";
import Perfil from "./voluntario/Perfil";
const Tab = createBottomTabNavigator();

export default function Abas({ navigation }: any) {
    const { tipoUsuario, token } = useContext(AuthContext)


    useAuthRedirect()

    function tab(nome: string, componente: any, label: string, icone: string) {
        return (
            <Tab.Screen
                name={nome}
                component={componente}
                options={{

                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabScreen}>
                            <Icone
                                nome={icone as any}
                                tamanho={24}
                                color={focused ? '#29A7EA' : '#9DA2AE'}
                            />
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    ...styles.tabScreenText,
                                    color: focused ? '#29A7EA' : '#9DA2AE',
                                }}
                            >
                                {label}
                            </Text>
                        </View>
                    ),
                }}
            />
        )
    }
    // Menu para Voluntários
    const VoluntarioTabs = () => (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: '#F8F9FA',
                tabBarInactiveBackgroundColor: '#F8F9FA',
                tabBarStyle: {
                    backgroundColor: '#F8F9FA',
                    height: 100,
                    paddingBottom: 20,
                    paddingTop: 15,
                    paddingHorizontal: 10,
                }
            }}
        >
            {tab('Home', Home, 'Home', 'home-outline')}
            {tab('Mapa', Mapa, 'Mapa', 'map-outline')}
            {tab('Inscricoes', Inscricoes, 'Inscricoes', 'list-outline')}
            {tab('Perfil', Perfil, 'Perfil', 'person-outline')}
        </Tab.Navigator>
    );

    // Menu para ONGs
    const OngTabs = () => (
        <Tab.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: '#F8F9FA',
                tabBarInactiveBackgroundColor: '#F8F9FA',
                tabBarStyle: {
                    backgroundColor: '#F8F9FA',
                    height: 100,
                    paddingBottom: 20,
                    paddingTop: 15,
                    paddingHorizontal: 20,
                }
            }}
        >
            {tab('Dashboard', Dashboard, 'Dashboard', 'grid-outline')}
            {tab('CriarVaga', CriarVaga, 'Criar Vaga', 'add-circle-outline')}
            {tab('MinhasVagas',VagasOng , 'Minhas Vagas', 'briefcase-outline')}
            {tab('PerfilOng', PerfilOng, 'Perfil', 'person-outline')}
        </Tab.Navigator>
    );

    return tipoUsuario === 'VOLUNTARIO' ? <VoluntarioTabs /> : <OngTabs />
}


const styles = StyleSheet.create({
    tabScreen: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 70,

    },
    tabScreenText: {
        fontSize: 10,
    },
})
