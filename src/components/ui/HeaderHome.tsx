import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icone from '../shared/Icone';

export interface HeaderHomeProps {
    nomeUsuario: string;
    onProfilePress?: () => void;
    onNotificationPress?: () => void;
}

export default function HeaderHome({ 
    nomeUsuario, 
    onProfilePress, 
    onNotificationPress 
}: HeaderHomeProps) {
    return (
        <View style={styles.container}>
            <View style={styles.greetingContainer}>
                {/* <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.nome}>{nomeUsuario}</Text> */}
            </View>
            
            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={onNotificationPress}
                >
                    <Icone nome="notifications-outline" tamanho={24} color="#666" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.profileButton} 
                    onPress={onProfilePress}
                >
                    <Icone nome="person-circle-outline" tamanho={32} color="#295CA9" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
       paddingTop: 30
    },
    greetingContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 16,
        color: '#666',
        marginBottom: 2,
    },
    nome: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginRight: 8,
    },
    profileButton: {
        padding: 4,
    },
});
