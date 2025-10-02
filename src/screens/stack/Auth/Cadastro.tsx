import Icone from "@/src/components/shared/Icone";
import Botao from "@/src/components/ui/Botao";
import { AuthContext } from "@/src/data/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type TipoUsuario = "ONG" | "VOLUNTARIO";

export default function Cadastro() {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  
  // Estado para tipo de usuário
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("VOLUNTARIO");
  
  // Estados comuns
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  // Estados específicos ONG
  const [cnpj, setCnpj] = useState("");
  const [areaAtuacao, setAreaAtuacao] = useState("");
  const [endereco, setEndereco] = useState("");
  
  // Estados específicos Voluntário
  const [cpf, setCpf] = useState("");
  const [contato, setContato] = useState("");
  const [habilidades, setHabilidades] = useState("");

  const handleCadastro = async () => {
    // Validações básicas
    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    if (tipoUsuario === "ONG" && (!cnpj || !areaAtuacao || !endereco)) {
      alert("Por favor, preencha todos os campos da ONG");
      return;
    }

    if (tipoUsuario === "VOLUNTARIO" && (!cpf || !contato || !habilidades)) {
      alert("Por favor, preencha todos os campos do Voluntário");
      return;
    }

    try {
      const body = tipoUsuario === "ONG" 
        ? { nome, email, senha, cnpj, areaAtuacao, endereco, tipo: "ONG" }
        : { nome, email, senha, cpf, contato, habilidades, tipo: "VOLUNTARIO" };

      const res = await fetch("http://192.168.0.104:3001/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        await login(data.token, tipoUsuario);
        navigation.reset({
          index: 0,
          routes: [{ name: "Abas" }],
        });
      } else {
        alert(data.msg || "Erro ao cadastrar");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor");
    }
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
                style={styles.input}
                placeholder={tipoUsuario === "ONG" ? "Nome da Organização" : "Seu nome completo"}
                value={nome}
                onChangeText={setNome}
                placeholderTextColor="#939EAA"
              />
            </View>

            {/* Campo E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="seu.email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#939EAA"
              />
            </View>

            {/* Campos específicos por tipo */}
            {tipoUsuario === "ONG" ? (
              <>
                {/* CNPJ */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CNPJ</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChangeText={setCnpj}
                    keyboardType="numeric"
                    placeholderTextColor="#939EAA"
                  />
                </View>

                {/* Área de Atuação */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Área de Atuação</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Educação, Saúde, Meio Ambiente"
                    value={areaAtuacao}
                    onChangeText={setAreaAtuacao}
                    placeholderTextColor="#939EAA"
                  />
                </View>

                {/* Endereço */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Endereço</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Rua, número, bairro, cidade"
                    value={endereco}
                    onChangeText={setEndereco}
                    placeholderTextColor="#939EAA"
                  />
                </View>
              </>
            ) : (
              <>
                {/* CPF */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CPF</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChangeText={setCpf}
                    keyboardType="numeric"
                    placeholderTextColor="#939EAA"
                  />
                </View>

                {/* Contato */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contato</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(00) 00000-0000"
                    value={contato}
                    onChangeText={setContato}
                    keyboardType="phone-pad"
                    placeholderTextColor="#939EAA"
                  />
                </View>

                {/* Habilidades */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Habilidades</Text>
                  <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    placeholder="Ex: Ensino, Tecnologia, Culinária"
                    value={habilidades}
                    onChangeText={setHabilidades}
                    multiline
                    numberOfLines={3}
                    placeholderTextColor="#939EAA"
                  />
                </View>
              </>
            )}

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                placeholderTextColor="#939EAA"
              />
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
                placeholderTextColor="#939EAA"
              />
            </View>
          </View>

          {/* Botão Cadastrar */}
          <View style={styles.buttonContainer}>
            <Botao
              title="Cadastrar"
              color="#295CA9"
              textColor="#FFFFFF"
              onPress={handleCadastro}
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