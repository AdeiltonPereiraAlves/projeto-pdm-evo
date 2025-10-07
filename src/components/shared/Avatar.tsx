import Icone from "@/components/shared/Icone";
import { Image, Pressable, StyleSheet, View } from "react-native";

export interface AvatarProps {
    uri?: string;
    size?: number;
    iconName?: string;
    iconSize?: number;
    borderColor?: string;
    borderWidth?: number;
    backgroundColor?: string;
    onPress?: () => void;
    editable?: boolean;
}

export default function Avatar({
    uri,
    size = 120,
    iconName = "person",
    iconSize,
    borderColor = "#295CA9",
    borderWidth = 3,
    backgroundColor = "#295CA9",
    onPress,
    editable = false,
}: AvatarProps) {
    const calculatedIconSize = iconSize || size / 2;
    const borderRadius = size / 2;

    const content = (
        <View style={styles.container}>
            {uri ? (
                <Image 
                    source={{ uri }} 
                    style={[
                        styles.image,
                        {
                            width: size,
                            height: size,
                            borderRadius,
                            borderWidth,
                            borderColor,
                        }
                    ]}
                />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        {
                            width: size,
                            height: size,
                            borderRadius,
                            borderWidth,
                            borderColor,
                            backgroundColor,
                        }
                    ]}
                >
                    <Icone 
                        nome={iconName} 
                        tamanho={calculatedIconSize} 
                        color="#fff" 
                    />
                </View>
            )}
            
            {editable && (
                <Pressable 
                    style={[
                        styles.editButton,
                        {
                            width: size / 3,
                            height: size / 3,
                            borderRadius: size / 6,
                        }
                    ]}
                    onPress={onPress}
                >
                    <Icone 
                        nome="camera" 
                        tamanho={size / 6} 
                        color="#fff" 
                    />
                </Pressable>
            )}
        </View>
    );

    return onPress && !editable ? (
        <Pressable onPress={onPress}>
            {content}
        </Pressable>
    ) : content;
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    image: {
        resizeMode: "cover",
    },
    placeholder: {
        justifyContent: "center",
        alignItems: "center",
    },
    editButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#295CA9",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },
});

