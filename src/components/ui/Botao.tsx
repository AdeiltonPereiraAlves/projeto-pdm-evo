import { View, Text, TouchableOpacity } from "react-native";


export interface BotaoProps {
    title: string;
    color?: string | undefined;
    largura?: number;
    altura?: number;
    textColor?: string | undefined;
    onPress: () => void;
}



export default function Botao({ title, color, largura,altura, textColor, onPress }: BotaoProps) {

    return (
        <View className="flex-1 justify-center items-center bg-blue-500 h-full ">
            <TouchableOpacity
                style={{
                    backgroundColor: color, // agora pode ser qualquer string tipo 'blue' ou '#00f'
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 10,
                    width: largura,
                    alignItems: "center",
                    justifyContent: "center",
                    height: altura,

                }}
                onPress={onPress}
            >

                <Text style={{

                    color: textColor || "#fff", // cor do texto, padrão branco
                }}>{title}</Text>
            </TouchableOpacity>

        </View>
    )
}