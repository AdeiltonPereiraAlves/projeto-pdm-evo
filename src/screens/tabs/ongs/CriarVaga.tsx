// import Icone from "@/components/shared/Icone";
// import Botao from "@/components/ui/Botao";
// import { AuthContext } from "@/data/context/AuthContext";
// import useAPI from "@/data/hooks/useAPI";
// import { useNavigation } from "@react-navigation/native";
// import { useContext, useState } from "react";
// import {
//     Alert,
//     Dimensions,
//     KeyboardAvoidingView,
//     Platform,
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     View,
// } from "react-native";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// const TIPOS_TRABALHO = ["PRESENCIAL", "REMOTO", "HIBRIDO"];
// const STATUS_OPCOES = ["ABERTO", "FECHADO"];

// export default function CriarVaga() {
//     const { token } = useContext(AuthContext);
//     const { httpPost } = useAPI();
//     const navigation = useNavigation();

//     const [salvando, setSalvando] = useState(false);
//     const [formData, setFormData] = useState({
//         titulo: "",
//         descricao: "",
//         requisitos: "",
//         quantidade: "",
//         duracao: "",
//         localizacao: "",
//         tipoTrabalho: "PRESENCIAL",
//         status: "ABERTO",
//         latitude: "",
//         longitude: "",
//     });

//     const handleChange = (field: string, value: string) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };

//     const validarFormulario = (): boolean => {
//         if (!formValues.titulo.trim()) {
//             Alert.alert("Erro", "O título da vaga é obrigatório");
//             return false;
//         }

//         if (!formValues.descricao.trim()) {
//             Alert.alert("Erro", "A descrição da vaga é obrigatória");
//             return false;
//         }

//         if (!formValues.requisitos.trim()) {
//             Alert.alert("Erro", "Os requisitos da vaga são obrigatórios");
//             return false;
//         }

//         const quantidade = parseInt(formValues.quantidade);
//         if (!formValues.quantidade || isNaN(quantidade) || quantidade <= 0) {
//             Alert.alert("Erro", "A quantidade de vagas deve ser um número maior que zero");
//             return false;
//         }

//         if (!formValues.duracao.trim()) {
//             Alert.alert("Erro", "A duração da vaga é obrigatória");
//             return false;
//         }

//         if (!formValues.localizacao.trim()) {
//             Alert.alert("Erro", "A localização da vaga é obrigatória");
//             return false;
//         }

//         return true;
//     };

//     const handleSubmit = async () => {
//         if (!validarFormulario()) return;

//         try {
//             setSalvando(true);

//             // Processar requisitos (separar por vírgula ou linha)
//             const requisitosArray = formValues.requisitos
//                 .split(/[,\n]/)
//                 .map((r) => r.trim())
//                 .filter((r) => r.length > 0);

//             // Preparar dados para enviar
//             const vagaData = {
//                 titulo: formValues.titulo.trim(),
//                 descricao: formValues.descricao.trim(),
//                 requisitos: requisitosArray,
//                 quantidade: parseInt(formValues.quantidade),
//                 duracao: formValues.duracao.trim(),
//                 localizacao: formValues.localizacao.trim(),
//                 tipoTrabalho: formValues.tipoTrabalho,
//                 status: formValues.status,
//                 latitude: formValues.latitude ? parseFloat(formValues.latitude) : -23.55052,
//                 longitude: formValues.longitude ? parseFloat(formValues.longitude) : -46.633308,
//             };

//             console.log("Enviando vaga:", vagaData);

//             const response = await httpPost("cadastrar/vaga", vagaData, token || "");

//             if (response.ok) {
//                 Alert.alert(
//                     "Sucesso!",
//                     "Vaga criada com sucesso!",
//                     [
//                         {
//                             text: "OK",
//                             onPress: () => {
//                                 // Limpar formulário
//                                 setFormData({
//                                     titulo: "",
//                                     descricao: "",
//                                     requisitos: "",
//                                     quantidade: "",
//                                     duracao: "",
//                                     localizacao: "",
//                                     tipoTrabalho: "PRESENCIAL",
//                                     status: "ABERTO",
//                                     latitude: "",
//                                     longitude: "",
//                                 });
//                                 // Voltar ou navegar para dashboard
//                                 navigation.navigate("Dashboard" as never);
//                             },
//                         },
//                     ]
//                 );
//             } else {
//                 const errorData = await response.json();
//                 Alert.alert("Erro", errorData.messagem || "Não foi possível criar a vaga");
//             }
//         } catch (error) {
//             console.error("Erro ao criar vaga:", error);
//             Alert.alert("Erro", "Ocorreu um erro ao criar a vaga. Tente novamente.");
//         } finally {
//             setSalvando(false);
//         }
//     };

//     return (
//         <KeyboardAvoidingView
//             style={styles.container}
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//         >
//             {/* Header */}
//             <View style={styles.header}>
//                 <Pressable
//                     onPress={() => navigation.goBack()}
//                     style={styles.backButton}
//                 >
//                     <Icone nome="arrow-back" tamanho={24} color="#1A1A1A" />
//                 </Pressable>
//                 <Text style={styles.headerTitle}>Nova Vaga</Text>
//                 <View style={styles.backButton} />
//             </View>

//             <ScrollView
//                 style={styles.scrollView}
//                 showsVerticalScrollIndicator={false}
//                 keyboardShouldPersistTaps="handled"
//             >
//                 <View style={styles.formContainer}>
//                     {/* Informações Básicas */}
//                     <View style={styles.section}>
//                         <Text style={styles.sectionTitle}>Informações Básicas</Text>

//                         <View style={styles.inputGroup}>
//                             <Text style={styles.label}>
//                                 Título da Vaga <Text style={styles.required}>*</Text>
//                             </Text>
//                             <TextInput
//                                 style={styles.input}
//                                 value={formValues.titulo}
//                                 onChangeText={(value) => setValue("titulo", value)}
//                                 placeholder="Ex: Voluntário para Apoio Educacional"
//                                 placeholderTextColor="#939EAA"
//                             />
//                         </View>

//                         <View style={styles.inputGroup}>
//                             <Text style={styles.label}>
//                                 Descrição <Text style={styles.required}>*</Text>
//                             </Text>
//                             <TextInput
//                                 style={[styles.input, styles.textArea]}
//                                 value={formValues.descricao}
//                                 onChangeText={(value) => setValue("descricao", value)}
//                                 placeholder="Descreva as atividades e responsabilidades..."
//                                 placeholderTextColor="#939EAA"
//                                 multiline
//                                 numberOfLines={6}
//                                 textAlignVertical="top"
//                             />
//                         </View>

//                         <View style={styles.inputGroup}>
//                             <Text style={styles.label}>
//                                 Requisitos <Text style={styles.required}>*</Text>
//                             </Text>
//                             <Text style={styles.hint}>
//                                 Separe cada requisito por vírgula ou linha
//                             </Text>
//                             <TextInput
//                                 style={[styles.input, styles.textArea]}
//                                 value={formValues.requisitos}
//                                 onChangeText={(value) => setValue("requisitos", value)}
//                                 placeholder="Ex: Proatividade, Boa comunicação, Disponibilidade"
//                                 placeholderTextColor="#939EAA"
//                                 multiline
//                                 numberOfLines={4}
//                                 textAlignVertical="top"
//                             />
//                         </View>

//                         <View style={styles.row}>
//                             <View style={[styles.inputGroup, styles.halfWidth]}>
//                                 <Text style={styles.label}>
//                                     Quantidade <Text style={styles.required}>*</Text>
//                                 </Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     value={formValues.quantidade}
//                                     onChangeText={(value) => setValue("quantidade", value)}
//                                     placeholder="0"
//                                     placeholderTextColor="#939EAA"
//                                     keyboardType="number-pad"
//                                 />
//                             </View>

//                             <View style={[styles.inputGroup, styles.halfWidth]}>
//                                 <Text style={styles.label}>
//                                     Duração <Text style={styles.required}>*</Text>
//                                 </Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     value={formValues.duracao}
//                                     onChangeText={(value) => setValue("duracao", value)}
//                                     placeholder="Ex: 3 meses"
//                                     placeholderTextColor="#939EAA"
//                                 />
//                             </View>
//                         </View>
//                     </View>

//                     {/* Localização */}
//                     <View style={styles.section}>
//                         <Text style={styles.sectionTitle}>Localização</Text>

//                         <View style={styles.inputGroup}>
//                             <Text style={styles.label}>
//                                 Endereço/Local <Text style={styles.required}>*</Text>
//                             </Text>
//                             <TextInput
//                                 style={styles.input}
//                                 value={formValues.localizacao}
//                                 onChangeText={(value) => setValue("localizacao", value)}
//                                 placeholder="Ex: Rua Exemplo, 123 - Bairro, Cidade"
//                                 placeholderTextColor="#939EAA"
//                             />
//                         </View>

//                         <View style={styles.row}>
//                             <View style={[styles.inputGroup, styles.halfWidth]}>
//                                 <Text style={styles.label}>Latitude (opcional)</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     value={formValues.latitude}
//                                     onChangeText={(value) => setValue("latitude", value)}
//                                     placeholder="-23.55052"
//                                     placeholderTextColor="#939EAA"
//                                     keyboardType="numeric"
//                                 />
//                             </View>

//                             <View style={[styles.inputGroup, styles.halfWidth]}>
//                                 <Text style={styles.label}>Longitude (opcional)</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     value={formValues.longitude}
//                                     onChangeText={(value) => setValue("longitude", value)}
//                                     placeholder="-46.633308"
//                                     placeholderTextColor="#939EAA"
//                                     keyboardType="numeric"
//                                 />
//                             </View>
//                         </View>
//                     </View>

//                     {/* Tipo de Trabalho */}
//                     <View style={styles.section}>
//                         <Text style={styles.sectionTitle}>Tipo de Trabalho</Text>
//                         <View style={styles.optionsContainer}>
//                             {TIPOS_TRABALHO.map((tipo) => (
//                                 <Pressable
//                                     key={tipo}
//                                     style={[
//                                         styles.optionButton,
//                                         formValues.tipoTrabalho === tipo && styles.optionButtonActive,
//                                     ]}
//                                     onPress={() => setValue("tipoTrabalho", tipo)}
//                                 >
//                                     <Text
//                                         style={[
//                                             styles.optionText,
//                                             formValues.tipoTrabalho === tipo && styles.optionTextActive,
//                                         ]}
//                                     >
//                                         {tipo}
//                                     </Text>
//                                 </Pressable>
//                             ))}
//                         </View>
//                     </View>

//                     {/* Status */}
//                     <View style={styles.section}>
//                         <Text style={styles.sectionTitle}>Status da Vaga</Text>
//                         <View style={styles.optionsContainer}>
//                             {STATUS_OPCOES.map((status) => (
//                                 <Pressable
//                                     key={status}
//                                     style={[
//                                         styles.optionButton,
//                                         formValues.status === status && styles.optionButtonActive,
//                                     ]}
//                                     onPress={() => setValue("status", status)}
//                                 >
//                                     <Text
//                                         style={[
//                                             styles.optionText,
//                                             formValues.status === status && styles.optionTextActive,
//                                         ]}
//                                     >
//                                         {status}
//                                     </Text>
//             </Pressable>
//                             ))}
//                         </View>
//                     </View>

//                     {/* Botão de Criar */}
//                     <View style={styles.buttonContainer}>
//                         <Botao
//                             title={salvando ? "Criando Vaga..." : "Criar Vaga"}
//                             color="#295CA9"
//                             textColor="#fff"
//                             onPress={handleSubmit}
//                             disabled={salvando}
//                         />
//                     </View>
//         </View>

//                 <View style={{ height: 40 }} />
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#F9FAFB",
//     },
//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         paddingHorizontal: screenWidth * 0.05,
//         paddingTop: screenHeight * 0.06,
//         paddingBottom: screenWidth < 350 ? 16 : 20,
//         backgroundColor: "#fff",
//         borderBottomWidth: 1,
//         borderBottomColor: "#E5E7EB",
//     },
//     backButton: {
//         width: 40,
//         height: 40,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     headerTitle: {
//         fontSize: screenWidth < 350 ? 18 : 20,
//         fontWeight: "bold",
//         color: "#1A1A1A",
//     },
//     scrollView: {
//         flex: 1,
//     },
//     formContainer: {
//         paddingHorizontal: screenWidth * 0.05,
//         paddingVertical: screenWidth < 350 ? 16 : 20,
//         maxWidth: 600,
//         width: "100%",
//         alignSelf: "center",
//     },
//     section: {
//         marginBottom: screenWidth < 350 ? 20 : 24,
//     },
//     sectionTitle: {
//         fontSize: screenWidth < 350 ? 16 : 18,
//         fontWeight: "bold",
//         color: "#1A1A1A",
//         marginBottom: 16,
//     },
//     inputGroup: {
//         marginBottom: screenWidth < 350 ? 14 : 16,
//     },
//     label: {
//         fontSize: screenWidth < 350 ? 13 : 14,
//         fontWeight: "600",
//         color: "#374151",
//         marginBottom: 8,
//     },
//     required: {
//         color: "#DC2626",
//     },
//     hint: {
//         fontSize: screenWidth < 350 ? 11 : 12,
//         color: "#6B7280",
//         marginBottom: 8,
//         fontStyle: "italic",
//     },
//     input: {
//         backgroundColor: "#fff",
//         borderWidth: 1,
//         borderColor: "#E5E7EB",
//         borderRadius: 8,
//         padding: screenWidth < 350 ? 10 : 12,
//         fontSize: screenWidth < 350 ? 14 : 16,
//         color: "#1A1A1A",
//         height: screenWidth < 350 ? 44 : 48,
//     },
//     textArea: {
//         height: "auto",
//         minHeight: 100,
//         paddingTop: 12,
//     },
//     row: {
//         flexDirection: "row",
//         gap: 12,
//     },
//     halfWidth: {
//         flex: 1,
//     },
//     optionsContainer: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         gap: 12,
//     },
//     optionButton: {
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         borderRadius: 8,
//         backgroundColor: "#fff",
//         borderWidth: 1,
//         borderColor: "#E5E7EB",
//     },
//     optionButtonActive: {
//         backgroundColor: "#295CA9",
//         borderColor: "#295CA9",
//     },
//     optionText: {
//         fontSize: screenWidth < 350 ? 13 : 14,
//         fontWeight: "600",
//         color: "#6B7280",
//     },
//     optionTextActive: {
//         color: "#fff",
//     },
//     buttonContainer: {
//         marginTop: 8,
//     },
// });


import { yupResolver } from "@hookform/resolvers/yup";
import Icone from "@/components/shared/Icone";
import Loading from "@/components/loading/Loading";
import Botao from "@/components/ui/Botao";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import {
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
const STATUS_OPCOES = ["ABERTO", "FECHADO"];

const criarVagaSchema = yup.object({
  titulo: yup.string().trim().required("O título da vaga é obrigatório").min(3, "Mínimo 3 caracteres"),
  descricao: yup.string().trim().required("A descrição da vaga é obrigatória"),
  requisitos: yup.string().trim().required("Os requisitos da vaga são obrigatórios"),
  quantidade: yup
    .string()
    .required("Informe a quantidade de vagas")
    .test("is-valid-number", "A quantidade deve ser um número maior que zero", (val) => {
      const n = parseInt(val || "0", 10);
      return !isNaN(n) && n > 0;
    }),
  duracao: yup.string().trim().required("A duração da vaga é obrigatória"),
  localizacao: yup.string().trim(),
  latitude: yup.string(),
  longitude: yup.string(),
  tipoTrabalho: yup.string().oneOf(["PRESENCIAL", "REMOTO", "HIBRIDO"]).required(),
  status: yup.string().oneOf(["ABERTO", "FECHADO"]).required(),
}).test("localizacao-ou-coords", "Informe a localização (texto ou marque no mapa)", function (value) {
  const hasText = !!value?.localizacao?.trim();
  const lat = value?.latitude ? parseFloat(value.latitude) : NaN;
  const lng = value?.longitude ? parseFloat(value.longitude) : NaN;
  const hasCoords = !isNaN(lat) && !isNaN(lng);
  return hasText || hasCoords;
});

type CriarVagaFormData = yup.InferType<typeof criarVagaSchema>;

type CoordEvent = {
  nativeEvent: {
    coordinate: {
      latitude: number;
      longitude: number;
    };
  };
};

export default function CriarVaga() {
  const { token } = useContext(AuthContext);
  const { httpPost } = useAPI();
  const navigation = useNavigation();

  const [salvando, setSalvando] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  // Requisitos: input não controlado (defaultValue + ref) para preservar acentos/cedilha no Android
  const requisitosRef = useRef<TextInput>(null);
  const requisitosValueRef = useRef<string>("");

  const defaultValues: CriarVagaFormData = {
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
  };

  const {
    control,
    handleSubmit: formHandleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CriarVagaFormData>({
    resolver: yupResolver(criarVagaSchema),
    defaultValues,
  });

  const formValues = watch();

  // Coordenadas temporárias usadas no modal enquanto o usuário escolhe
  const [tempCoord, setTempCoord] = useState<{ latitude: number; longitude: number } | null>(null);

  const onSubmit = async (data: CriarVagaFormData) => {
    try {
      setSalvando(true);

      // Usar valor do ref (não controlado) para preservar acentos/cedilha enviados ao backend
      const requisitosRaw = requisitosValueRef.current ?? (data.requisitos || "");
      const requisitosArray = requisitosRaw
        .split(/[,\n]/)
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const vagaData = {
        titulo: (data.titulo || "").trim(),
        descricao: (data.descricao || "").trim(),
        requisitos: requisitosArray,
        quantidade: parseInt(String(data.quantidade), 10),
        duracao: (data.duracao || "").trim(),
        localizacao: (data.localizacao || "").trim(),
        tipoTrabalho: data.tipoTrabalho,
        status: data.status,
        latitude: data.latitude ? parseFloat(data.latitude) : -23.55052,
        longitude: data.longitude ? parseFloat(data.longitude) : -46.633308,
      };

      const response = await httpPost("cadastrar/vaga", vagaData, token || "");

      if (response.ok) {
        Alert.alert("Sucesso!", "Vaga criada com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              reset(defaultValues);
              requisitosValueRef.current = "";
              requisitosRef.current?.clear();
              navigation.navigate("Dashboard" as never);
            },
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.messagem || "Não foi possível criar a vaga");
      }
    } catch (error) {
      console.error("Erro ao criar vaga:", error);
      Alert.alert("Erro", "Ocorreu um erro ao criar a vaga. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  // Obtém a localização atual do dispositivo via expo-location com timeout e fallback
  const getCurrentLocationExpo = async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return null;
      }

      // tenta posição em cache primeiro
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

  // Abre o modal e inicializa coordenada temporária com a localização atual do dispositivo (se disponível)
  const openMapPicker = async () => {
    setMapLoading(true);

    const current = await getCurrentLocationExpo();

    if (current) {
      setTempCoord({ latitude: current.latitude, longitude: current.longitude });
    } else {
      // Fallback: Cajazeiras, Paraíba
      const lat = formValues.latitude ? parseFloat(formValues.latitude) : -6.8903;
      const lng = formValues.longitude ? parseFloat(formValues.longitude) : -38.5572;
      setTempCoord({ latitude: lat, longitude: lng });
    }

    setMapModalVisible(true);

    // pequeno delay para garantir montagem do MapView antes de animar
    setTimeout(() => {
      const coordToAnimate =
        tempCoord ??
        (formValues.latitude && formValues.longitude
          ? { latitude: parseFloat(formValues.latitude), longitude: parseFloat(formValues.longitude) }
          : { latitude: -6.8903, longitude: -38.5572 }); // Cajazeiras, PB

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
          // animateToRegion pode falhar em algumas versões; ignorar se ocorrer
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

    setValue("latitude", String(tempCoord.latitude));
    setValue("longitude", String(tempCoord.longitude));
    setMapModalVisible(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icone nome="arrow-back" tamanho={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Nova Vaga</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {/* Informações Básicas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Título da Vaga <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.titulo && styles.inputError]}
                value={formValues.titulo}
                onChangeText={(value) => setValue("titulo", value)}
                placeholder="Ex: Voluntário para Apoio Educacional"
                placeholderTextColor="#939EAA"
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect={true}
              />
              {errors.titulo && <Text style={styles.errorText}>{errors.titulo.message}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Descrição <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.descricao && styles.inputError]}
                value={formValues.descricao}
                onChangeText={(value) => setValue("descricao", value)}
                placeholder="Descreva as atividades e responsabilidades..."
                placeholderTextColor="#939EAA"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect={true}
              />
              {errors.descricao && <Text style={styles.errorText}>{errors.descricao.message}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Requisitos <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.hint}>Separe cada requisito por vírgula ou linha</Text>
              <TextInput
                ref={requisitosRef}
                style={[styles.input, styles.textArea, errors.requisitos && styles.inputError]}
                defaultValue=""
                onChangeText={(value) => {
                  requisitosValueRef.current = value;
                  setValue("requisitos", value);
                }}
                placeholder="Ex: Proatividade, Boa comunicação, Disponibilidade"
                placeholderTextColor="#939EAA"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect={true}
                autoComplete="off"
              />
              {errors.requisitos && <Text style={styles.errorText}>{errors.requisitos.message}</Text>}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>
                  Quantidade <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.quantidade && styles.inputError]}
                  value={formValues.quantidade}
                  onChangeText={(value) => setValue("quantidade", value)}
                  placeholder="0"
                  placeholderTextColor="#939EAA"
                  keyboardType="number-pad"
                />
                {errors.quantidade && <Text style={styles.errorText}>{errors.quantidade.message}</Text>}
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>
                  Duração <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.duracao && styles.inputError]}
                  value={formValues.duracao}
                  onChangeText={(value) => setValue("duracao", value)}
                  placeholder="Ex: 3 meses"
                  placeholderTextColor="#939EAA"
                  keyboardType="default"
                  autoCapitalize="sentences"
                  autoCorrect={true}
                />
                {errors.duracao && <Text style={styles.errorText}>{errors.duracao.message}</Text>}
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
                style={[styles.input, (errors.localizacao || errors.root) && styles.inputError]}
                value={formValues.localizacao}
                onChangeText={(value) => setValue("localizacao", value)}
                placeholder="Ex: Rua Exemplo, 123 - Bairro, Cidade"
                placeholderTextColor="#939EAA"
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={true}
              />
              {errors.localizacao && <Text style={styles.errorText}>{errors.localizacao.message}</Text>}
              {errors.root?.message && !errors.localizacao && <Text style={styles.errorText}>{errors.root.message}</Text>}
            </View>

            {/* Preview do mapa pequeno (opcional) */}
            <View style={styles.mapPreviewContainer}>
              <Text style={styles.label}>Local no mapa</Text>

              <View style={styles.mapPreview}>
                {formValues.latitude && formValues.longitude ? (
                  <MapView
                    ref={setMapRef}
                    style={styles.mapSmall}
                    initialRegion={{
                      latitude: parseFloat(formValues.latitude),
                      longitude: parseFloat(formValues.longitude),
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    pointerEvents="none"
                  >
                    <Marker
                      coordinate={{
                        latitude: parseFloat(formValues.latitude),
                        longitude: parseFloat(formValues.longitude),
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
                  <Text style={styles.chooseButtonText}>Abrir mapa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.chooseButton, { backgroundColor: "#E5E7EB" }]}
                  onPress={() => {
                    setValue("latitude", "");
                    setValue("longitude", "");
                  }}
                >
                  <Text style={[styles.chooseButtonText, { color: "#1A1A1A" }]}>Remover</Text>
                </TouchableOpacity>
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
                  style={[styles.optionButton, formValues.tipoTrabalho === tipo && styles.optionButtonActive]}
                  onPress={() => setValue("tipoTrabalho", tipo)}
                >
                  <Text style={[styles.optionText, formValues.tipoTrabalho === tipo && styles.optionTextActive]}>{tipo}</Text>
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
                  style={[styles.optionButton, formValues.status === status && styles.optionButtonActive]}
                  onPress={() => setValue("status", status)}
                >
                  <Text style={[styles.optionText, formValues.status === status && styles.optionTextActive]}>{status}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Botão de Criar */}
          <View style={styles.buttonContainer}>
            <Botao title={salvando ? "Criando Vaga..." : "Criar Vaga"} color="#295CA9" textColor="#fff" onPress={formHandleSubmit(onSubmit)} disabled={salvando} />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal do mapa (maior verticalmente) */}
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

          {/* Mapa ocupa mais altura (70% da tela) */}
          <MapView
            ref={setMapRef}
            style={styles.mapFull}
            initialRegion={{
              latitude: tempCoord ? tempCoord.latitude : -6.8903,
              longitude: tempCoord ? tempCoord.longitude : -38.5572,
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
  headerTitle: { fontSize: screenWidth < 350 ? 18 : 20, fontWeight: "bold", color: "#1A1A1A" },
  scrollView: { flex: 1 },
  formContainer: { paddingHorizontal: screenWidth * 0.05, paddingVertical: screenWidth < 350 ? 16 : 20, maxWidth: 600, width: "100%", alignSelf: "center" },
  section: { marginBottom: screenWidth < 350 ? 20 : 24 },
  sectionTitle: { fontSize: screenWidth < 350 ? 16 : 18, fontWeight: "bold", color: "#1A1A1A", marginBottom: 16 },
  inputGroup: { marginBottom: screenWidth < 350 ? 14 : 16 },
  label: { fontSize: screenWidth < 350 ? 13 : 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  required: { color: "#DC2626" },
  hint: { fontSize: screenWidth < 350 ? 11 : 12, color: "#6B7280", marginBottom: 8, fontStyle: "italic" },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: screenWidth < 350 ? 10 : 12, fontSize: screenWidth < 350 ? 14 : 16, color: "#1A1A1A", height: screenWidth < 350 ? 44 : 48 },
  inputError: { borderColor: "#DC2626" },
  errorText: { fontSize: 12, color: "#DC2626", marginTop: 4 },
  textArea: { height: "auto", minHeight: 100, paddingTop: 12 },
  row: { flexDirection: "row", gap: 12 },
  halfWidth: { flex: 1 },
  optionsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  optionButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB" },
  optionButtonActive: { backgroundColor: "#295CA9", borderColor: "#295CA9" },
  optionText: { fontSize: screenWidth < 350 ? 13 : 14, fontWeight: "600", color: "#6B7280" },
  optionTextActive: { color: "#fff" },
  buttonContainer: { marginTop: 8 },

  mapPreviewContainer: { marginTop: 8 },
  mapPreview: { height: 120, borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff" },
  mapSmall: { width: "100%", height: "100%" },
  mapEmpty: { flex: 1, justifyContent: "center", alignItems: "center" },
  chooseButton: { backgroundColor: "#295CA9", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  chooseButtonText: { color: "#fff", fontWeight: "600" },

  /* Modal styles */
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
  modalContent: { flex: 1 },
  // mapa maior verticalmente: ocupa cerca de 70% da altura do dispositivo
  mapFull: { width: "100%", height: screenHeight * 0.7 },
  mapLoading: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", zIndex: 10, backgroundColor: "rgba(255,255,255,0.6)" },
  modalFooter: { flexDirection: "row", alignItems: "center", padding: 16, borderTopWidth: 1, borderTopColor: "#E5E7EB", backgroundColor: "#fff" },
  saveButton: { backgroundColor: "#295CA9", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  saveButtonText: { color: "#fff", fontWeight: "600" },
});
