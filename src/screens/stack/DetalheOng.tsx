import BotaoVoltar from "@/components/ui/BotaoVoltar";
import Icone from "@/components/shared/Icone";
import Loading from "@/components/loading/Loading";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RootStackParamList } from "./index";

type DetalheOngNavigationProp = NativeStackNavigationProp<RootStackParamList, "DetalheOng">;
type DetalheOngRouteProp = RouteProp<{ DetalheOng: { ongId: string } }, "DetalheOng">;

interface OngData {
  id: string;
  nome: string;
  email?: string;
  imagem?: string;
  cnpj?: string;
  areaAtuacao?: string;
  endereco?: string;
  descricao?: string;
  visao?: string;
  missao?: string;
}

export default function DetalheOng() {
  const navigation = useNavigation<DetalheOngNavigationProp>();
  const route = useRoute<DetalheOngRouteProp>();
  const { ongId } = route.params;
  const { token } = useContext(AuthContext);
  const { httpGet } = useAPI();
  const [ong, setOng] = useState<OngData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOng = async () => {
      try {
        const data = await httpGet(`buscar/ong/${ongId}`, token || "");
        setOng(data);
      } catch (error) {
        console.error("Erro ao buscar ONG:", error);
        setOng(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOng();
  }, [ongId, token]);

  if (loading) {
    return <Loading message="Carregando perfil da ONG..." />;
  }

  if (!ong) {
    return (
      <View style={styles.errorContainer}>
        <BotaoVoltar />
        <Text style={styles.errorText}>ONG não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BotaoVoltar />
        <Text style={styles.headerTitle}>Perfil da ONG</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar e Nome */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: ong.imagem || "https://via.placeholder.com/120" }}
            style={styles.avatar}
          />
          <Text style={styles.nome}>{ong.nome}</Text>
          <Text style={styles.tipo}>Organização Não Governamental</Text>
        </View>

        {/* Descrição */}
        {ong.descricao ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.sectionText}>{ong.descricao}</Text>
          </View>
        ) : null}

        {/* Missão */}
        {ong.missao ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="flag-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>Missão</Text>
            </View>
            <Text style={styles.sectionText}>{ong.missao}</Text>
          </View>
        ) : null}

        {/* Visão */}
        {ong.visao ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="eye-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>Visão</Text>
            </View>
            <Text style={styles.sectionText}>{ong.visao}</Text>
          </View>
        ) : null}

        {/* Área de Atuação */}
        {ong.areaAtuacao ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="briefcase-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>Área de Atuação</Text>
            </View>
            <Text style={styles.sectionText}>{ong.areaAtuacao}</Text>
          </View>
        ) : null}

        {/* Endereço */}
        {ong.endereco ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="location-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>Endereço</Text>
            </View>
            <Text style={styles.sectionText}>{ong.endereco}</Text>
          </View>
        ) : null}

        {/* Email */}
        {ong.email ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="mail-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>Contato</Text>
            </View>
            <Text style={styles.sectionText}>{ong.email}</Text>
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
  },
  nome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 12,
    textAlign: "center",
  },
  tipo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#295CA9",
  },
  sectionText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
