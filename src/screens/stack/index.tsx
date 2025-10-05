import { AuthContext, AuthProvider } from "@/data/context/AuthContext";
import { VagaProvider } from "@/data/context/VagaContext";
import DetalheVaga from "@/screens/stack/DetalheVaga";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import Abas from "../tabs/index";
import Autenticacao from "./Autenticacao";
import Cadastro from "./Auth/Cadastro";
import Inicio from "./Auth/Inicio";
import Login from "./Auth/login";
const Stack = createNativeStackNavigator();

// Tipagem do Stack Navigator
export type RootStackParamList = {
  Inicio: undefined;
  Login: undefined;
  Cadastro: undefined;
  Abas: undefined;
  DetalheVaga: { vagaId: string }; // passando ID da vaga
};


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
        <>
          <Stack.Screen name="Abas" component={Abas} />
          <Stack.Screen name="DetalheVaga" component={DetalheVaga} options={{ title: "Detalhe da Vaga" }} />
        </>
      )}
    </Stack.Navigator>
  );
}
export default function App() {

  return (
    <AuthProvider>
      <VagaProvider>

        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </VagaProvider>
    </AuthProvider>
  );
}
