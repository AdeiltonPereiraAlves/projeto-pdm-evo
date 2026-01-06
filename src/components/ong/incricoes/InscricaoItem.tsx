// InscricaoItem.tsx
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface InscricaoItemProps {
  inscricao: {
    id: string;
    ativo: boolean;
    status: 'pendente' | 'aceito' | 'recusado' | 'cancelado';
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
  onStatusChange: (inscricaoId: string, novoStatus: string) => Promise<void>;
  loading?: boolean;
}

const InscricaoItem: React.FC<InscricaoItemProps> = ({
  inscricao,
  onStatusChange,
  loading = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);

  const getStatusColor = (status: string, ativo: boolean) => {
    if (!ativo) return '#9CA3AF';
    switch (status) {
      case 'aceito': return '#10B981';
      case 'pendente': return '#F59E0B';
      case 'recusado': return '#EF4444';
      case 'cancelado': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string, ativo: boolean) => {
    if (!ativo) return 'Inativo';
    switch (status) {
      case 'aceito': return 'Aceito';
      case 'pendente': return 'Pendente';
      case 'recusado': return 'Recusado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const handleStatusChange = async (novoStatus: string) => {
    try {
      setProcessing(true);
      await onStatusChange(inscricao.id, novoStatus);
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao mudar status:', error);
    } finally {
      setProcessing(false);
    }
  };

  const confirmAction = (action: 'aceitar' | 'recusar') => {
    const title = action === 'aceitar' ? 'Aceitar Candidatura' : 'Recusar Candidatura';
    const message = action === 'aceitar'
      ? 'Tem certeza que deseja aceitar este voluntário?'
      : 'Tem certeza que deseja recusar esta candidatura?';
    
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => handleStatusChange(action === 'aceitar' ? 'aceito' : 'recusado')
        }
      ]
    );
  };

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
              <Text style={styles.nome} numberOfLines={1}>
                {inscricao.voluntario.nome}
              </Text>
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
                { backgroundColor: getStatusColor(inscricao.status, inscricao.ativo) }
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(inscricao.status, inscricao.ativo)}
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
            {/* ... conteúdo do modal similar ao componente anterior ... */}
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
});

export default InscricaoItem;