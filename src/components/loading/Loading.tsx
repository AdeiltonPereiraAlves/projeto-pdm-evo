import { useEffect } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type LoadingVariant = 'screen' | 'overlay';

type LoadingProps = {
  /** Mensagem exibida abaixo do ícone (ex: "Carregando vagas...") */
  message?: string;
  /** screen = tela inteira; overlay = camada sobre conteúdo (fundo semi-transparente) */
  variant?: LoadingVariant;
  /** Estilo adicional no container */
  style?: ViewStyle;
};

export default function Loading({
  message = 'Carregando...',
  variant = 'screen',
  style,
}: LoadingProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }));

  return (
    <View style={[styles.container, variant === 'overlay' && styles.overlay, style]}>
      <Animated.Image
        source={require('../../../assets/images/icon-loading.png')}
        style={[styles.icon, variant === 'overlay' && styles.iconOverlay, animatedStyle]}
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    zIndex: 10,
  },
  icon: {
    width: 100,
    height: 100,
  },
  iconOverlay: {
    width: 72,
    height: 72,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});
