import Icone from "@/components/shared/Icone";
import Loading from "@/components/loading/Loading";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const TIPOS_TRABALHO = ["PRESENCIAL", "REMOTO", "HIBRIDO"];
const STATUS_OPCOES = ["ABERTO", "ENCERRADO"];

type CoordEvent = {
  nativeEvent: {
    coordinate: {
      latitude: number;
      longitude: number;
    };
  };
};

type VagaType = {
  id: string;
  titulo: string;
  descricao: string;
  requisitos: string[];
  quantidade: number;
  duracao: string;
  localizacao: string;
  tipoTrabalho: string;
  status: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
};

export default function DetalheVagaOng() {
  const { token } = useContext(AuthContext);
  const { httpGet, httpPut } = useAPI();
  const navigation = useNavigation();
  const route = useRoute();
  const { vagaId } = route.params as { vagaId: string };

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  const [vagaOriginal, setVagaOriginal] = useState<VagaType | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    requisitos: "",
    quantidade: "",
    duracao: "",
    localizacao: "",
    tipoTrabalho: "PRESENCIAL",
    status: "ABERTO",
    latitude: "",
    longitude: "",
  });

  const [tempCoord, setTempCoord] = useState<{ latitude: number; longitude: number } | null>(null);

  // Carregar os dados da vaga
  useEffect(() => {
    console.log(vagaId, "vagaId detalhe ong");
    carregarVaga();
  }, [vagaId]);

  // const carregarVaga = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await httpGet(`/buscar/vaga/${vagaId}`, token || "");
  //     console.log(response, "resposta vaga ong");
  //     if (response.ok) {
  //       const data = await response.json();
  //       setVagaOriginal(data);
        
  //       // Preencher o formData com os dados da vaga
  //       setFormData({
  //         titulo: data.titulo || "",
  //         descricao: data.descricao || "",
  //         requisitos: Array.isArray(data.requisitos) ? data.requisitos.join(", ") : data.requisitos || "",
  //         quantidade: data.quantidade?.toString() || "",
  //         duracao: data.duracao || "",
  //         localizacao: data.localizacao || "",
  //         tipoTrabalho: data.tipoTrabalho || "PRESENCIAL",
  //         status: data.status || "ABERTO",
  //         latitude: data.latitude?.toString() || "",
  //         longitude: data.longitude?.toString() || "",
  //       });
  //     } else {
  //       Alert.alert("Erro", "Não foi possível carregar os dados da vaga");
  //       navigation.goBack();
  //     }
  //   } catch (error) {
  //     console.error("Erro ao carregar vaga:", error);
  //     Alert.alert("Erro", "Ocorreu um erro ao carregar a vaga");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const carregarVaga = async () => {
  try {
    setLoading(true);
    
    // Verifique se o token existe
    if (!token) {
      Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
      navigation.goBack();
      return;
    }
    const response = await httpGet(`buscar/vaga/${vagaId}`, token || "");
    
  //     console.log(response, "resposta vaga ong");
    // Configuração da requisição com fetch
    // const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";
    // const url = `${API_URL}/buscar/vaga/${vagaId}`;
    
    // console.log("Carregando vaga da URL:", url);
    
    // const response = await fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //   },
    //   // 10 segundos de timeout
    // });
     
    // Debug da resposta
    console.log("Status da resposta:", response);
    console.log("Status da resposta:", response.status);
  
    
     processarDadosVaga(response);
      
   
    
  } catch (error: any) {
    console.error("Erro ao carregar vaga:", error);
    
    let errorMessage = "Não foi possível carregar os dados da vaga";
    let showRetryButton = true;
    
    if (error.message.includes('Network request failed') || 
        error.message.includes('fetch failed') ||
        error.message.includes('timeout')) {
      errorMessage = "Problema de conexão. Verifique sua internet.";
    } else if (error.message.includes('404')) {
      errorMessage = "Vaga não encontrada no sistema.";
      showRetryButton = false;
    } else if (error.message.includes('401')) {
      errorMessage = "Sessão expirada. Faça login novamente.";
      showRetryButton = false;
    } else if (error.message.includes('JSON') || error.message.includes('HTML')) {
      errorMessage = "Erro na comunicação com o servidor.";
    } else if (error.message.includes('500')) {
      errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
    }
    
    Alert.alert(
      "Erro ao carregar", 
      errorMessage,
      showRetryButton ? [
        { 
          text: "Tentar novamente", 
          onPress: () => carregarVaga() 
        },
        { 
          text: "Voltar", 
          style: "cancel",
          onPress: () => navigation.goBack()
        }
      ] : [
        { 
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]
    );
  } finally {
    setLoading(false);
  }
};

// Função auxiliar para processar os dados da vaga
const processarDadosVaga = (data: any) => {
  // Verifica se os dados são válidos
  if (!data || typeof data !== 'object') {
    throw new Error("Dados da vaga inválidos");
  }

  // Log para debug
  console.log("Processando dados da vaga:", {
    titulo: data.titulo,
    requisitos: data.requisitos,
    tipo: typeof data.requisitos
  });

  setVagaOriginal(data);
  
  // Formata os requisitos para exibição no form
  let requisitosFormatados = "";
  if (Array.isArray(data.requisitos)) {
    requisitosFormatados = data.requisitos.join(", ");
  } else if (typeof data.requisitos === 'string') {
    requisitosFormatados = data.requisitos;
  } else if (data.requisitos) {
    // Tenta converter para string
    requisitosFormatados = String(data.requisitos);
  }

  // Preencher o formData com os dados da vaga
  setFormData({
    titulo: data.titulo || "",
    descricao: data.descricao || "",
    requisitos: requisitosFormatados,
    quantidade: data.quantidade ? String(data.quantidade) : "1",
    duracao: data.duracao || "",
    localizacao: data.localizacao || "",
    tipoTrabalho: data.tipoTrabalho || "PRESENCIAL",
    status: data.status || "ABERTO",
    latitude: data.latitude ? String(data.latitude) : "",
    longitude: data.longitude ? String(data.longitude) : "",
  });
};

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validarFormulario = (): boolean => {
    if (!formData.titulo.trim()) {
      Alert.alert("Erro", "O título da vaga é obrigatório");
      return false;
    }

    if (!formData.descricao.trim()) {
      Alert.alert("Erro", "A descrição da vaga é obrigatória");
      return false;
    }

    if (!formData.requisitos.trim()) {
      Alert.alert("Erro", "Os requisitos da vaga são obrigatórios");
      return false;
    }

    const quantidade = parseInt(formData.quantidade);
    if (!formData.quantidade || isNaN(quantidade) || quantidade <= 0) {
      Alert.alert("Erro", "A quantidade de vagas deve ser um número maior que zero");
      return false;
    }

    if (!formData.duracao.trim()) {
      Alert.alert("Erro", "A duração da vaga é obrigatória");
      return false;
    }

    const hasCoords = !!formData.latitude && !!formData.longitude;
    if (!formData.localizacao.trim() && !hasCoords) {
      Alert.alert("Erro", "A localização da vaga é obrigatória");
      return false;
    }

    return true;
  };

  const handleSalvarEdicao = async () => {
    if (!validarFormulario()) return;

    try {
      setSalvando(true);

      const requisitosArray = formData.requisitos
        .split(/[,\n]/)
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const vagaData = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        requisitos: requisitosArray,
        quantidade: parseInt(formData.quantidade),
        duracao: formData.duracao.trim(),
        localizacao: formData.localizacao.trim(),
        tipoTrabalho: formData.tipoTrabalho,
        status: formData.status,
        latitude: formData.latitude ? parseFloat(formData.latitude) : vagaOriginal?.latitude || -6.8903,
        longitude: formData.longitude ? parseFloat(formData.longitude) : vagaOriginal?.longitude || -38.5572,
      };

      const response = await httpPut(`editar/vaga/${vagaId}`, vagaData, token || "");
      //  const status = await fetch(`http://localhost:3001/status/${vagaId}`, {
      //                 method: "PATCH",
      //                 headers: {
      //                     Authorization: `Bearer ${token}`,
      //                 },
      //                 body: formData.status,
      //             });
      //             console.log(status, "status da vaga");
      if (response.ok) {
        Alert.alert("Sucesso!", "Vaga atualizada com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              setEditando(false);
              carregarVaga(); // Recarregar dados atualizados
            },
          },
        ]);
      } else {
        const errorData = await response;
        Alert.alert("Erro", "Não foi possível atualizar a vaga");
      }
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar a vaga. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelarEdicao = () => {
    if (vagaOriginal) {
      setFormData({
        titulo: vagaOriginal.titulo || "",
        descricao: vagaOriginal.descricao || "",
        requisitos: Array.isArray(vagaOriginal.requisitos) ? vagaOriginal.requisitos.join(", ") : vagaOriginal.requisitos || "",
        quantidade: vagaOriginal.quantidade?.toString() || "",
        duracao: vagaOriginal.duracao || "",
        localizacao: vagaOriginal.localizacao || "",
        tipoTrabalho: vagaOriginal.tipoTrabalho || "PRESENCIAL",
        status: vagaOriginal.status || "ABERTO",
        latitude: vagaOriginal.latitude?.toString() || "",
        longitude: vagaOriginal.longitude?.toString() || "",
      });
    }
    setEditando(false);
  };

  const getCurrentLocationExpo = async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return null;
      }

      const last = await Location.getLastKnownPositionAsync();
      if (last && last.coords) {
        return { latitude: last.coords.latitude, longitude: last.coords.longitude };
      }

      const getPos = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));

      const result: any = await Promise.race([getPos, timeout]);

      if (!result) {
        console.warn("Timeout ao obter localização");
        return null;
      }

      return { latitude: result.coords.latitude, longitude: result.coords.longitude };
    } catch (err) {
      console.warn("Erro ao obter localização (expo):", err);
      return null;
    }
  };

  const openMapPicker = async () => {
    setMapLoading(true);

    const current = await getCurrentLocationExpo();

    if (current) {
      setTempCoord({ latitude: current.latitude, longitude: current.longitude });
    } else {
      // Fallback: Cajazeiras, Paraíba
      const lat = formData.latitude ? parseFloat(formData.latitude) : vagaOriginal?.latitude || -6.8903;
      const lng = formData.longitude ? parseFloat(formData.longitude) : vagaOriginal?.longitude || -38.5572;
      setTempCoord({ latitude: lat, longitude: lng });
    }

    setMapModalVisible(true);

    setTimeout(() => {
      const coordToAnimate =
        tempCoord ??
        (formData.latitude && formData.longitude
          ? { latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) }
          : { latitude: vagaOriginal?.latitude || -6.8903, longitude: vagaOriginal?.longitude || -38.5572 });

      if (mapRef.current && coordToAnimate) {
        try {
          mapRef.current.animateToRegion(
            {
              latitude: coordToAnimate.latitude,
              longitude: coordToAnimate.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            } as Region,
            500
          );
        } catch (e) {
          // Ignorar erro
        }
      }
      setMapLoading(false);
    }, 400);
  };

  const setMapRef = useCallback((r: MapView | null) => {
    mapRef.current = r;
  }, []);

  const onMapPress = (e: CoordEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setTempCoord({ latitude, longitude });
  };

  const saveLocationFromMap = async () => {
    if (!tempCoord) {
      Alert.alert("Atenção", "Escolha um ponto no mapa antes de salvar.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      latitude: String(tempCoord.latitude),
      longitude: String(tempCoord.longitude),
    }));

    setMapModalVisible(false);
  };

  const renderDetalhes = () => {
    if (!vagaOriginal) return null;

    return (
      <View style={styles.detalhesContainer}>
        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Vaga</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Título:</Text>
            <Text style={styles.infoValue}>{vagaOriginal.titulo}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Descrição:</Text>
            <Text style={styles.infoValue}>{vagaOriginal.descricao}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Requisitos:</Text>
            <View style={styles.requisitosContainer}>
              {Array.isArray(vagaOriginal.requisitos) ? (
                vagaOriginal.requisitos.map((req, index) => (
                  <View key={index} style={styles.requisitoTag}>
                    <Text style={styles.requisitoText}>{req}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.infoValue}>{vagaOriginal.requisitos}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.infoRow, styles.halfWidth]}>
              <Text style={styles.infoLabel}>Quantidade:</Text>
              <Text style={styles.infoValue}>{vagaOriginal.quantidade} vaga(s)</Text>
            </View>
            
            <View style={[styles.infoRow, styles.halfWidth]}>
              <Text style={styles.infoLabel}>Duração:</Text>
              <Text style={styles.infoValue}>{vagaOriginal.duracao}</Text>
            </View>
          </View>
        </View>

        {/* Localização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Endereço:</Text>
            <Text style={styles.infoValue}>{vagaOriginal.localizacao}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getTipoCor(vagaOriginal.tipoTrabalho) }]}>
              <Text style={styles.statusBadgeText}>{vagaOriginal.tipoTrabalho}</Text>
            </View>
          </View>
          
          {vagaOriginal.latitude && vagaOriginal.longitude && (
            <View style={styles.mapPreviewContainer}>
              <Text style={styles.infoLabel}>Localização no mapa:</Text>
              <View style={styles.mapPreview}>
                <MapView
                  style={styles.mapSmall}
                  initialRegion={{
                    latitude: vagaOriginal.latitude,
                    longitude: vagaOriginal.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: vagaOriginal.latitude,
                      longitude: vagaOriginal.longitude,
                    }}
                  />
                </MapView>
              </View>
            </View>
          )}
        </View>

        {/* Status */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={[styles.infoRow, styles.halfWidth]}>
              <Text style={styles.infoLabel}>Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusCor(vagaOriginal.status) }]}>
                <Text style={styles.statusBadgeText}>{vagaOriginal.status}</Text>
              </View>
            </View>
            
            <View style={[styles.infoRow, styles.halfWidth]}>
              <Text style={styles.infoLabel}>Tipo de Trabalho:</Text>
              <Text style={styles.infoValue}>{vagaOriginal.tipoTrabalho}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getStatusCor = (status: string) => {
    switch (status) {
      case "ABERTO": return "#10B981";
      case "FECHADO": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const getTipoCor = (tipo: string) => {
    switch (tipo) {
      case "PRESENCIAL": return "#3B82F6";
      case "REMOTO": return "#8B5CF6";
      case "HIBRIDO": return "#F59E0B";
      default: return "#6B7280";
    }
  };

  const renderFormularioEdicao = () => {
    return (
      <View style={styles.formContainer}>
        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Título da Vaga <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.titulo}
              onChangeText={(value) => handleChange("titulo", value)}
              placeholder="Ex: Voluntário para Apoio Educacional"
              placeholderTextColor="#939EAA"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Descrição <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descricao}
              onChangeText={(value) => handleChange("descricao", value)}
              placeholder="Descreva as atividades e responsabilidades..."
              placeholderTextColor="#939EAA"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Requisitos <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.hint}>Separe cada requisito por vírgula ou linha</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.requisitos}
              onChangeText={(value) => handleChange("requisitos", value)}
              placeholder="Ex: Proatividade, Boa comunicação, Disponibilidade"
              placeholderTextColor="#939EAA"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                Quantidade <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.quantidade}
                onChangeText={(value) => handleChange("quantidade", value)}
                placeholder="0"
                placeholderTextColor="#939EAA"
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                Duração <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.duracao}
                onChangeText={(value) => handleChange("duracao", value)}
                placeholder="Ex: 3 meses"
                placeholderTextColor="#939EAA"
              />
            </View>
          </View>
        </View>

        {/* Localização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Endereço/Local <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.localizacao}
              onChangeText={(value) => handleChange("localizacao", value)}
              placeholder="Ex: Rua Exemplo, 123 - Bairro, Cidade"
              placeholderTextColor="#939EAA"
            />
          </View>

          {/* Preview do mapa para edição */}
          <View style={styles.mapPreviewContainer}>
            <Text style={styles.label}>Local no mapa</Text>

            <View style={styles.mapPreview}>
              {formData.latitude && formData.longitude ? (
                <MapView
                  ref={setMapRef}
                  style={styles.mapSmall}
                  initialRegion={{
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  pointerEvents="none"
                >
                  <Marker
                    coordinate={{
                      latitude: parseFloat(formData.latitude),
                      longitude: parseFloat(formData.longitude),
                    }}
                  />
                </MapView>
              ) : (
                <View style={styles.mapEmpty}>
                  <Text style={{ color: "#6B7280" }}>Nenhuma localização selecionada</Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
              <TouchableOpacity style={styles.chooseButton} onPress={openMapPicker}>
                <Text style={styles.chooseButtonText}>{formData.latitude ? "Alterar localização" : "Selecionar no mapa"}</Text>
              </TouchableOpacity>

              {formData.latitude && (
                <TouchableOpacity
                  style={[styles.chooseButton, { backgroundColor: "#E5E7EB" }]}
                  onPress={() => {
                    setFormData((prev) => ({ ...prev, latitude: "", longitude: "" }));
                  }}
                >
                  <Text style={[styles.chooseButtonText, { color: "#1A1A1A" }]}>Remover</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Tipo de Trabalho */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Trabalho</Text>
          <View style={styles.optionsContainer}>
            {TIPOS_TRABALHO.map((tipo) => (
              <Pressable
                key={tipo}
                style={[styles.optionButton, formData.tipoTrabalho === tipo && styles.optionButtonActive]}
                onPress={() => handleChange("tipoTrabalho", tipo)}
              >
                <Text style={[styles.optionText, formData.tipoTrabalho === tipo && styles.optionTextActive]}>{tipo}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status da Vaga</Text>
          <View style={styles.optionsContainer}>
            {STATUS_OPCOES.map((status) => (
              <Pressable
                key={status}
                style={[styles.optionButton, formData.status === status && styles.optionButtonActive]}
                onPress={() => handleChange("status", status)}
              >
                <Text style={[styles.optionText, formData.status === status && styles.optionTextActive]}>{status}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Botões de ação */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancelarEdicao}
            disabled={salvando}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSalvarEdicao}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Loading message="Carregando vaga..." />;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icone nome="arrow-back" tamanho={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {editando ? "Editar Vaga" : "Detalhes da Vaga"}
        </Text>
        
        {!editando && (
          <TouchableOpacity onPress={() => setEditando(true)} style={styles.editButton}>
            <Icone nome="pencil-outline" tamanho={20} color="#295CA9" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {editando ? renderFormularioEdicao() : renderDetalhes()}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal do mapa */}
      <Modal visible={mapModalVisible} animationType="slide" onRequestClose={() => setMapModalVisible(false)}>
        <View style={styles.modalHeader}>
          <Pressable onPress={() => setMapModalVisible(false)} style={styles.backButton}>
            <Icone nome="arrow-back" tamanho={24} color="#1A1A1A" />
          </Pressable>
          <Text style={styles.headerTitle}>Escolher Local no Mapa</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.modalContent}>
          {mapLoading && (
            <Loading variant="overlay" message="Carregando mapa..." style={StyleSheet.absoluteFill} />
          )}

          <MapView
            ref={setMapRef}
            style={styles.mapFull}
            initialRegion={{
              latitude: tempCoord ? tempCoord.latitude : vagaOriginal?.latitude || -6.8903,
              longitude: tempCoord ? tempCoord.longitude : vagaOriginal?.longitude || -38.5572,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={onMapPress}
            onMapReady={() => setMapLoading(false)}
            zoomEnabled={true}
            zoomControlEnabled={true}
            scrollEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            minZoomLevel={5}
            maxZoomLevel={20}
          >
            {tempCoord && (
              <Marker
                coordinate={{ latitude: tempCoord.latitude, longitude: tempCoord.longitude }}
                draggable
                onDragEnd={(e: CoordEvent) => {
                  const { latitude, longitude } = e.nativeEvent.coordinate;
                  setTempCoord({ latitude, longitude });
                }}
              />
            )}
          </MapView>

          <View style={styles.modalFooter}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Coordenadas selecionadas</Text>
              <Text style={{ color: "#374151" }}>{tempCoord ? `${tempCoord.latitude.toFixed(6)}, ${tempCoord.longitude.toFixed(6)}` : "Nenhuma"}</Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveLocationFromMap}>
              <Text style={styles.saveButtonText}>Salvar localização</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.06,
    paddingBottom: screenWidth < 350 ? 16 : 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  editButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { 
    fontSize: screenWidth < 350 ? 18 : 20, 
    fontWeight: "bold", 
    color: "#1A1A1A",
    flex: 1,
    textAlign: "center",
  },
  scrollView: { flex: 1 },
  detalhesContainer: { 
    paddingHorizontal: screenWidth * 0.05, 
    paddingVertical: screenWidth < 350 ? 16 : 20,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  formContainer: { 
    paddingHorizontal: screenWidth * 0.05, 
    paddingVertical: screenWidth < 350 ? 16 : 20,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  section: { 
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: { 
    fontSize: screenWidth < 350 ? 16 : 18, 
    fontWeight: "bold", 
    color: "#1A1A1A", 
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  infoRow: { 
    marginBottom: 12,
  },
  infoLabel: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#374151", 
    marginBottom: 4,
  },
  infoValue: { 
    fontSize: 16, 
    color: "#1A1A1A",
    lineHeight: 22,
  },
  requisitosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  requisitoTag: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  requisitoText: {
    fontSize: 14,
    color: "#374151",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  statusBadgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  row: { 
    flexDirection: "row", 
    gap: 12,
    marginBottom: 12,
  },
  halfWidth: { 
    flex: 1,
  },
  
  // Estilos do formulário (herdados do CriarVaga)
  inputGroup: { marginBottom: screenWidth < 350 ? 14 : 16 },
  label: { fontSize: screenWidth < 350 ? 13 : 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  required: { color: "#DC2626" },
  hint: { fontSize: screenWidth < 350 ? 11 : 12, color: "#6B7280", marginBottom: 8, fontStyle: "italic" },
  input: { 
    backgroundColor: "#fff", 
    borderWidth: 1, 
    borderColor: "#E5E7EB", 
    borderRadius: 8, 
    padding: screenWidth < 350 ? 10 : 12, 
    fontSize: screenWidth < 350 ? 14 : 16, 
    color: "#1A1A1A", 
    height: screenWidth < 350 ? 44 : 48,
  },
  textArea: { 
    height: "auto", 
    minHeight: 100, 
    paddingTop: 12,
  },
  optionsContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 12,
  },
  optionButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8, 
    backgroundColor: "#fff", 
    borderWidth: 1, 
    borderColor: "#E5E7EB",
  },
  optionButtonActive: { 
    backgroundColor: "#295CA9", 
    borderColor: "#295CA9",
  },
  optionText: { 
    fontSize: screenWidth < 350 ? 13 : 14, 
    fontWeight: "600", 
    color: "#6B7280",
  },
  optionTextActive: { 
    color: "#fff",
  },
  
  // Estilos do mapa
  mapPreviewContainer: { 
    marginTop: 12,
  },
  mapPreview: { 
    height: 120, 
    borderRadius: 8, 
    overflow: "hidden", 
    borderWidth: 1, 
    borderColor: "#E5E7EB", 
    backgroundColor: "#fff",
  },
  mapSmall: { 
    width: "100%", 
    height: "100%",
  },
  mapEmpty: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
  },
  chooseButton: { 
    backgroundColor: "#295CA9", 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8, 
    justifyContent: "center", 
    alignItems: "center",
  },
  chooseButtonText: { 
    color: "#fff", 
    fontWeight: "600",
  },
  
  // Botões de ação
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#295CA9",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  
  // Modal styles
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 56 : 24,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalContent: { 
    flex: 1,
  },
  mapFull: { 
    width: "100%", 
    height: screenHeight * 0.7,
  },
  mapLoading: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 10, 
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  modalFooter: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: "#E5E7EB", 
    backgroundColor: "#fff",
  },
});