
import CategoryFilter from "@/src/components/ui/CategoryFilter";
import HeaderHome from "@/src/components/ui/HeaderHome";
import SearchBar from "@/src/components/ui/SearchBar";
import VagaCard from "@/src/components/ui/VagaCard";
import { AuthContext } from "@/src/data/context/AuthContext";
import useAPI from "@/src/data/hooks/useAPI";
import React, { useContext, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

interface Vaga {
    id: string;
    titulo: string;
    ong: {
        nome: string;
        imagem: string;
        areaAtuacao: string[];
    };
    localizacao: string;
    data: string;
    descricao: string;
    tipoTrabalho:string;
    categoria: string;
}

export default function Home() {
    const { token, tipoUsuario, loading, logout } = useContext(AuthContext);
    const { listarVagas } = useAPI();
    
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [vagasFiltradas, setVagasFiltradas] = useState<Vaga[]>([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [refreshing, setRefreshing] = useState(false);
    const [loadingVagas, setLoadingVagas] = useState(true);

    const categories = ["Todas", "Educação", "Saúde", "Meio Ambiente", "Social", "Tecnologia"];

    useEffect(() => {
        if (token) {
            carregarVagas();
        }
    }, [token]);

    useEffect(() => {
        filtrarVagas();
    }, [vagas, searchText, selectedCategory]);
  // formatar data
  function formatarData(data:any){
    const dataFormatada = new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return dataFormatada
  }
    const carregarVagas = async () => {
        try {
            setLoadingVagas(true);
            if (!token) {
                throw new Error("Token não disponível");
            }
            const response = await listarVagas(token);
            console.log("Vagas carregadas:", response);
            
            // Verificar se a resposta é um array
            if (!Array.isArray(response)) {
                console.warn("Resposta da API não é um array:", response);
                setVagas([]);
                return;
            }
            
            // Transformar os dados do backend para o formato esperado
            const vagasFormatadas = response.map((vaga: any) => {
                // Verificar se vaga existe e tem propriedades básicas
                if (!vaga || typeof vaga !== 'object') {
                    console.warn("Vaga inválida encontrada:", vaga);
                    return null;
                }
                
                return {
                    id: vaga.id || vaga._id || Math.random().toString(),
                    titulo: vaga.titulo || vaga.nome || "Vaga sem título",
                    ong: {
                        nome: vaga.ong?.nome || vaga.organizacao || "ONG",
                        areaAtuacao: Array.isArray(vaga.ong?.areaAtuacao) 
                            ? vaga.ong.areaAtuacao 
                            : Array.isArray(vaga.areaAtuacao) 
                                ? vaga.areaAtuacao 
                                : ["Geral"],
                        imagem: vaga.ong.imagem        
                    },
                    
                    localizacao: vaga.localizacao || vaga.endereco || "Local não informado",
                    data: formatarData(vaga.createdAt),
                    descricao: vaga.descricao || vaga.detalhes || "Descrição não disponível",
                    tipoTrabalho: vaga.tipoTrabalho || "Não informado",
                    categoria: vaga.categoria || "Geral"
                };
            }).filter(vaga => vaga !== null); // Remover vagas inválidas
            
            setVagas(vagasFormatadas);
        } catch (error) {
            console.error("Erro ao carregar vagas:", error);
            Alert.alert("Erro", "Não foi possível carregar as vagas. Tente novamente.");
            setVagas([]); // Definir array vazio em caso de erro
        } finally {
            setLoadingVagas(false);
        }
    };

    const filtrarVagas = () => {
        let filtradas = vagas;

        // Filtrar por texto de busca
        if (searchText) {
            filtradas = filtradas.filter(vaga =>
                vaga.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
                vaga.ong.nome.toLowerCase().includes(searchText.toLowerCase()) ||
                vaga.descricao.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filtrar por categoria
        if (selectedCategory !== "Todas") {
            filtradas = filtradas.filter(vaga =>
                vaga.categoria === selectedCategory
            );
        }

        setVagasFiltradas(filtradas);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await carregarVagas();
        setRefreshing(false);
    };

    const handleVagaPress = (vaga: Vaga) => {
        Alert.alert("Vaga", `Detalhes da vaga: ${vaga.titulo}`);
    };

    const handleCandidatar = (vaga: Vaga) => {
        Alert.alert("Candidatura", `Candidatura enviada para: ${vaga.titulo}`);
    };

    if (loadingVagas) {
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
                    vagasFiltradas.map((vaga) => (
                        <VagaCard
                            key={vaga.id}
                            titulo={vaga.titulo}
                            ong={vaga.ong.nome}
                            localizacao={vaga.localizacao}
                            data={vaga.data}
                            descricao={vaga.descricao}
                            tag={vaga.tipoTrabalho }
                            onPress={() => handleVagaPress(vaga)}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    scrollView: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
})