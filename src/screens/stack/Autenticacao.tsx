import Loading from "@/components/loading/Loading";
import { View } from "react-native";

export default function Autenticacao() {
  return (
    <View style={{ flex: 1 }}>
      <Loading message="Carregando..." />
    </View>
  );
}