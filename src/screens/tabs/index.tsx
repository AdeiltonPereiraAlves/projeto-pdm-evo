import { createBottomTabNavigator,  } from "@react-navigation/bottom-tabs"
import Perfil from "./Perfil";
import Inicio from "./Inicio";
import {View, Text, StyleSheet} from 'react-native'
import Dashboard from "./ongs/Dashboard";

const Tab = createBottomTabNavigator();

export default function Abas({navigation}:any) {

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
    return (

        //mudar cor dos icones do menu botton
        <Tab.Navigator initialRouteName="Inicio" screenOptions={
            {headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor:'#222',
                tabBarInactiveBackgroundColor:'#222',
                tabBarStyle:{
                    backgroundColor:'#E6F4FE',
                }
            }
        }
        >
            {tab('Inicio', Inicio,'Inicio', 'home-outline')}
            {tab('Perfil', Perfil, 'Perfil', 'person-outline')}
            {tab('Dashboard', Dashboard, 'Dashboard', 'person-outline')}
        </Tab.Navigator>
    )
}
        

const styles = StyleSheet.create({
    tabScreen: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    tabScreenText: {
        fontSize: 10,
    },
})
