// // InscricaoItem.tsx
// import Icone from '@/components/shared/Icone';
// import { AuthContext } from '@/data/context/AuthContext';
// import useAPI from '@/data/hooks/useAPI';
// import React, { useContext, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// interface InscricaoItemProps {
//   inscricao: {
//     id: string;
//     ativo: boolean;
//     status: 'pendente' | 'aprovado' | 'rejeitado' | 'cancelado';
//     voluntario: {
//       id: string;
//       nome: string;
//       email: string;
//       imagem?: string;
//       contato?: string;
//       habilidades?: string[];
//       interesses?: string[];
//     };
//     dataInscricao?: string;
//     mensagem?: string;
//   };
//   vagaId: string; // ← Adicionado: ID da vaga
//   onStatusChange?: (inscricaoId: string, novoStatus: string) => void;
//   loading?: boolean;
// }

// const InscricaoItem: React.FC<InscricaoItemProps> = ({
//   inscricao,
//   vagaId, // ← Recebe o vagaId
//   onStatusChange,
//   loading = false,
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const { token } = useContext(AuthContext);
//   const { httpPatch } = useAPI();

//   const getStatusColor = (status: string, ativo: boolean) => {
//     if (!ativo) return '#9CA3AF';
//     switch (status) {
//       case 'aprovado': return '#10B981'; // Verde
//       case 'pendente': return '#F59E0B'; // Amarelo
//       case 'rejeitado': return '#EF4444'; // Vermelho
//       case 'cancelado': return '#6B7280'; // Cinza
//       default: return '#6B7280';
//     }
//   };

//   const getStatusText = (status: string, ativo: boolean) => {
    
//     switch (status) {
//       case 'aprovado': return 'Aprovado';
//       case 'pendente': return 'Pendente';
//       case 'rejeitado': return 'Rejeitado';
//       case 'cancelado': return 'Cancelado';
//       default: return status;
//     }
//   };

//   // Função para atualizar status via API
//   const atualizarStatus = async (acao: 'aprovar' | 'rejeitar') => {
//   if (!token) {
//     Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
//     return;
//   }

//   try {
//     setProcessing(true);
    
//     const dados = { 
//       status: acao === 'aprovar' ? 'aprovado' : 'rejeitado',
//       vagaId: vagaId
//     };
    
//     console.log(`Enviando PATCH para /aprovar/${vagaId}`, dados);
    
//     const response = await httpPatch(`aprovar/${vagaId}`, dados, token);
    
//     // Verifique se a resposta foi bem-sucedida
//     if (response.ok) {
//       // Agora faça o parse do JSON
//       let responseData;
//       try {
//         responseData = await response.json();
//         console.log('Resposta da API:', responseData);
//       } catch (jsonError) {
//         console.log('Resposta não é JSON ou está vazia');
//         // Se não for JSON, pode ser que a resposta seja apenas um status 200 OK sem corpo
//       }
      
//       // Chama a função de callback para atualizar o estado pai
//       if (onStatusChange) {
//         onStatusChange(inscricao.id, acao === 'aprovar' ? 'aprovado' : 'rejeitado');
//       }
      
//       Alert.alert('Sucesso', acao === 'aprovar' ? 'Candidatura aprovada!' : 'Candidatura rejeitada!');
//       setModalVisible(false);
//     } else {
//       // Tente ler a mensagem de erro
//       let errorMessage = 'Erro ao atualizar status';
//       try {
//         const errorData = await response.json();
//         errorMessage = errorData.message || errorMessage;
//       } catch {
//         // Se não for JSON, use o status text
//         errorMessage = `${response.status}: ${response.statusText}`;
//       }
      
//       throw new Error(errorMessage);
//     }
//   } catch (error: any) {
//     console.error('Erro ao atualizar status:', error);
//     Alert.alert('Erro', error.message || 'Não foi possível atualizar o status');
//   } finally {
//     setProcessing(false);
//   }
// };

//   const confirmarAcao = (acao: 'aprovar' | 'rejeitar') => {
//     const titulo = acao === 'aprovar' ? 'Aprovar Candidatura' : 'Rejeitar Candidatura';
//     const mensagem = acao === 'aprovar'
//       ? 'Tem certeza que deseja aprovar este voluntário para a vaga?'
//       : 'Tem certeza que deseja rejeitar esta candidatura?';
    
//     Alert.alert(
//       titulo,
//       mensagem,
//       [
//         { text: 'Cancelar', style: 'cancel' },
//         { 
//           text: 'Confirmar', 
//           onPress: () => atualizarStatus(acao),
//           style: 'destructive'
//         }
//       ]
//     );
//   };

//   return (
//     <>
//       <TouchableOpacity 
//         style={styles.card}
//         onPress={() => setModalVisible(true)}
//         disabled={loading}
//       >
//         <View style={styles.cardContent}>
//           <View style={styles.voluntarioInfo}>
//             {inscricao.voluntario.imagem ? (
//               <Image 
//                 source={{ uri: inscricao.voluntario.imagem }} 
//                 style={styles.avatar}
//               />
//             ) : (
//               <View style={styles.avatarPlaceholder}>
//                 <Text style={styles.avatarText}>
//                   {inscricao.voluntario.nome.charAt(0).toUpperCase()}
//                 </Text>
//               </View>
//             )}
            
//             <View style={styles.textContainer}>
//               <Text style={styles.nome} numberOfLines={1}>
//                 {inscricao.voluntario.nome}
//               </Text>
//               <Text style={styles.email} numberOfLines={1}>
//                 {inscricao.voluntario.email}
//               </Text>
//               {inscricao.voluntario.contato && (
//                 <Text style={styles.contato} numberOfLines={1}>
//                   {inscricao.voluntario.contato}
//                 </Text>
//               )}
//             </View>
//           </View>
          
//           <View style={styles.statusContainer}>
//             <View 
//               style={[
//                 styles.statusBadge,
//                 { backgroundColor: getStatusColor(inscricao.status, inscricao.ativo) }
//               ]}
//             >
//               <Text style={styles.statusText}>
//                 {getStatusText(inscricao.status, inscricao.ativo)}
//               </Text>
//             </View>
//           </View>
//         </View>
        
//         {inscricao.dataInscricao && (
//           <Text style={styles.data}>
//             Inscrito em: {new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR')}
//           </Text>
//         )}
//       </TouchableOpacity>

//       {/* Modal de detalhes */}
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             {/* Header do Modal */}
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Detalhes da Candidatura</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Icone nome="close-outline" tamanho={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalBody}>
//               {/* Informações do voluntário */}
//               <View style={styles.modalSection}>
//                 <Text style={styles.sectionTitle}>Voluntário</Text>
//                 <View style={styles.voluntarioModalInfo}>
//                   {inscricao.voluntario.imagem ? (
//                     <Image 
//                       source={{ uri: inscricao.voluntario.imagem }} 
//                       style={styles.modalAvatar}
//                     />
//                   ) : (
//                     <View style={styles.modalAvatarPlaceholder}>
//                       <Text style={styles.modalAvatarText}>
//                         {inscricao.voluntario.nome.charAt(0).toUpperCase()}
//                       </Text>
//                     </View>
//                   )}
//                   <View style={styles.modalVoluntarioText}>
//                     <Text style={styles.modalNome}>{inscricao.voluntario.nome}</Text>
//                     <Text style={styles.modalEmail}>{inscricao.voluntario.email}</Text>
//                     {inscricao.voluntario.contato && (
//                       <Text style={styles.modalContact}>
//                         📞 {inscricao.voluntario.contato}
//                       </Text>
//                     )}
//                   </View>
//                 </View>
//               </View>

//               {/* Status atual */}
//               <View style={styles.modalSection}>
//                 <Text style={styles.sectionTitle}>Status da Candidatura</Text>
//                 <View style={styles.statusModalContainer}>
//                   <View 
//                     style={[
//                       styles.statusModalBadge,
//                       { 
//                         backgroundColor: getStatusColor(inscricao.status, inscricao.ativo)
//                       }
//                     ]}
//                   >
//                     <Text style={styles.statusModalText}>
//                       {getStatusText(inscricao.status, inscricao.ativo)}
//                     </Text>
//                   </View>
//                   {!inscricao.ativo && (
//                     <Text style={styles.inactiveText}>Esta candidatura está inativa</Text>
//                   )}
//                 </View>
//               </View>

//               {/* Habilidades */}
//               {inscricao.voluntario.habilidades && 
//                inscricao.voluntario.habilidades.length > 0 && (
//                 <View style={styles.modalSection}>
//                   <Text style={styles.sectionTitle}>Habilidades</Text>
//                   <View style={styles.skillsContainer}>
//                     {inscricao.voluntario.habilidades.map((habilidade, index) => (
//                       <View key={index} style={styles.skillTag}>
//                         <Text style={styles.skillText}>{habilidade}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </View>
//               )}

//               {/* Interesses */}
//               {inscricao.voluntario.interesses && 
//                inscricao.voluntario.interesses.length > 0 && (
//                 <View style={styles.modalSection}>
//                   <Text style={styles.sectionTitle}>Interesses</Text>
//                   <View style={styles.skillsContainer}>
//                     {inscricao.voluntario.interesses.map((interesse, index) => (
//                       <View key={index} style={styles.interestTag}>
//                         <Text style={styles.interestText}>{interesse}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </View>
//               )}

//               {/* Mensagem (se houver) */}
//               {inscricao.mensagem && (
//                 <View style={styles.modalSection}>
//                   <Text style={styles.sectionTitle}>Mensagem do Candidato</Text>
//                   <View style={styles.messageContainer}>
//                     <Text style={styles.messageText}>{inscricao.mensagem}</Text>
//                   </View>
//                 </View>
//               )}

//               {/* Data de inscrição */}
//               {inscricao.dataInscricao && (
//                 <View style={styles.modalSection}>
//                   <Text style={styles.sectionTitle}>Data da Inscrição</Text>
//                   <Text style={styles.modalDateText}>
//                     {new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR', {
//                       weekday: 'long',
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </Text>
//                 </View>
//               )}
//             </ScrollView>

//             {/* Botões de ação - APENAS para inscrições pendentes */}
//             {inscricao.ativo && inscricao.status === 'pendente' && (
//               <View style={styles.modalActions}>
//                 <TouchableOpacity 
//                   style={[styles.actionButton, styles.rejectButton]}
//                   onPress={() => confirmarAcao('rejeitar')}
//                   disabled={processing}
//                 >
//                   {processing ? (
//                     <ActivityIndicator size="small" color="#EF4444" />
//                   ) : (
//                     <>
//                       <Icone nome="close-circle-outline" tamanho={20} color="#EF4444" />
//                       <Text style={styles.rejectButtonText}>Rejeitar</Text>
//                     </>
//                   )}
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                   style={[styles.actionButton, styles.acceptButton]}
//                   onPress={() => confirmarAcao('aprovar')}
//                   disabled={processing}
//                 >
//                   {processing ? (
//                     <ActivityIndicator size="small" color="#fff" />
//                   ) : (
//                     <>
//                       <Icone nome="checkmark-circle-outline" tamanho={20} color="#fff" />
//                       <Text style={styles.acceptButtonText}>Aprovar</Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   voluntarioInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   avatarPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#295CA9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   nome: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1A1A1A',
//     marginBottom: 2,
//   },
//   email: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 2,
//   },
//   contato: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   statusContainer: {
//     marginLeft: 8,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   statusText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   data: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginTop: 8,
//     fontStyle: 'italic',
//   },
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//     flex: 1,
//   },
//   modalBody: {
//     padding: 20,
//   },
//   modalSection: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   voluntarioModalInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   modalAvatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 16,
//   },
//   modalAvatarPlaceholder: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#295CA9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   modalAvatarText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   modalVoluntarioText: {
//     flex: 1,
//   },
//   modalNome: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//     marginBottom: 2,
//   },
//   modalEmail: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   modalContact: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   statusModalContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusModalBadge: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   statusModalText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   inactiveText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     fontStyle: 'italic',
//   },
//   skillsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   skillTag: {
//     backgroundColor: '#E5E7EB',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   skillText: {
//     fontSize: 14,
//     color: '#374151',
//   },
//   interestTag: {
//     backgroundColor: '#DBEAFE',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   interestText: {
//     fontSize: 14,
//     color: '#1E40AF',
//   },
//   messageContainer: {
//     backgroundColor: '#F9FAFB',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   messageText: {
//     fontSize: 14,
//     color: '#374151',
//     lineHeight: 20,
//   },
//   modalDateText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderRadius: 8,
//     gap: 8,
//   },
//   rejectButton: {
//     backgroundColor: '#FEF2F2',
//     borderWidth: 1,
//     borderColor: '#FCA5A5',
//   },
//   acceptButton: {
//     backgroundColor: '#295CA9',
//   },
//   rejectButtonText: {
//     color: '#EF4444',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   acceptButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default InscricaoItem;


////////////////////////////////////////////////////////////////////////////////////////////////////


// InscricaoItem.tsx
import Icone from '@/components/shared/Icone';
import { AuthContext } from '@/data/context/AuthContext';
import useAPI from '@/data/hooks/useAPI';
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface InscricaoItemProps {
  inscricao: {
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
  };
  vagaId: string;
  onStatusChange?: (inscricaoId: string, novoStatus: string) => void;
  onVerPerfilVoluntario?: (voluntarioId: string) => void;
  loading?: boolean;
}

const InscricaoItem: React.FC<InscricaoItemProps> = ({
  inscricao,
  vagaId,
  onStatusChange,
  onVerPerfilVoluntario,
  loading = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { token } = useContext(AuthContext);
  const { httpPatch } = useAPI();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return '#10B981'; // Verde
      case 'pendente': return '#F59E0B'; // Amarelo
      case 'rejeitado': return '#EF4444'; // Vermelho
      case 'cancelado': return '#6B7280'; // Cinza
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'pendente': return 'Pendente';
      case 'rejeitado': return 'Rejeitado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  // Função para atualizar status via API
  const atualizarStatus = async (acao: 'aprovar' | 'rejeitar') => {
    if (!token) {
      Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      return;
    }

    try {
      setProcessing(true);
      
      const novoStatus = acao === 'aprovar' ? 'aprovado' : 'rejeitado';
      const dados = { 
        status: novoStatus,
        vagaId: vagaId,
        inscricaoId: inscricao.id // Envia o ID da inscrição também
      };
      
      console.log(`Enviando PATCH para /aprovar/${vagaId}`, dados);
      
      // IMPORTANTE: O endpoint deve usar o ID da INSCRIÇÃO, não da vaga
      const response = await httpPatch(`aprovar/${vagaId}`, dados, token);
      
      // Verifique se a resposta foi bem-sucedida
      if (response.ok) {
        // Agora faça o parse do JSON
        let responseData;
        try {
          responseData = await response.json();
          console.log('Resposta da API:', responseData);
        } catch (jsonError) {
          console.log('Resposta não é JSON ou está vazia');
        }
        
        // Chama a função de callback para atualizar o estado pai
        if (onStatusChange) {
          onStatusChange(inscricao.id, novoStatus);
        }
        
        Alert.alert('Sucesso', acao === 'aprovar' ? 'Candidatura aprovada!' : 'Candidatura rejeitada!');
        setModalVisible(false);
      } else {
        // Tente ler a mensagem de erro
        let errorMessage = 'Erro ao atualizar status';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Se não for JSON, use o status text
          errorMessage = `${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      Alert.alert('Erro', error.message || 'Não foi possível atualizar o status');
    } finally {
      setProcessing(false);
    }
  };

  const confirmarAcao = (acao: 'aprovar' | 'rejeitar') => {
    const titulo = acao === 'aprovar' ? 'Aprovar Candidatura' : 'Rejeitar Candidatura';
    const statusAtual = getStatusText(inscricao.status);
    
    let mensagem = '';
    if (acao === 'aprovar') {
      mensagem = inscricao.status === 'aprovado' 
        ? 'Este voluntário já está aprovado. Deseja manter como aprovado?'
        : 'Tem certeza que deseja aprovar este voluntário para a vaga?';
    } else {
      mensagem = inscricao.status === 'rejeitado'
        ? 'Este voluntário já está rejeitado. Deseja manter como rejeitado?'
        : 'Tem certeza que deseja rejeitar esta candidatura?';
    }
    
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => atualizarStatus(acao),
          style: 'destructive'
        }
      ]
    );
  };

  // Determinar se os botões devem estar desabilitados
  const isAprovado = inscricao.status === 'aprovado';
  const isRejeitado = inscricao.status === 'rejeitado';
  const isCancelado = inscricao.status === 'cancelado';

  return (
    <>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => setModalVisible(true)}
        disabled={loading}
      >
        <View style={styles.cardContent}>
          <View style={styles.voluntarioInfo}>
            {inscricao.voluntario.imagem ? (
              <Image 
                source={{ uri: inscricao.voluntario.imagem }} 
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {inscricao.voluntario.nome.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            
            <View style={styles.textContainer}>
              {onVerPerfilVoluntario && inscricao.voluntario?.id ? (
                <Pressable onPress={() => onVerPerfilVoluntario(inscricao.voluntario.id)}>
                  <Text style={[styles.nome, styles.nomeLink]} numberOfLines={1}>
                    {inscricao.voluntario.nome}
                  </Text>
                  <Text style={styles.linkHint}>Toque para ver perfil</Text>
                </Pressable>
              ) : (
                <Text style={styles.nome} numberOfLines={1}>
                  {inscricao.voluntario.nome}
                </Text>
              )}
              <Text style={styles.email} numberOfLines={1}>
                {inscricao.voluntario.email}
              </Text>
              {inscricao.voluntario.contato && (
                <Text style={styles.contato} numberOfLines={1}>
                  {inscricao.voluntario.contato}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(inscricao.status) }
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(inscricao.status)}
              </Text>
            </View>
          </View>
        </View>
        
        {inscricao.dataInscricao && (
          <Text style={styles.data}>
            Inscrito em: {new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR')}
          </Text>
        )}
      </TouchableOpacity>

      {/* Modal de detalhes */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes da Candidatura</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icone nome="close-outline" tamanho={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Informações do voluntário */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Voluntário</Text>
                <View style={styles.voluntarioModalInfo}>
                  {inscricao.voluntario.imagem ? (
                    <Image 
                      source={{ uri: inscricao.voluntario.imagem }} 
                      style={styles.modalAvatar}
                    />
                  ) : (
                    <View style={styles.modalAvatarPlaceholder}>
                      <Text style={styles.modalAvatarText}>
                        {inscricao.voluntario.nome.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.modalVoluntarioText}>
                    {onVerPerfilVoluntario && inscricao.voluntario?.id ? (
                      <Pressable onPress={() => { setModalVisible(false); onVerPerfilVoluntario(inscricao.voluntario.id); }}>
                        <Text style={[styles.modalNome, styles.nomeLink]}>{inscricao.voluntario.nome}</Text>
                        <Text style={styles.linkHint}>Toque para ver perfil</Text>
                      </Pressable>
                    ) : (
                      <Text style={styles.modalNome}>{inscricao.voluntario.nome}</Text>
                    )}
                    <Text style={styles.modalEmail}>{inscricao.voluntario.email}</Text>
                    {inscricao.voluntario.contato && (
                      <Text style={styles.modalContact}>
                        📞 {inscricao.voluntario.contato}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Status atual */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Status da Candidatura</Text>
                <View style={styles.statusModalContainer}>
                  <View 
                    style={[
                      styles.statusModalBadge,
                      { 
                        backgroundColor: getStatusColor(inscricao.status)
                      }
                    ]}
                  >
                    <Text style={styles.statusModalText}>
                      {getStatusText(inscricao.status)}
                    </Text>
                  </View>
                  {!inscricao.ativo && (
                    <Text style={styles.inactiveText}>Esta candidatura está inativa</Text>
                  )}
                </View>
              </View>

              {/* Habilidades */}
              {inscricao.voluntario.habilidades && 
               inscricao.voluntario.habilidades.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Habilidades</Text>
                  <View style={styles.skillsContainer}>
                    {inscricao.voluntario.habilidades.map((habilidade, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{habilidade}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Interesses */}
              {inscricao.voluntario.interesses && 
               inscricao.voluntario.interesses.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Interesses</Text>
                  <View style={styles.skillsContainer}>
                    {inscricao.voluntario.interesses.map((interesse, index) => (
                      <View key={index} style={styles.interestTag}>
                        <Text style={styles.interestText}>{interesse}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Mensagem (se houver) */}
              {inscricao.mensagem && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Mensagem do Candidato</Text>
                  <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{inscricao.mensagem}</Text>
                  </View>
                </View>
              )}

              {/* Data de inscrição */}
              {inscricao.dataInscricao && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Data da Inscrição</Text>
                  <Text style={styles.modalDateText}>
                    {new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Botões de ação - SEMPRE VISÍVEIS */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.rejectButton,
                  isRejeitado && styles.actionButtonDisabled
                ]}
                onPress={() => confirmarAcao('rejeitar')}
                disabled={processing || isCancelado}
              >
                {processing ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <>
                    <Icone 
                      nome="close-circle-outline" 
                      tamanho={20} 
                      color={isRejeitado ? "#9CA3AF" : "#EF4444"} 
                    />
                    <Text style={[
                      styles.rejectButtonText,
                      isRejeitado && styles.actionButtonTextDisabled
                    ]}>
                      {isRejeitado ? 'Rejeitado' : 'Rejeitar'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.acceptButton,
                  isAprovado && styles.actionButtonDisabled
                ]}
                onPress={() => confirmarAcao('aprovar')}
                disabled={processing || isCancelado}
              >
                {processing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Icone 
                      nome="checkmark-circle-outline" 
                      tamanho={20} 
                      color={isAprovado ? "#9CA3AF" : "#fff"} 
                    />
                    <Text style={[
                      styles.acceptButtonText,
                      isAprovado && styles.actionButtonTextDisabled
                    ]}>
                      {isAprovado ? 'Aprovado' : 'Aprovar'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  voluntarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#295CA9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  nomeLink: {
    color: '#295CA9',
    textDecorationLine: 'underline',
  },
  linkHint: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contato: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  data: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  voluntarioModalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  modalAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#295CA9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalVoluntarioText: {
    flex: 1,
  },
  modalNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  modalEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  modalContact: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusModalBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  statusModalText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  inactiveText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
    color: '#374151',
  },
  interestTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    color: '#1E40AF',
  },
  messageContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  modalDateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  rejectButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  acceptButton: {
    backgroundColor: '#295CA9',
  },
  rejectButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 16,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  actionButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default InscricaoItem;