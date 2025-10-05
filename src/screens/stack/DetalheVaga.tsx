import BotaoVoltar from "@/components/ui/BotaoVoltar";
import VagaDetalhe from "@/components/vagas/VagaDetalhe";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../stack/index"; // ou caminho correto

type DetalheVagaNavigationProp = NativeStackNavigationProp<RootStackParamList, "DetalheVaga">;
type DetalheVagaRouteProp = RouteProp<{ DetalheVaga: { vagaId: string } }, "DetalheVaga">;
export type vagaDetalhe = {
    titulo: string;
    descricao: string;
    localizacao: string;
    tipoTrabalho: string;
    ong: { nome: string; imagem: string }; // ✅ aqui sim
    quantidade: number;
    status: string;
    duracao: string;
  };

export default function DetalheVaga() {
    const navigation = useNavigation<DetalheVagaNavigationProp>();
    const route = useRoute<DetalheVagaRouteProp>();
    const [vaga, setVaga] = useState<vagaDetalhe>()
    const { vagaId } = route.params;
    const { token } = useContext(AuthContext)
    const { httpGet } = useAPI()

    useEffect(() => {
        const fetchVaga = async () => {
            const vaga = await httpGet(`buscar/vaga/${vagaId}`, token!);

            console.log(vaga, "vaga")
            setVaga(vaga);
        };
        fetchVaga();
    }, [vagaId]);

    return (
        <View style={styles.container}>
          
            <View style={styles.containerVaga}>
         
            {vaga ? (
                <>
                    {/* <Text >Título: {vaga.titulo}</Text>
                    <Text>Descrição: {vaga.descricao}</Text>
                    <Text>Localização: {vaga.localizacao}</Text>
                    <Text>Tipo de Trabalho: {vaga.tipoTrabalho}</Text>
                    <Text>ONG: {vaga.ong?.nome}</Text>
                    <Text>Quantidade de vagas: {vaga.quantidade}</Text>
                    <Text>Status: {vaga.status}</Text>
                    <Text>Duração: {vaga.duracao}</Text> */}
                      <BotaoVoltar/>
                     <VagaDetalhe titulo={vaga.titulo} descricao={vaga.descricao} localizacao={vaga.localizacao} ong={vaga.ong}
                     tipoTrabalho={vaga.tipoTrabalho} quantidade={vaga.quantidade} status={vaga.status} duracao={vaga.duracao}
                      
                     />
                </>
            ) : (
                <Text>Carregando vaga...</Text>
            )}
            </View>
          </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop:80,
      justifyContent:"flex-start"
    },
    containerVaga: {
      flex: 1,
      padding: 16, // padding mais suave
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#eeeeeeff',
    }
  })
