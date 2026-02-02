

import { yupResolver } from "@hookform/resolvers/yup";
import Icone from "@/components/shared/Icone";
import Botao from "@/components/ui/Botao";
import { AuthContext } from "@/data/context/AuthContext";
import useAPI from "@/data/hooks/useAPI";
import { mascaraCNPJ, mascaraCPF, mascaraTelefone, removerMascara, validarTelefone } from "@/utils/masks";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type TipoUsuario = "ONG" | "VOLUNTARIO";

// Enum de áreas de atuação com labels amigáveis
const AREAS_ATUACAO = [
  { value: "EDUCACAO", label: "Educação" },
  { value: "SAUDE", label: "Saúde" },
  { value: "AMBIENTE", label: "Meio Ambiente" },
  { value: "TECNOLOGIA", label: "Tecnologia" },
  { value: "CULTURA", label: "Cultura" },
  { value: "DIREITOS_HUMANOS", label: "Direitos Humanos" },
  { value: "FOME", label: "Combate à Fome" },
  { value: "POBREZA", label: "Combate à Pobreza" },
  { value: "ANIMAL", label: "Proteção Animal" },
  { value: "CRIANCA", label: "Crianças" },
  { value: "MULHER", label: "Mulheres" },
  { value: "IGUALDADE", label: "Igualdade" },
  { value: "IDOSO", label: "Idosos" },
  { value: "LGBTQIA", label: "LGBTQIA+" },
  { value: "REFUGIADOS", label: "Refugiados" },
  { value: "EDUCACAO_INFANTIL", label: "Educação Infantil" },
  { value: "EMPREGO", label: "Emprego" },
  { value: "VOLUNTARIADO", label: "Voluntariado" },
  { value: "ESPORTES", label: "Esportes" },
  { value: "ARTE", label: "Arte" },
  { value: "FAMILIA", label: "Família" },
  { value: "SAUDE_MENTAL", label: "Saúde Mental" },
  { value: "REABILITACAO", label: "Reabilitação" },
  { value: "JUSTICA_SOCIAL", label: "Justiça Social" },
  { value: "SEGURANCA_ALIMENTAR", label: "Segurança Alimentar" },
  { value: "DESENVOLVIMENTO_SUSTENTAVEL", label: "Desenvolvimento Sustentável" },
  { value: "INFRAESTRUTURA", label: "Infraestrutura" },
  { value: "EMPODERAMENTO", label: "Empoderamento" },
  { value: "TECNOLOGIA_SOCIAL", label: "Tecnologia Social" },
];

/** Valores permitidos para disponibilidade (backend enum) */
const DISPONIBILIDADE_VALIDAS = ["manha", "tarde", "noite", "integral"];

const cadastroSchema = yup
  .object({
    tipoUsuario: yup.string().oneOf(["VOLUNTARIO", "ONG"]).required(),
    nome: yup
      .string()
      .trim()
      .required("O nome é obrigatório.")
      .min(10, "O nome deve ter no mínimo 10 caracteres.")
      .max(40, "O nome deve ter no máximo 40 caracteres."),
    email: yup.string().trim().required("O e-mail é obrigatório.").email("Informe um e-mail válido."),
    senha: yup
      .string()
      .required("A senha é obrigatória.")
      .min(6, "A senha deve ter no mínimo 6 caracteres.")
      .max(20, "A senha deve ter no máximo 20 caracteres."),
    confirmarSenha: yup
      .string()
      .required("Confirme a senha.")
      .oneOf([yup.ref("senha")], "As senhas não coincidem."),
    cpf: yup.string().trim().when("tipoUsuario", {
      is: "VOLUNTARIO",
      then: (s) =>
        s
          .required("O CPF é obrigatório.")
          .test("cpf-length", "O CPF deve ter 11 dígitos.", (v) => removerMascara(v || "").length === 11),
    }),
    contato: yup.string().trim().when("tipoUsuario", {
      is: "VOLUNTARIO",
      then: (s) =>
        s
          .required("O contato é obrigatório.")
          .test("contato-valido", "Informe um telefone válido (DDD + número).", (v) => validarTelefone(v || "")),
    }),
    habilidades: yup.string().when("tipoUsuario", {
      is: "VOLUNTARIO",
      then: (s) =>
        s.required("Informe pelo menos uma habilidade.").test("lista", "Informe pelo menos uma habilidade.", (v) =>
          (v || "")
            .split(",")
            .map((h) => h.trim())
            .filter((h) => h.length > 0).length > 0
        ),
    }),
    interesses: yup.string().when("tipoUsuario", {
      is: "VOLUNTARIO",
      then: (s) =>
        s.required("Informe pelo menos um interesse.").test("lista", "Informe pelo menos um interesse.", (v) =>
          (v || "")
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i.length > 0).length > 0
        ),
    }),
    disponibilidade: yup.string().when("tipoUsuario", {
      is: "VOLUNTARIO",
      then: (s) =>
        s
          .required("Informe pelo menos uma disponibilidade.")
          .test("disponibilidade", "Use: manhã, tarde, noite ou integral.", (v) => {
            const arr = (v || "")
              .split(",")
              .map((d) => d.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
              .filter((d) => d.length > 0);
            if (arr.length === 0) return false;
            return arr.every((d) => DISPONIBILIDADE_VALIDAS.includes(d));
          }),
    }),
    cnpj: yup.string().trim().when("tipoUsuario", {
      is: "ONG",
      then: (s) => s.required("O CNPJ é obrigatório."),
    }),
    areaAtuacao: yup.array().when("tipoUsuario", {
      is: "ONG",
      then: (s) => s.min(1, "Selecione pelo menos uma área de atuação."),
    }),
    endereco: yup.string().trim().when("tipoUsuario", {
      is: "ONG",
      then: (s) => s.required("O endereço é obrigatório."),
    }),
    descricao: yup.string().trim().when("tipoUsuario", {
      is: "ONG",
      then: (s) => s.required("A descrição é obrigatória."),
    }),
    visao: yup.string().trim().when("tipoUsuario", {
      is: "ONG",
      then: (s) => s.required("A visão é obrigatória."),
    }),
    missao: yup.string().trim().when("tipoUsuario", {
      is: "ONG",
      then: (s) => s.required("A missão é obrigatória."),
    }),
  })
  .required();

type CadastroFormData = yup.InferType<typeof cadastroSchema>;

/** Valida todos os campos do cadastro de voluntário. Retorna mensagem de erro ou null. */
function validarCamposVoluntario(params: {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpf: string;
  contato: string;
  habilidades: string;
  interesses: string;
  disponibilidade: string;
}): string | null {
  const { nome, email, senha, confirmarSenha, cpf, contato, habilidades, interesses, disponibilidade } = params;

  const nomeTrim = nome.trim();
  if (!nomeTrim) return "O nome é obrigatório.";
  if (nomeTrim.length < 10) return "O nome deve ter no mínimo 10 caracteres.";
  if (nomeTrim.length > 40) return "O nome deve ter no máximo 40 caracteres.";

  const emailTrim = email.trim();
  if (!emailTrim) return "O e-mail é obrigatório.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailTrim)) return "Informe um e-mail válido.";

  if (!senha) return "A senha é obrigatória.";
  if (senha.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
  if (senha.length > 20) return "A senha deve ter no máximo 20 caracteres.";

  if (!confirmarSenha) return "Confirme a senha.";
  if (senha !== confirmarSenha) return "As senhas não coincidem.";

  const cpfTrim = cpf.trim();
  if (!cpfTrim) return "O CPF é obrigatório.";
  const cpfNumeros = removerMascara(cpfTrim);
  if (cpfNumeros.length !== 11) return "O CPF deve ter 11 dígitos.";

  if (!contato || !contato.trim()) return "O contato é obrigatório.";
  if (!validarTelefone(contato)) return "Informe um telefone válido (DDD + número).";

  const habilidadesLista = habilidades.split(",").map((h) => h.trim()).filter((h) => h.length > 0);
  if (habilidadesLista.length === 0) return "Informe pelo menos uma habilidade.";

  const interessesLista = interesses.split(",").map((i) => i.trim()).filter((i) => i.length > 0);
  if (interessesLista.length === 0) return "Informe pelo menos um interesse.";

  const disponibilidadeNormalizada = disponibilidade
    .split(",")
    .map((d) => d.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    .filter((d) => d.length > 0);
  if (disponibilidadeNormalizada.length === 0) return "Informe pelo menos uma disponibilidade (ex.: manhã, tarde, noite, integral).";
  const invalidas = disponibilidadeNormalizada.filter((d) => !DISPONIBILIDADE_VALIDAS.includes(d));
  if (invalidas.length > 0) return "Disponibilidade inválida. Use: manhã, tarde, noite ou integral.";

  return null;
}

/** Parseia resposta de erro (JSON ou texto) para exibir mensagem ao usuário */
async function parseErrorResponse(
  res: Response
): Promise<{ message?: string; erros?: Array<Record<string, string>> }> {
  const text = await res.text();
  if (!text) return { message: "Erro ao processar resposta." };
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

const cadastroDefaultValues: CadastroFormData = {
  tipoUsuario: "VOLUNTARIO",
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  cpf: "",
  contato: "",
  habilidades: "",
  interesses: "",
  disponibilidade: "",
  cnpj: "",
  areaAtuacao: [],
  endereco: "",
  descricao: "",
  visao: "",
  missao: "",
};

export default function Cadastro() {
  const { login } = useContext(AuthContext);
  const { httpPost } = useAPI();
  const navigation = useNavigation<any>();

  const {
    setValue,
    handleSubmit: formHandleSubmit,
    watch,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: yupResolver(cadastroSchema) as any,
    defaultValues: cadastroDefaultValues,
    mode: "onSubmit",
  });

  const tipoUsuario = watch("tipoUsuario") ?? "VOLUNTARIO";
  const nome = watch("nome") ?? "";
  const email = watch("email") ?? "";
  const senha = watch("senha") ?? "";
  const confirmarSenha = watch("confirmarSenha") ?? "";
  const cpf = watch("cpf") ?? "";
  const contato = watch("contato") ?? "";
  const habilidades = watch("habilidades") ?? "";
  const interesses = watch("interesses") ?? "";
  const disponibilidade = watch("disponibilidade") ?? "";
  const cnpj = watch("cnpj") ?? "";
  const areaAtuacaoSelecionadas = watch("areaAtuacao") ?? [];
  const endereco = watch("endereco") ?? "";
  const descricao = watch("descricao") ?? "";
  const visao = watch("visao") ?? "";
  const missao = watch("missao") ?? "";

  const [modalVisivel, setModalVisivel] = useState(false);

  const setTipoUsuario = (t: TipoUsuario) => setValue("tipoUsuario", t);
  const toggleAreaAtuacao = (area: string) => {
    setValue(
      "areaAtuacao",
      areaAtuacaoSelecionadas.includes(area)
        ? areaAtuacaoSelecionadas.filter((a) => a !== area)
        : [...areaAtuacaoSelecionadas, area]
    );
  };

  const onSubmit = async (data: CadastroFormData) => {
    try {
      const contatoLimpo = (data.contato || "").replace(/\D/g, "");

      const body = data.tipoUsuario === "ONG"
        ? {
            nome: (data.nome || "").trim(),
            email: (data.email || "").trim(),
            descricao: (data.descricao || "").trim(),
            visao: (data.visao || "").trim(),
            missao: (data.missao || "").trim(),
            senha: data.senha,
            cnpj: (data.cnpj || "").trim(),
            areaAtuacao: data.areaAtuacao ?? [],
            endereco: (data.endereco || "").trim(),
            tipo: "ONG",
          }
        : {
            nome: (data.nome || "").trim(),
            email: (data.email || "").trim(),
            tipo: "VOLUNTARIO",
            senha: data.senha,
            contato: contatoLimpo,
            cpf: (data.cpf || "").trim(),
            habilidades: (data.habilidades || "")
              .split(",")
              .map((h) => h.trim())
              .filter((h) => h.length > 0),
            interesses: (data.interesses || "")
              .split(",")
              .map((i) => i.trim())
              .filter((i) => i.length > 0),
            disponibilidade: (data.disponibilidade || "")
              .split(",")
              .map((d) =>
                d
                  .trim()
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              )
              .filter((d) => d.length > 0),
          };

      console.log(body, "bodyCadastro");

      if (body.tipo === "VOLUNTARIO") {
        const res = await httpPost("registrar", body);
        if (res.ok) {
          const data = await res.json();
          await login(data.token, tipoUsuario, data.usuario);
          navigation.navigate("Abas");
          return;
        }
        const data = await parseErrorResponse(res);
        if (res.status === 422 && Array.isArray(data.erros)) {
          const mensagens = data.erros
            .map((e: Record<string, string>) => Object.values(e)[0])
            .filter(Boolean);
          alert(mensagens.join("\n"));
        } else {
          alert(data.message || "Erro ao cadastrar");
        }
      } else {
        const res = await httpPost("ong/registrar", body);
        if (res.ok) {
          const data = await res.json();
          await login(data.token, tipoUsuario, data.usuario);
          navigation.navigate("Abas");
          return;
        }
        const data = await parseErrorResponse(res);
        if (res.status === 422 && Array.isArray(data.erros)) {
          const mensagens = data.erros
            .map((e: Record<string, string>) => Object.values(e)[0])
            .filter(Boolean);
          alert(mensagens.join("\n"));
        } else {
          alert(data.message || "Erro ao cadastrar");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor");
    }
  };

  const getAreaLabel = (value: string) => {
    const area = AREAS_ATUACAO.find(item => item.value === value);
    return area ? area.label : value;
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icone nome="arrow-back" tamanho={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Cadastro</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Tipo de Usuário Toggle */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.toggleButton,
                tipoUsuario === "VOLUNTARIO" && styles.toggleButtonActive,
              ]}
              onPress={() => setTipoUsuario("VOLUNTARIO")}
            >
              <Text
                style={[
                  styles.toggleText,
                  tipoUsuario === "VOLUNTARIO" && styles.toggleTextActive,
                ]}
              >
                Voluntário
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.toggleButton,
                tipoUsuario === "ONG" && styles.toggleButtonActive,
              ]}
              onPress={() => setTipoUsuario("ONG")}
            >
              <Text
                style={[
                  styles.toggleText,
                  tipoUsuario === "ONG" && styles.toggleTextActive,
                ]}
              >
                ONG
              </Text>
            </Pressable>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Campo Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome {tipoUsuario === "ONG" ? "da ONG" : "Completo"}</Text>
              <TextInput
                style={[styles.input, errors.nome && styles.inputError]}
                placeholder={tipoUsuario === "ONG" ? "Nome da Organização" : "Seu nome completo"}
                value={nome}
                onChangeText={(v) => setValue("nome", v)}
                placeholderTextColor="#939EAA"
              />
              {errors.nome && <Text style={styles.errorText}>{errors.nome.message}</Text>}
            </View>

            {/* Campo E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="seu.email@exemplo.com"
                value={email}
                onChangeText={(v) => setValue("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#939EAA"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>

            {/* Campos específicos por tipo */}
            {tipoUsuario === "ONG" ? (
              <>
                {/* descrição */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Descrição</Text>
                  <TextInput
                    style={[styles.input, errors.descricao && styles.inputError]}
                    placeholder="Descrição da ONG"
                    value={descricao}
                    onChangeText={(v) => setValue("descricao", v)}
                    placeholderTextColor="#939EAA"
                  />
                  {errors.descricao && <Text style={styles.errorText}>{errors.descricao.message}</Text>}
                </View>
                {/* visão */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Visão</Text>
                  <TextInput
                    style={[styles.input, errors.visao && styles.inputError]}
                    placeholder="Visão da ONG"
                    value={visao}
                    onChangeText={(v) => setValue("visao", v)}
                    placeholderTextColor="#939EAA"
                  />
                  {errors.visao && <Text style={styles.errorText}>{errors.visao.message}</Text>}
                </View>
                {/* missão */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Missão</Text>
                  <TextInput
                    style={[styles.input, errors.missao && styles.inputError]}
                    placeholder="Missão da ONG"
                    value={missao}
                    onChangeText={(v) => setValue("missao", v)}
                    placeholderTextColor="#939EAA"
                  />
                  {errors.missao && <Text style={styles.errorText}>{errors.missao.message}</Text>}
                </View>
                {/* CNPJ */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CNPJ</Text>
                  <TextInput
                    style={[styles.input, errors.cnpj && styles.inputError]}
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChangeText={(text) => setValue("cnpj", mascaraCNPJ(text))}
                    keyboardType="numeric"
                    placeholderTextColor="#939EAA"
                    maxLength={18}
                  />
                  {errors.cnpj && <Text style={styles.errorText}>{errors.cnpj.message}</Text>}
                </View>

                {/* Área de Atuação - Select */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Área de Atuação</Text>
                  <Pressable
                    style={[styles.selectInput, errors.areaAtuacao && styles.inputError]}
                    onPress={() => setModalVisivel(true)}
                  >
                    <Text style={[
                      styles.selectInputText,
                      areaAtuacaoSelecionadas.length === 0 && styles.placeholderText
                    ]}>
                      {areaAtuacaoSelecionadas.length === 0
                        ? "Selecione as áreas de atuação"
                        : `${areaAtuacaoSelecionadas.length} área(s) selecionada(s)`}
                    </Text>
                    <Icone nome="arrow-down-outline" tamanho={24} color="#666" />
                  </Pressable>
                  
                  {/* Tags das áreas selecionadas */}
                  {errors.areaAtuacao && <Text style={styles.errorText}>{errors.areaAtuacao.message}</Text>}
                  {areaAtuacaoSelecionadas.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {areaAtuacaoSelecionadas.map((area, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{getAreaLabel(area)}</Text>
                          <TouchableOpacity
                            onPress={() => toggleAreaAtuacao(area)}
                            style={styles.tagClose}
                          >
                            <Icone nome="close" tamanho={14} color="#666" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Modal de seleção */}
                <Modal
                  visible={modalVisivel}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setModalVisivel(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Selecionar Áreas de Atuação</Text>
                        <TouchableOpacity
                          onPress={() => setModalVisivel(false)}
                          style={styles.modalCloseButton}
                        >
                          <Icone nome="close" tamanho={24} color="#666" />
                        </TouchableOpacity>
                      </View>
                      
                      <FlatList
                        data={AREAS_ATUACAO}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[
                              styles.modalItem,
                              areaAtuacaoSelecionadas.includes(item.value) && styles.modalItemSelected
                            ]}
                            onPress={() => toggleAreaAtuacao(item.value)}
                          >
                            <Text style={[
                              styles.modalItemText,
                              areaAtuacaoSelecionadas.includes(item.value) && styles.modalItemTextSelected
                            ]}>
                              {item.label}
                            </Text>
                            {areaAtuacaoSelecionadas.includes(item.value) && (
                              <Icone nome="checkmark"  tamanho={20} color="#295CA9" />
                            )}
                          </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.modalList}
                      />
                      
                      <View style={styles.modalFooter}>
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={() => setModalVisivel(false)}
                        >
                          <Text style={styles.modalButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

                {/* Endereço */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Endereço</Text>
                  <TextInput
                    style={[styles.input, errors.endereco && styles.inputError]}
                    placeholder="Rua, número, bairro, cidade"
                    value={endereco}
                    onChangeText={(v) => setValue("endereco", v)}
                    placeholderTextColor="#939EAA"
                  />
                  {errors.endereco && <Text style={styles.errorText}>{errors.endereco.message}</Text>}
                </View>
              </>
            ) : (
              <>
                {/* CPF */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CPF</Text>
                  <TextInput
                    style={[styles.input, errors.cpf && styles.inputError]}
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChangeText={(text) => setValue("cpf", mascaraCPF(text))}
                    keyboardType="numeric"
                    placeholderTextColor="#939EAA"
                    maxLength={14}
                  />
                  {errors.cpf && <Text style={styles.errorText}>{errors.cpf.message}</Text>}
                </View>

                {/* Contato */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contato</Text>
                  <TextInput
                    style={[styles.input, errors.contato && styles.inputError]}
                    placeholder="(00) 00000-0000"
                    value={contato}
                    onChangeText={(text) => setValue("contato", mascaraTelefone(text))}
                    keyboardType="phone-pad"
                    placeholderTextColor="#939EAA"
                    maxLength={15}
                  />
                  {errors.contato && <Text style={styles.errorText}>{errors.contato.message}</Text>}
                </View>

                {/* Habilidades */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Habilidades</Text>
                  <TextInput
                    style={[styles.input, styles.inputMultiline, errors.habilidades && styles.inputError]}
                    placeholder="Ex: Ensino, Tecnologia, Culinária"
                    value={habilidades}
                    onChangeText={(v) => setValue("habilidades", v)}
                    multiline
                    numberOfLines={3}
                    placeholderTextColor="#939EAA"
                  />
                  {errors.habilidades && <Text style={styles.errorText}>{errors.habilidades.message}</Text>}
                </View>
                {/* Interesses */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Interesses</Text>
                  <TextInput
                    style={[styles.input, styles.inputMultiline, errors.interesses && styles.inputError]}
                    placeholder="Ex: Ensino, Tecnologia, Culinária"
                    value={interesses}
                    onChangeText={(v) => setValue("interesses", v)}
                    multiline
                    numberOfLines={3}
                    placeholderTextColor="#939EAA"
                  />
                  {errors.interesses && <Text style={styles.errorText}>{errors.interesses.message}</Text>}
                </View>
                {/* Disponibilidade */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Disponibilidade</Text>
                  <TextInput
                    style={[styles.input, styles.inputMultiline, errors.disponibilidade && styles.inputError]}
                    placeholder="Ex: Manhã, Tarde, Noite"
                    value={disponibilidade}
                    onChangeText={(v) => setValue("disponibilidade", v)}
                    multiline
                    numberOfLines={3}
                    placeholderTextColor="#939EAA"
                  />
                  {errors.disponibilidade && <Text style={styles.errorText}>{errors.disponibilidade.message}</Text>}
                </View>
              </>
            )}

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={[styles.input, errors.senha && styles.inputError]}
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChangeText={(v) => setValue("senha", v)}
                secureTextEntry
                placeholderTextColor="#939EAA"
              />
              {errors.senha && <Text style={styles.errorText}>{errors.senha.message}</Text>}
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput
                style={[styles.input, errors.confirmarSenha && styles.inputError]}
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChangeText={(v) => setValue("confirmarSenha", v)}
                secureTextEntry
                placeholderTextColor="#939EAA"
              />
              {errors.confirmarSenha && <Text style={styles.errorText}>{errors.confirmarSenha.message}</Text>}
            </View>
          </View>

          {/* Botão Cadastrar */}
          <View style={styles.buttonContainer}>
            <Botao
              title="Cadastrar"
              color="#295CA9"
              textColor="#FFFFFF"
              onPress={() => formHandleSubmit((data) => onSubmit(data as CadastroFormData))()}
            />
          </View>

          {/* Link para Login */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}>Faça login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.06,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    paddingHorizontal: screenWidth * 0.06,
    paddingTop: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 4,
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#295CA9",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
    height: 56,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#FFFFFF",
    height: 56,
  },
  selectInputText: {
    fontSize: 16,
    color: "#1A1A1A",
    flex: 1,
  },
  placeholderText: {
    color: "#939EAA",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: "#295CA9",
    marginRight: 6,
  },
  tagClose: {
    padding: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalList: {
    paddingHorizontal: 20,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalItemSelected: {
    backgroundColor: "#F0F7FF",
  },
  modalItemText: {
    fontSize: 16,
    color: "#1A1A1A",
    flex: 1,
  },
  modalItemTextSelected: {
    color: "#295CA9",
    fontWeight: "600",
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  modalButton: {
    backgroundColor: "#295CA9",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  footerLink: {
    fontSize: 14,
    color: "#295CA9",
    fontWeight: "600",
  },
});