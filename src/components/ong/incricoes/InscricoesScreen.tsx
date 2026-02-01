// // InscricoesScreen.tsx
// import InscricaoItem from '@/components/ong/incricoes/InscricaoItem'; // Componente que vamos criar
// import Icone from '@/components/shared/Icone';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import React, { useState } from 'react';
// import {
//   Alert,
//   FlatList,
//   RefreshControl,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';

// type RootStackParamList = {
//   InscricoesScreen: {
//     vagaId: string;
//     vagaTitulo: string;
//     inscricoes: any[];
//   };
// };

// type InscricoesScreenRouteProp = RouteProp<RootStackParamList, 'InscricoesScreen'>;

// interface Inscricao {
//   id: string;
//   ativo: boolean;
//   status: 'pendente' | 'aprovado' | 'rejeitado' | 'cancelado';
//   voluntario: {
//     id: string;
//     nome: string;
//     email: string;
//     imagem?: string;
//     contato?: string;
//     habilidades?: string[];
//     interesses?: string[];
//   };
//   dataInscricao?: string;
//   mensagem?: string;
// }

// export default function InscricoesScreen() {
//   const navigation = useNavigation();
//   const route = useRoute<InscricoesScreenRouteProp>();
  
//    const { vagaId, vagaTitulo, inscricoes: inscricoesIniciais } = route.params;

 
//   const [inscricoes, setInscricoes] = useState<Inscricao[]>(inscricoesIniciais || []);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [filter, setFilter] = useState<'all' | 'pendente' | 'aceito' | 'recusado'>('all');

//   // Filtrar inscrições com base no status selecionado
//   const filteredInscricoes = inscricoes.filter(inscricao => {
//     if (filter === 'all') return true;
//     return inscricao.status === filter;
//   });

//   // Contar inscrições por status
//   const contarPorStatus = (status: string) => {
//     return inscricoes.filter(i => i.status === status).length;
//   };

//   // Função para atualizar status de uma inscrição
//   const atualizarStatus = async (inscricaoId: string, novoStatus: string) => {
//     try {
//       setLoading(true);
      
//       // Aqui você faria a chamada API para atualizar o status
//       // Exemplo: await httpPut(`inscricoes/${inscricaoId}/status`, { status: novoStatus }, token);
      
//       // Atualiza localmente enquanto a API responde
//       setInscricoes(prev => prev.map(inscricao => 
//         inscricao.id === inscricaoId 
//           ? { ...inscricao, status: novoStatus as any }
//           : inscricao
//       ));
      
//       Alert.alert('Sucesso', `Status atualizado para ${novoStatus}`);
//     } catch (error) {
//       console.error('Erro ao atualizar status:', error);
//       Alert.alert('Erro', 'Não foi possível atualizar o status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Função para carregar inscrições (se necessário buscar do servidor)
//   const carregarInscricoes = async () => {
//     try {
//       setRefreshing(true);
//       // Se precisar buscar do servidor:
//       // const response = await httpGet(`vagas/${vagaId}/inscricoes`, token);
//       // setInscricoes(response.inscricoes || []);
//     } catch (error) {
//       console.error('Erro ao carregar inscrições:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // Componente de filtro
//   const renderFiltros = () => (
//     <View style={styles.filtrosContainer}>
//       <TouchableOpacity
//         style={[styles.filtroButton, filter === 'all' && styles.filtroButtonActive]}
//         onPress={() => setFilter('all')}
//       >
//         <Text style={[styles.filtroText, filter === 'all' && styles.filtroTextActive]}>
//           Todas ({inscricoes.length})
//         </Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity
//         style={[styles.filtroButton, filter === 'pendente' && styles.filtroButtonActive]}
//         onPress={() => setFilter('pendente')}
//       >
//         <Text style={[styles.filtroText, filter === 'pendente' && styles.filtroTextActive]}>
//           Pendentes ({contarPorStatus('pendente')})
//         </Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity
//         style={[styles.filtroButton, filter === 'aceito' && styles.filtroButtonActive]}
//         onPress={() => setFilter('aceito')}
//       >
//         <Text style={[styles.filtroText, filter === 'aceito' && styles.filtroTextActive]}>
//           Aceitas ({contarPorStatus('aceito')})
//         </Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity
//         style={[styles.filtroButton, filter === 'recusado' && styles.filtroButtonActive]}
//         onPress={() => setFilter('recusado')}
//       >
//         <Text style={[styles.filtroText, filter === 'recusado' && styles.filtroTextActive]}>
//           Recusadas ({contarPorStatus('recusado')})
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // Componente de item da lista
//   // const renderItem = ({ item }: { item: Inscricao }) => (
//   //   <InscricaoItem
//   //     inscricao={item}
//   //     onStatusChange={atualizarStatus}
//   //     loading={loading}
//   //   />
//   // );
//   const handleStatusChange = (inscricaoId: string, novoStatus: string) => {
//     setInscricoes(prev => prev.map(inscricao => 
//       inscricao.id === inscricaoId 
//         ? { ...inscricao, status: novoStatus as any }
//         : inscricao
//     ));
//   };

//   // Componente de item da lista
//   const renderItem = ({ item }: { item: Inscricao }) => (

//     console.log('Rendering InscricaoItem for:', item),
//     <InscricaoItem
//       inscricao={item}
//       vagaId={vagaId} 
//       onStatusChange={handleStatusChange}
//       loading={loading}
//     />
//   );
//   // Tela vazia
//   const renderEmpty = () => (
//     <View style={styles.emptyContainer}>
//       <Icone nome="people-outline" tamanho={64} color="#D1D5DB" />
//       <Text style={styles.emptyTitle}>
//         {filter === 'all' ? 'Nenhuma inscrição' : `Nenhuma inscrição ${filter}`}
//       </Text>
//       <Text style={styles.emptyText}>
//         {filter === 'all' 
//           ? 'Esta vaga ainda não possui candidaturas.' 
//           : `Não há candidaturas com status "${filter}".`
//         }
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Icone nome="arrow-back" tamanho={24} color="#1A1A1A" />
//         </TouchableOpacity>
        
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.headerTitle}>Candidaturas</Text>
//           <Text style={styles.headerSubtitle} numberOfLines={1}>
//             {vagaTitulo}
//           </Text>
//         </View>
        
//         <View style={styles.headerRight} />
//       </View>

//       {/* Estatísticas */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statItem}>
//           <Text style={styles.statNumber}>{inscricoes.length}</Text>
//           <Text style={styles.statLabel}>Total</Text>
//         </View>
        
//         <View style={styles.statDivider} />
        
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
//             {contarPorStatus('pendente')}
//           </Text>
//           <Text style={styles.statLabel}>Pendentes</Text>
//         </View>
        
//         <View style={styles.statDivider} />
        
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: '#10B981' }]}>
//             {contarPorStatus('aceito')}
//           </Text>
//           <Text style={styles.statLabel}>Aceitas</Text>
//         </View>
        
//         <View style={styles.statDivider} />
        
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: '#EF4444' }]}>
//             {contarPorStatus('recusado')}
//           </Text>
//           <Text style={styles.statLabel}>Recusadas</Text>
//         </View>
//       </View>

//       {/* Filtros */}
//       {renderFiltros()}

//       {/* Lista de inscrições */}
//       <FlatList
//         data={filteredInscricoes}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={renderEmpty}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={carregarInscricoes}
//             colors={['#295CA9']}
//           />
//         }
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitleContainer: {
//     flex: 1,
//     marginHorizontal: 12,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//     textAlign: 'center',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginTop: 2,
//   },
//   headerRight: {
//     width: 32,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     paddingVertical: 16,
//     paddingHorizontal: 8,
//     marginTop: 8,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   statDivider: {
//     width: 1,
//     backgroundColor: '#E5E7EB',
//     marginHorizontal: 8,
//   },
//   filtrosContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   filtroButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginRight: 8,
//     backgroundColor: '#F3F4F6',
//   },
//   filtroButtonActive: {
//     backgroundColor: '#295CA9',
//   },
//   filtroText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#6B7280',
//   },
//   filtroTextActive: {
//     color: '#fff',
//   },
//   listContainer: {
//     flexGrow: 1,
//     padding: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 80,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#6B7280',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     lineHeight: 20,
//     paddingHorizontal: 32,
//   },
// });

////////////////////////////////////////////////////////////////////////////





// InscricoesScreen.tsx
import InscricaoItem from '@/components/ong/incricoes/InscricaoItem';
import Icone from '@/components/shared/Icone';
import { AuthContext } from '@/data/context/AuthContext';
import useAPI from '@/data/hooks/useAPI';
import { useFocusEffect } from '@react-navigation/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type RootStackParamList = {
  InscricoesScreen: {
    vagaId: string;
    vagaTitulo: string;
    inscricoes: any[];
  };
};

type InscricoesScreenRouteProp = RouteProp<RootStackParamList, 'InscricoesScreen'>;

interface Inscricao {
  id: string;
  ativo: boolean;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'cancelado';
  voluntario: {
    id: string;
    nome: string;
    email: string;
    imagem?: string;
    contato?: string;
    habilidades?: string[];
    interesses?: string[];
  };
  dataInscricao?: string;
  mensagem?: string;
}

export default function InscricoesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<InscricoesScreenRouteProp>();
  const { token } = useContext(AuthContext);
  const { httpGet } = useAPI();
  
  const { vagaId, vagaTitulo, inscricoes: inscricoesIniciais } = route.params;

  const [inscricoes, setInscricoes] = useState<Inscricao[]>(inscricoesIniciais || []);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Refetch inscricoes do servidor sempre que a tela ganhar foco (evita dados desatualizados)
  const carregarInscricoes = useCallback(async () => {
    if (!token || !vagaId) return;
    try {
      setRefreshing(true);
      const response = await httpGet(`inscricoes/ong/${vagaId}`, token);
      const lista = Array.isArray(response) ? response : (response?.inscricoes || response);
      setInscricoes(lista || []);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
    } finally {
      setRefreshing(false);
    }
  }, [token, vagaId, httpGet]);

  useFocusEffect(
    useCallback(() => {
      carregarInscricoes();
    }, [carregarInscricoes])
  );

  // Função para atualizar status de uma inscrição (atualização otimista local + refetch)
  const handleStatusChange = (inscricaoId: string, novoStatus: string) => {
    setInscricoes(prev => prev.map(inscricao => 
      inscricao.id === inscricaoId 
        ? { ...inscricao, status: novoStatus as any }
        : inscricao
    ));
  };

  // Componente de item da lista
  const renderItem = ({ item }: { item: Inscricao }) => (
    <InscricaoItem
      inscricao={item}
      vagaId={vagaId}
      onStatusChange={handleStatusChange}
      onVerPerfilVoluntario={(voluntarioId) => navigation.navigate("DetalheVoluntario", { voluntarioId })}
      loading={loading}
    />
  );

  // Tela vazia
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icone nome="people-outline" tamanho={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>Nenhuma candidatura</Text>
      <Text style={styles.emptyText}>Esta vaga ainda não possui candidaturas.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icone nome="arrow-back" tamanho={24} color="#1A1A1A" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Candidaturas</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {vagaTitulo}
          </Text>
        </View>
        
        <View style={styles.headerRight} />
      </View>

      {/* Lista de inscrições */}
      <FlatList
        data={inscricoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={carregarInscricoes}
            colors={['#295CA9']}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  headerRight: {
    width: 32,
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
});