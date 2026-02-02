
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,          // largura da borda
    borderColor: '#eeeeeeff',     // cor clara
    borderRadius: 12,        // cantos arredondados
    // fundo branco
    shadowColor: '#000',     // sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // 🔹 espaço para não cobrir o botão
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeeeff"
  },
  tituloContainer: {
    flex: 1,
    marginRight: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  ong: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  ongLink: {
    fontSize: 16,
    color: "#295CA9",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  ongHint: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  favoritoContainer: {
    padding: 4,
  },
  infoContainer: {
    marginBottom: 16,
    flexDirection: 'row',   // organiza os itens em linha
    flexWrap: 'wrap',       // permite que quebre para a próxima linha
    justifyContent: 'space-between',

  },
  infoItem: {
    width: '48%',
    height: "48%",           // cada item ocupa aproximadamente metade do container
    flexDirection: 'row',    // ícone e texto lado a lado
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 4,           // espaço entre ícone e texto
    fontSize: 14,
    color: '#333',
  },
  descricao: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 16,
  },
  requesitos: {
    flex: 1,
    flexDirection: 'column',
    fontSize: 15,
    height: "38%",
    width: "88%",
    color: "#444",
    lineHeight: 22,
    marginBottom: 16,
  },
  lista: {
    flex: 1,
    width: "80%",
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
    padding: 4,

  },
  decricaoContainer: {
    flex: 1,
    height: "48%",
    paddingVertical: 30,
    flexDirection: 'column',


  },
  tagsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    color: "#1976d2",
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  botaoCandidatar: {
    backgroundColor: "#295CA9",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  botaoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  labelDescricao: {
    fontWeight: 'bold',
    paddingBottom: 10,
    fontSize: 22,
    color: "#295CA9"
  }
});
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { vagaDetalhe } from "../../screens/stack/DetalheVaga";
import Icone from "../shared/Icone";
import { useNavigation } from "@react-navigation/native";

export interface Inscricao {
  vagaId: string;
  ativo: boolean;
}

export default function VagaDetalhe({
  id,
  titulo,
  descricao,
  localizacao,
  tipoTrabalho,
  ong,
  requisitos,
  quantidade,
  status,
  duracao,
}: vagaDetalhe) {
  const navigation = useNavigation<any>();
  const [ativo, setAtivo] = useState<boolean | undefined>(undefined);
  const texto = ativo === undefined ? "Carregando..." : ativo ? "Inscrito" : "Candidatar-se";
 const [idVaga, setIdVaga] = useState(id)
  const { token } = useContext(AuthContext);
  const { httpPost, httpGet, buscarStatusInscricao } = useAPI();
 
 
  
  const imagemURL = ong.imagem!;
  const [loading, setLoading] = useState<boolean>(false);
  // 🔹 Buscar status atual da inscrição quando entrar na tela
  useEffect(() => {
    if (!token) return;
  
    setAtivo(undefined); // resetar estado quando muda de vaga
    let mounted = true;
    
    const buscarStatus = async () => {
      try {
        const res = await buscarStatusInscricao(`inscricao/status/${id}`, token);
        if (!res.ok) return;
        const data = await res.json();

        console.log(data, "datascr")
        if (mounted) setAtivo(Boolean(data.ativo));
      } catch (err) {
        console.log("Erro buscar status:", err);
        if (mounted) setAtivo(false);
      }
    };
  
    buscarStatus();
    return () => { mounted = false; };
  }, [id, token]);
  
  // 2) Toggle inscrição
  const handleInscricao = async () => {
    if (!token) {
      // redirecionar para login ou mostrar mensagem
      console.log("Usuário não autenticado");
      return;
    }
    if (loading) return;
    setLoading(true);

    const previous = ativo;
    const novo = !previous; // optimistic

    console.log(novo, "novo")
    setAtivo(novo);

    try {
      const res = await httpPost(`inscricao/${id}`, { ativo: novo }, token);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      setAtivo(Boolean(data.ativo)); // garante alinhamento com backend
    } catch (err) {
      console.log("Erro ao togglear inscrição:", err);
      setAtivo(previous); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: imagemURL }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 60,
              backgroundColor: "#f5f5f5",
              marginRight: 8,
            }}
          />
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>{titulo}</Text>
            {ong.id ? (
              <Pressable onPress={() => navigation.navigate("DetalheOng", { ongId: ong.id })}>
                <Text style={styles.ongLink}>{ong.nome || "ONG"}</Text>
                <Text style={styles.ongHint}>Toque para ver perfil da ONG</Text>
              </Pressable>
            ) : (
              <Text style={styles.ong}>{ong.nome || "ONG"}</Text>
            )}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Icone nome="location-outline" tamanho={16} color="#666" />
            <Text style={styles.infoText}>{localizacao}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icone nome="briefcase-outline" tamanho={16} color="#666" />
            <Text style={styles.infoText}>{tipoTrabalho}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icone nome="people-outline" tamanho={16} color="#666" />
            <Text style={styles.infoText}>{quantidade}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icone nome="time-outline" tamanho={16} color="#666" />
            <Text style={styles.infoText}>{duracao}</Text>
          </View>
        </View>

        <View style={styles.decricaoContainer}>
          <Text style={styles.labelDescricao}>Sobre essa oportunidade</Text>
          <Text style={styles.descricao}>{descricao}</Text>
        </View>

        <View style={styles.decricaoContainer}>
          <Text style={styles.labelDescricao}>Requisitos</Text>
          {requisitos?.map((item: any, index) => (
            <View key={index} style={styles.lista}>
              <Icone nome="ellipse" tamanho={8} color="#000" />
              <Text style={{ marginLeft: 8 }}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{status}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão fixo */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.botaoCandidatar, ativo ? { backgroundColor: "#008EFF" } : undefined]}
          onPress={handleInscricao}
          disabled={loading}
        >
          <Text style={styles.botaoText}>{ativo ? "Inscrito" : "Candidatar-se"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
