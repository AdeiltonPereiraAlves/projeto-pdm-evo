import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icone from "../shared/Icone";

// Tipagem opcional do Stack (se você já tiver RootStackParamList definido, pode usar ele)
type NavigationProps = NativeStackNavigationProp<any>;

export default function BotaoVoltar() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        
        onPress={() => navigation.goBack()}
      >
        <Icone nome="arrow-back" tamanho={32} color="#0000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    // top: 40,  // 🔹 espaço do topo (ajuste para não sobrepor a status bar)
    // left: 20, // 🔹
    padding: 2,
    // backgroundColor: "#f5f5f5",
    borderRadius: 50,
  },
 
});
