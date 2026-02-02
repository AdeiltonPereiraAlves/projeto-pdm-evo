import Loading from "@/components/loading/Loading";
import InscricaoCard from '@/components/inscricoes/InscricaoCard';
import { AuthContext } from '@/data/context/AuthContext';
import useInscricoes from '@/data/hooks/useIncricoes';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from "expo-router";
import { useCallback, useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { HomeNavigationProp, Vaga } from './Home';


export default function Inscricoes() {
    const navigation = useNavigation<HomeNavigationProp>();
    const { token } = useContext(AuthContext);
    const { fetchInscricoes, cancelarInscricao } = useInscricoes();


    const [inscricoes, setInscricoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    const handleCancelar = async (id: string) => {
        await cancelarInscricao(id, token!);

        setInscricoes(prev =>
            prev.filter(inscricao => inscricao.id !== id)
        );
    };

    async function carregarIncricoes() {
        const res = await fetchInscricoes(token!);
        setInscricoes(res);
        setLoading(false);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        carregarIncricoes()
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (!token) return;
            carregarIncricoes();
        }, [token])
    );
    const handleVagaPress = (vaga: Vaga) => {
        navigation.navigate("DetalheVaga", { vagaId: vaga.id });
    };
    if (loading) {
        return <Loading message="Carregando inscrições..." />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minhas Inscrições</Text>

            <FlatList
                data={inscricoes}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }: any) => (
                    <InscricaoCard
                        titulo={item.vaga?.titulo}
                        status={item.status}
                        localizacao={item.vaga?.localizacao}
                        onPress={() => handleVagaPress(item.vaga)}
                        onCancelar={() =>
                            handleCancelar(item.id)
                        }
                    />
                )}
                refreshing={refreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    inscricoes.length === 0 && styles.emptyContainer
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Você ainda não possui inscrições
                    </Text>
                }
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 16,
    },
    title: {
        marginTop: 50,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A1A1A',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
