import { View, Text } from "react-native";

export function Card() {
  return (
    <View className="m-4 p-4 rounded-2xl bg-red shadow">
      <Text className="text-lg font-medium text-gray-800">
        Eu sou um Card básico
      </Text>
    </View>
  );
}
