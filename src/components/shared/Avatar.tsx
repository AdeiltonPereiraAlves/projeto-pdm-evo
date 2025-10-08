import Icone from "@/components/shared/Icone";
import { useVagas } from "@/data/context/VagaContext";
import { API_URL } from '@env';
import { useEffect } from "react";
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
    const baseURL = API_URL// seu backend
    const imagemURL = `${baseURL}/images/${uri}`;
    const{carregarFotoPerfil } = useVagas()
    useEffect(()=> {
        carregarFotoPerfil(imagemURL)
    },[])

    const content = (
        <View style={styles.container}>
         
            {/* <Image

                source={{ uri: imagemURL }}
                style={{ width: 100, height: 100, borderRadius: 60, backgroundColor: "#f5f5f5", marginRight: 8 }}
            /> */}
            {imagemURL ? (
                <Image 
                    source={{ uri:imagemURL}} 
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
                        nome="arrow-back-circle"
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

