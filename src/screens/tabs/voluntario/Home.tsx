import CategoryFilter from "@/components/ui/CategoryFilter";
import HeaderHome from "@/components/ui/HeaderHome";
import SearchBar from "@/components/ui/SearchBar";
import VagaCard from "@/components/vagas/VagaCard";
import { AuthContext } from "@/data/context/AuthContext";
import { useVagas } from "@/data/context/VagaContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

type StackParamList = {
    Abas: undefined;
    DetalheVaga: { vagaId: string };
};

type HomeNavigationProp = NativeStackNavigationProp<StackParamList, "Abas">;

export interface Vaga {
    id: string;
    titulo: string;
    nomeOng: string;
    imagemOng: string;
    areaAtuacao: [];
    localizacao: string;
    data: string;
    descricao: string;
    tipoTrabalho: string;
    categoria: string;
}

export default function Home() {
    const navigation = useNavigation<HomeNavigationProp>();
    const { token } = useContext(AuthContext);
    const { vagas, atualizarVagas, loading } = useVagas(); // ✅ pega tudo do contexto

    const [vagasFiltradas, setVagasFiltradas] = useState<Vaga[]>([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [refreshing, setRefreshing] = useState(false);

    const categories = ["Todas", "Educação", "Saúde", "Meio Ambiente", "Social", "Tecnologia"];

    // Atualiza vagas ao carregar
    useEffect(() => {
        if (token) {
            atualizarVagas();
        }
    }, [token]);

    // Filtra vagas sempre que mudar o array ou filtros
    useEffect(() => {
        filtrarVagas();
    }, [vagas, searchText, selectedCategory]);

    const filtrarVagas = () => {
        let filtradas = vagas;

        // Filtro de categoria
        if (selectedCategory !== "Todas") {
            filtradas = filtradas.filter(vaga => vaga.categoria === selectedCategory);
        }

        // Filtro de texto (opcional)
        if (searchText) {
            filtradas = filtradas.filter(vaga =>
                vaga.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
                vaga.nomeOng.toLowerCase().includes(searchText.toLowerCase()) ||
                vaga.descricao.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setVagasFiltradas(filtradas);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await atualizarVagas();
        setRefreshing(false);
    };

    const handleVagaPress = (vaga: Vaga) => {
        navigation.navigate("DetalheVaga", { vagaId: vaga.id });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando vagas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderHome
                nomeUsuario="Voluntário"
                onProfilePress={() => Alert.alert("Perfil", "Abrir perfil")}
                onNotificationPress={() => Alert.alert("Notificações", "Ver notificações")}
            />

            <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onFilterPress={() => Alert.alert("Filtros", "Abrir filtros avançados")}
            />

            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
            />

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {vagasFiltradas.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchText || selectedCategory !== "Todas"
                                ? "Nenhuma vaga encontrada com os filtros aplicados"
                                : "Nenhuma vaga disponível no momento"
                            }
                        </Text>
                    </View>
                ) : (
                    vagasFiltradas.map((vaga: Vaga) => (
                        <VagaCard
                            key={vaga.id}
                            titulo={vaga.titulo}
                            nomeOng={vaga.nomeOng || "ONG"}
                            imagemOng={vaga.imagemOng}
                            areaAtuacao={vaga.areaAtuacao}
                            localizacao={vaga.localizacao}
                            data={vaga.data}
                            descricao={vaga.descricao}
                            tag={vaga.tipoTrabalho}
                            onPress={() => handleVagaPress(vaga)}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    loadingText: { fontSize: 16, color: '#666' },
    scrollView: { flex: 1 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50, paddingHorizontal: 20 },
    emptyText: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24 },
});
