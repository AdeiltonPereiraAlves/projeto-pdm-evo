import Loading from "@/components/loading/Loading";
import CategoryFilter from "@/components/ui/CategoryFilter";
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

export type HomeNavigationProp = NativeStackNavigationProp<StackParamList, "Abas">;

export interface Vaga {
    id: string;
    titulo: string;
    nomeOng: string;
    imagemOng: string;
    areaAtuacao: string[];
    localizacao: string;
    data: string;
    descricao: string;
    tipoTrabalho: string;
    categoria: string;
    latitude: any,
    longitude:any
}

export default function Home() {
    const navigation = useNavigation<HomeNavigationProp>();
    const { token , usuario} = useContext(AuthContext);
    const { vagas, atualizarVagas, loading, carregarFotoPerfil, imagem } = useVagas(); // ✅ pega tudo do contexto

    const [vagasFiltradas, setVagasFiltradas] = useState<Vaga[]>([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [refreshing, setRefreshing] = useState(false);

    const categories = ["Todas", "Educação", "Saúde", "Meio Ambiente", "Social", "Tecnologia"];

    // Mapeamento: label do filtro → valores enum do backend (areaAtuacao)
    const CATEGORIA_PARA_ENUMS: Record<string, string[]> = {
        "Educação": ["EDUCACAO", "EDUCACAO_INFANTIL"],
        "Saúde": ["SAUDE", "SAUDE_MENTAL"],
        "Meio Ambiente": ["AMBIENTE", "DESENVOLVIMENTO_SUSTENTAVEL", "SEGURANCA_ALIMENTAR"],
        "Social": ["CULTURA", "DIREITOS_HUMANOS", "FOME", "POBREZA", "CRIANCA", "MULHER", "IGUALDADE", "IDOSO", "LGBTQIA", "REFUGIADOS", "JUSTICA_SOCIAL", "EMPODERAMENTO", "FAMILIA", "ANIMAL", "REABILITACAO", "VOLUNTARIADO", "ESPORTES", "ARTE", "EMPREGO", "INFRAESTRUTURA"],
        "Tecnologia": ["TECNOLOGIA", "TECNOLOGIA_SOCIAL"],
    };

    // Termos para busca por texto (título, descrição, etc.) quando categoria selecionada
    const TERMOS_CATEGORIA: Record<string, string[]> = {
        "Educação": ["educação", "educacao", "educar", "ensino", "escola"],
        "Saúde": ["saúde", "saude", "hospital", "medicina", "cuidados"],
        "Meio Ambiente": ["meio ambiente", "ambiente", "sustentável", "sustentavel", "natureza", "ecologia"],
        "Social": ["social", "comunidade", "assistência", "assistencia", "cultura", "direitos"],
        "Tecnologia": ["tecnologia", "tech", "digital", "informática", "informatica", "software", "dados"],
    };

    // Atualiza vagas ao carregar
    useEffect(() => {
        if(!vagas){
            loading
        }
        if (token) {
            atualizarVagas();
            console.log(vagas, "vagasFiltradas")
        }
        console.log(vagas, "vagasFiltradas")
    }, [token]);

    // Filtra vagas sempre que mudar o array ou filtros
    useEffect(() => {
        filtrarVagas();
        console.log(vagas, "vagasFiltradas")
    }, [vagas, searchText, selectedCategory]);

    const filtrarVagas = () => {
        let filtradas = vagas || [];

        // Filtro de categoria: areaAtuacao da ONG OU texto no título/descrição/nomeOng
        if (selectedCategory !== "Todas") {
            const enumsDaCategoria = CATEGORIA_PARA_ENUMS[selectedCategory] || [];
            const termosTexto = TERMOS_CATEGORIA[selectedCategory] || [selectedCategory.toLowerCase()];
            filtradas = filtradas.filter((vaga) => {
                // 1) ONG tem área de atuação que bate com a categoria
                const areas = (vaga.areaAtuacao || []) as string[];
                const bateArea = areas.some((area) => enumsDaCategoria.includes(area));
                // 2) OU título/descrição/nomeOng contém algum termo da categoria
                const titulo = (vaga.titulo || "").toLowerCase();
                const descricao = (vaga.descricao || "").toLowerCase();
                const nomeOng = (vaga.nomeOng || "").toLowerCase();
                const bateTexto = termosTexto.some((termo) =>
                    titulo.includes(termo) || descricao.includes(termo) || nomeOng.includes(termo)
                );
                return bateArea || bateTexto;
            });
        }

        // Filtro de texto na busca
        if (searchText.trim()) {
            const termo = searchText.toLowerCase().trim();
            filtradas = filtradas.filter((vaga) =>
                (vaga.titulo || "").toLowerCase().includes(termo) ||
                (vaga.nomeOng || "").toLowerCase().includes(termo) ||
                (vaga.descricao || "").toLowerCase().includes(termo)
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
        return <Loading message="Carregando vagas..." />;
    }

    return (
        <View style={styles.container}>
            {/* <HeaderHome
              
                nomeUsuario="Voluntário"
                imagem={usuario.imagem!} 
                onProfilePress={() => Alert.alert("Perfil", "Abrir perfil")}
                onNotificationPress={() => Alert.alert("Notificações", "Ver notificações")}
            /> */}
              

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
                            areaAtuacao={vaga.areaAtuacao || []}
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
