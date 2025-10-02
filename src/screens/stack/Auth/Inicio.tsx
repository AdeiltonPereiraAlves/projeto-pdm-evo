import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Botao from "../../../components/ui/Botao";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Inicio({ navigation }: any) {
  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bem-vindo ao EVO!</Text>
          <Text style={styles.subtitle}>
            Conectando voluntários e ONGs para transformar o mundo
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Botao
              title="Entrar"
              color="#295CA9"
              textColor="#FFFFFF"
              onPress={() => navigation.navigate("Login")}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Botao
              title="Cadastrar"
              color="#FFFFFF"
              textColor="#295CA9"
              variant="secondary"
              onPress={() => navigation.navigate("Cadastro")}
            />
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Faça parte dessa transformação social
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    minHeight: screenHeight,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: screenHeight * 0.08, // 8% da altura
    paddingHorizontal: screenWidth * 0.06, // 6% da largura
  },
  logoContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: screenHeight * 0.02,
  },
  logo: {
    width: Math.min(screenWidth * 0.5, 200), // Máximo 50% da largura ou 200px
    height: Math.min(screenWidth * 0.5, 200),
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: screenWidth * 0.05,
    marginBottom: screenHeight * 0.03,
  },
  title: {
    fontSize: screenWidth < 350 ? 26 : 32, // Ajusta para telas pequenas
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: screenWidth < 350 ? 14 : 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400, // Largura máxima para tablets
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
    paddingHorizontal: screenWidth * 0.05,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
  footerContainer: {
    marginTop: 20,
    paddingHorizontal: screenWidth * 0.05,
  },
  footerText: {
    fontSize: screenWidth < 350 ? 12 : 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
