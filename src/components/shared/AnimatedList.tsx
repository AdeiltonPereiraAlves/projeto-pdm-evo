import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimatedListProps {
    children: React.ReactNode;
    index?: number;
    style?: ViewStyle;
}

export default function AnimatedList({ children, index = 0, style }: AnimatedListProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                delay: index * 100,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim, index]);

    return (
        <Animated.View
            style={[
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
}
