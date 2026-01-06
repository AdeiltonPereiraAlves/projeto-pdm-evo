import DetalheVagaOng from "@/components/vagas/vagaOng/DetalheVagaOng";
import { AuthContext, AuthProvider } from "@/data/context/AuthContext";
import { VagaProvider } from "@/data/context/VagaContext";
import DetalheVaga from "@/screens/stack/DetalheVaga";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import IncricoesScreen from "../../components/ong/incricoes/InscricoesScreen";
import Abas from "../tabs/index";
import PerfilOng from "../tabs/ongs/PerfilOng";
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
  VagaDetalheOng: { vagaId: string }; Inscricoes: { vagaId: string };
  inscricoesScreen: undefined;
};


function AppNavigator() {
  const { token, tipoUsuario, loading } = useContext(AuthContext);

  if (loading) {
    return <Autenticacao />; // Splash enquanto carrega do AsyncStorage
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen name="Inicio" component={Inicio} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
        </>
      ) : (
        <>
          <Stack.Screen name="Abas" component={Abas} />
          <Stack.Screen name="DetalheVaga" component={DetalheVaga} />
          <Stack.Screen
            name="DetalheVagaOng" // Nome que deve ser usado no navigate()
            component={DetalheVagaOng}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="PerfilOng" component={PerfilOng} />


          <Stack.Screen name="InscricoesScreen" component={IncricoesScreen} />

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
