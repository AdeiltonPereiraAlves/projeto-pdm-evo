import BotaoVoltar from "@/components/ui/BotaoVoltar";
import Icone from "@/components/shared/Icone";
import Loading from "@/components/loading/Loading";
import { mascaraCPF, mascaraTelefone } from "@/utils/masks";
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

type DetalheVoluntarioNavigationProp = NativeStackNavigationProp<RootStackParamList, "DetalheVoluntario">;
type DetalheVoluntarioRouteProp = RouteProp<{ DetalheVoluntario: { voluntarioId: string } }, "DetalheVoluntario">;

interface VoluntarioData {
  id: string;
  nome: string;
  email?: string;
  imagem?: string;
  contato?: string;
  cpf?: string;
  habilidades?: string[];
  interesses?: string[];
  disponibilidade?: string[];
}

export default function DetalheVoluntario() {
  const navigation = useNavigation<DetalheVoluntarioNavigationProp>();
  const route = useRoute<DetalheVoluntarioRouteProp>();
  const { voluntarioId } = route.params;
  const { token } = useContext(AuthContext);
  const { httpGet } = useAPI();
  const [voluntario, setVoluntario] = useState<VoluntarioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoluntario = async () => {
      try {
        const data = await httpGet(`buscar/voluntario/${voluntarioId}`, token || "");
        setVoluntario(data);
      } catch (error) {
        console.error("Erro ao buscar voluntário:", error);
        setVoluntario(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVoluntario();
  }, [voluntarioId, token]);

  if (loading) {
    return <Loading message="Carregando perfil do voluntário..." />;
  }

  if (!voluntario) {
    return (
      <View style={styles.errorContainer}>
        <BotaoVoltar />
        <Text style={styles.errorText}>Voluntário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BotaoVoltar />
        <Text style={styles.headerTitle}>Perfil do Voluntário</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar e Nome */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: voluntario.imagem || "https://via.placeholder.com/120" }}
            style={styles.avatar}
          />
          <Text style={styles.nome}>{voluntario.nome}</Text>
          <Text style={styles.tipo}>Voluntário</Text>
        </View>

        {/* Contato */}
        {voluntario.contato ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="call-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>Contato</Text>
            </View>
            <Text style={styles.sectionText}>{mascaraTelefone(voluntario.contato)}</Text>
          </View>
        ) : null}

        {/* Email */}
        {voluntario.email ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="mail-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>E-mail</Text>
            </View>
            <Text style={styles.sectionText}>{voluntario.email}</Text>
          </View>
        ) : null}

        {/* CPF */}
        {voluntario.cpf ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="document-text-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>CPF</Text>
            </View>
            <Text style={styles.sectionText}>{mascaraCPF(voluntario.cpf)}</Text>
          </View>
        ) : null}

        {/* Habilidades */}
        {voluntario.habilidades && voluntario.habilidades.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="construct-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>Habilidades</Text>
            </View>
            <View style={styles.tagsContainer}>
              {voluntario.habilidades.map((h, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{h}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Interesses */}
        {voluntario.interesses && voluntario.interesses.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="heart-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>Interesses</Text>
            </View>
            <View style={styles.tagsContainer}>
              {voluntario.interesses.map((inter, i) => (
                <View key={i} style={[styles.tag, styles.tagInteresse]}>
                  <Text style={styles.tagTextInteresse}>{inter}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Disponibilidade */}
        {voluntario.disponibilidade && voluntario.disponibilidade.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icone nome="calendar-outline" tamanho={20} color="#295CA9" />
              <Text style={styles.sectionTitle}>Disponibilidade</Text>
            </View>
            <Text style={styles.sectionText}>{voluntario.disponibilidade.join(", ")}</Text>
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
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: "#295CA9",
    fontWeight: "500",
  },
  tagInteresse: {
    backgroundColor: "#FEF3C7",
  },
  tagTextInteresse: {
    fontSize: 14,
    color: "#92400E",
    fontWeight: "500",
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
