import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export interface BotaoProps {
    title: string;
    color?: string | undefined;
    largura?: number;
    altura?: number;
    textColor?: string | undefined;
    onPress: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary";
}



export default function Botao({ 
    title, 
    color, 
    largura, 
    altura, 
    textColor, 
    onPress, 
    disabled = false,
    variant = "primary" 
}: BotaoProps) {

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{
                    backgroundColor: color,
                    paddingVertical: altura ? 0 : 16,
                    paddingHorizontal: 24,
                    borderRadius: 10,
                    width: largura || "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: altura || 56,
                    opacity: disabled ? 0.6 : 1,
                    borderWidth: variant === "secondary" ? 2 : 0,
                    borderColor: variant === "secondary" ? "#295CA9" : "transparent",
                }}
                onPress={disabled ? undefined : onPress}
                disabled={disabled}
            >
                <Text style={{
                    color: textColor || "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                }}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    }
});