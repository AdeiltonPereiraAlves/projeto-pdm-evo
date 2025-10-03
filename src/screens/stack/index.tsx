import { AuthContext, AuthProvider } from "@/src/data/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import Abas from "../tabs/index";
import Autenticacao from "./Autenticacao";
import Cadastro from "./Auth/Cadastro";
import Inicio from "./Auth/Inicio";
import Login from "./Auth/login";
const Stack = createNativeStackNavigator();



function AppNavigator() {
    const { token, tipoUsuario, loading } = useContext(AuthContext);
  
    if (loading) {
      return <Autenticacao />; // Splash enquanto carrega do AsyncStorage
    }
  
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          // 🔹 Usuário sem token válido → começa no Welcome
          <>
            <Stack.Screen name="Inicio" component={Inicio} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
          </>
        ) : (
          // 🔹 Usuário logado (ONG ou Voluntário) → vai para Abas
          <Stack.Screen name="Abas" component={Abas}/>
        )}
      </Stack.Navigator>
    );
  }
export default function App() {

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
