import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { View } from "react-native";
import "./global.css";

import Login from "./(auth)/login"
export default function HomeScreen() {
  return (
    <View style={styles.container}>
     <Login/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
});
