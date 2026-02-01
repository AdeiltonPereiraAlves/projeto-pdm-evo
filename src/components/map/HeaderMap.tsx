import Icone from "@/components/shared/Icone";
import { StyleSheet, Text, View } from "react-native";

export default function HeaderMap() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Icone nome="map" tamanho={24} color="#295CA9" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Mapa de Vagas</Text>
        <Text style={styles.subtitle}>Toque nos marcadores para ver detalhes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E8F0FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },
});
