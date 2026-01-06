// import VagaCardSimple from "@/components/vagas/vagaOng/VagaCardSimple";
// import { AuthContext } from "@/data/context/AuthContext";
// import { useVagas } from "@/data/context/VagaContext";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { useNavigation } from "expo-router";
// import React, { useContext, useEffect, useState } from "react";
// import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

// type StackParamList = {
//     Abas: undefined;
//     DetalheVaga: { vagaId: string };
// };

// export type HomeNavigationProp = NativeStackNavigationProp<StackParamList, "Abas">;

// export interface Vaga {
//     id: string;
//     titulo: string;
//     nomeOng: string;
//     imagemOng: string;
//     areaAtuacao: [];
//     localizacao: string;
//     data: string;
//     descricao: string;
//     tipoTrabalho: string;
//     categoria: string;
//     latitude: any,
//     longitude:any
// }

// export default function VagasOng() {
//     const navigation = useNavigation<HomeNavigationProp>();
//     const { token , usuario} = useContext(AuthContext);
//     const { vagas, atualizarVagas, loading, carregarFotoPerfil, imagem,vagasOng } = useVagas(); // ✅ pega tudo do contexto

//     const [vagasFiltradas, setVagasFiltradas] = useState<Vaga[]>([]);
//     const [searchText, setSearchText] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("Todas");
//     const [refreshing, setRefreshing] = useState(false);

//     const categories = ["Todas", "Educação", "Saúde", "Meio Ambiente", "Social", "Tecnologia"];

//     // Atualiza vagas ao carregar
//     useEffect(() => {
//           console.log(vagasOng, "vagasOng No componente")
//         if (token) {

//             atualizarVagas();
//             console.log(vagasOng, "vagasFiltradas")
//         }

//     }, [token]);

//     // Filtra vagas sempre que mudar o array ou filtros
//     useEffect(() => {
//         filtrarVagas();

//     }, [vagasOng, searchText, selectedCategory]);

//     const filtrarVagas = () => {
//         let filtradas = vagasOng;
//          console.log(filtradas, "filtradas")
//         // Filtro de categoria
//         if (selectedCategory !== "Todas") {
//             filtradas = filtradas.filter(vaga => vaga.categoria === selectedCategory);
//         }

//         // Filtro de texto (opcional)
//         if (searchText) {
//             filtradas = filtradas.filter(vaga =>
//                 vaga.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
//                 vaga.nomeOng.toLowerCase().includes(searchText.toLowerCase()) ||
//                 vaga.descricao.toLowerCase().includes(searchText.toLowerCase())
//             );
//         }

//         setVagasFiltradas(filtradas);
//     };

//     const onRefresh = async () => {
//         setRefreshing(true);
//         await atualizarVagas();
//         setRefreshing(false);
//     };

//     const onVerInscricoes = (vaga: Vaga) => {
//         navigation.navigate("DetalheVaga", { vagaId: vaga.id }); /// fazer depois
//     };



//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <Text style={styles.loadingText}>Carregando vagas...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* <HeaderHome

//                 nomeUsuario="Voluntário"
//                 imagem={usuario.imagem!} 
//                 onProfilePress={() => Alert.alert("Perfil", "Abrir perfil")}
//                 onNotificationPress={() => Alert.alert("Notificações", "Ver notificações")}
//             /> */}


//             {/* <SearchBar
//                 value={searchText}
//                 onChangeText={setSearchText}
//                 onFilterPress={() => Alert.alert("Filtros", "Abrir filtros avançados")}
//             />

//             <CategoryFilter
//                 categories={categories}
//                 selectedCategory={selectedCategory}
//                 onCategorySelect={setSelectedCategory}
//             /> */}

//             <ScrollView
//                 style={styles.scrollView}
//                 refreshControl={
//                     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//                 }
//             >
//                 {vagasFiltradas.length === 0 ? (
//                     <View style={styles.emptyContainer}>
//                         <Text style={styles.emptyText}>
//                             {searchText || selectedCategory !== "Todas"
//                                 ? "Nenhuma vaga encontrada com os filtros aplicados"
//                                 : "Nenhuma vaga disponível no momento"
//                             }
//                         </Text>
//                     </View>
//                 ) : (
//                     vagasOng.map((vaga: any) => (
//                         <VagaCardSimple
//                             key={vaga.id}
//                             id={vaga.id}
//                             titulo= {vaga.titulo}
//                              status = {vaga.status}

//                               onPress={()=>  onVerInscricoes(vaga)}

//                         />
//                     ))
//                 )}
//             </ScrollView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f5f5f5', marginTop: 100 },
//     loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
//     loadingText: { fontSize: 16, color: '#666' },
//     scrollView: { flex: 1 },
//     emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50, paddingHorizontal: 20 },
//     emptyText: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24 },
// });


//

import { Alert } from 'react-native';

import { AuthContext } from "@/data/context/AuthContext";
import { useVagas } from "@/data/context/VagaContext";
import useAPI from "@/data/hooks/useAPI";
import { RootStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import VagaCardSimple from "../../../components/vagas/vagaOng/VagaCardSimple";

type NavProp = StackNavigationProp<RootStackParamList>;
type Vaga = { id: string; titulo: string; status: string; inscricoes?: any[] };

export default function VagasOng() {
  const { token } = useContext(AuthContext);
  const { httpGet } = useAPI(); // mantido caso queira usar futuramente
  const navigation = useNavigation<NavProp>();
  const { vagasOng, listarVagasOng } = useVagas();

  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza lista local com o contexto sempre que vagasOng mudar
  useEffect(() => {
    try {
        console.log(vagasOng, "VagasOng useEffect")
      setError(null);
      setVagas(Array.isArray(vagasOng) ? vagasOng : []);
    } catch (e) {
      console.error("VagasOng useEffect:", e);
      setError("Erro ao carregar vagas");
      setVagas([]);
    } finally {
      setLoading(false);
    }
  }, [vagasOng]);

  // Refresh: tenta atualizar via contexto se disponível
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (typeof listarVagasOng === "function") {
        await listarVagasOng(token!);
      } else {
        // fallback: apenas re-sincroniza com o contexto
        setVagas(Array.isArray(vagasOng) ? vagasOng : []);
      }
    } catch (e) {
      console.error("onRefresh:", e);
      setError("Erro ao atualizar vagas");
    } finally {
      setRefreshing(false);
    }
  }, [listarVagasOng, vagasOng]);
  

   const handleVerVaga = (vagaId: string) => {
    navigation.navigate("DetalheVagaOng", { vagaId });
  };

  const handleVerInscricoes = (vaga: Vaga) => {
    if (!vaga.inscricoes || vaga.inscricoes.length === 0) {
      Alert.alert(
        "Sem inscrições",
        "Esta vaga ainda não possui candidaturas.",
        [{ text: "OK" }]
      );
      return;
    }
   navigation.navigate("InscricoesScreen", {
      vagaId: vaga.id,
      vagaTitulo: vaga.titulo,
      inscricoes: vaga.inscricoes
    });
  };
   const renderItem = ({ item }: { item: Vaga }) => (
    <VagaCardSimple
      id={item.id}
      titulo={item.titulo}
      status={item.status}
      inscricoesCount={item.inscricoes || []}
      onPress={() => handleVerVaga(item.id)}
      onVerInscricoes={() => handleVerInscricoes(item)}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#295CA9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => {
            setLoading(true);
            setError(null);
            // tenta re-sincronizar
            if (typeof atualizarVagas === "function") {
              atualizarVagas().finally(() => setLoading(false));
            } else {
              setVagas(Array.isArray(vagasOng) ? vagasOng : []);
              setLoading(false);
            }
          }}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={vagas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={vagas.length === 0 ? styles.emptyContainer : undefined}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#295CA9" />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhuma vaga encontrada</Text>
            <Text style={styles.hintText}>Crie uma nova vaga para que ela apareça aqui.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16, marginTop: 200 },
  errorText: { color: "#B91C1C", marginBottom: 12, fontWeight: "600" },
  retryBtn: { backgroundColor: "#295CA9", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: "#fff", fontWeight: "700" },
  emptyContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  emptyBox: { alignItems: "center" },
  emptyText: { color: "#6B7280", fontSize: 16, marginBottom: 8 },
  hintText: { color: "#9CA3AF", fontSize: 13 },
});
