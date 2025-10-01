import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "@/src/data/context/AuthContext";
import Autenticacao from "./Autenticacao";
import Login from "./Auth/login";
import Inicio from "../tabs/Inicio";
import Perfil from "../tabs/Perfil";
import { useContext } from "react";
import HomeVoluntario from "@/src/screens/tabs/voluntario/Home"
import Dashboard from "@/src/screens/tabs/ongs/Dashboard"
import Cadastro from "./Auth/Cadastro";
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
        ) : tipoUsuario === "ONG" ? (
          // 🔹 Se for ONG
          <Stack.Screen name="Dashboard" component={Dashboard} />
        ) : (
          // 🔹 Se for Voluntário
          <Stack.Screen name="Home" component={HomeVoluntario} />
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
