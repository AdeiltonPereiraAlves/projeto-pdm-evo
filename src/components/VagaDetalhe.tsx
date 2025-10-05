import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icone from "../components/shared/Icone";
import { vagaDetalhe } from "../screens/stack/DetalheVaga";
export default function VagaDetalhe({
  titulo,
  descricao,
  localizacao,
  tipoTrabalho,
  ong,

  quantidade,
  status,
  duracao,
}: vagaDetalhe) {
  const baseURL = "http://192.168.0.104:3001"
  const imagemURL = `${baseURL}/images/${ong.imagem}`;
  return (
    <View style={styles.container}>

      {/* Conteúdo rolável */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: imagemURL }}
            style={{ width: 100, height: 100, borderRadius: 60, backgroundColor: "#f5f5f5", marginRight: 8 }}
          />
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.ong}>{ong.nome || "ong"}</Text>
          </View>
          <View style={styles.favoritoContainer}>
            <Icone nome="heart-outline" tamanho={24} color="#666" />
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

        <Text style={styles.descricao}>{descricao}</Text>

        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{status}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão fixo no rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.botaoCandidatar}>
          <Text style={styles.botaoText}>Candidatar-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    marginBottom: 16,
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
  favoritoContainer: {
    padding: 4,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 15,
    color: "#444",
    marginLeft: 6,
  },
  descricao: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 16,
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
});
