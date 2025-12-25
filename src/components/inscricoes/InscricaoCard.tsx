import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icone from '../shared/Icone';

export interface InscricaoCardProps {
    titulo: string;
    status: string;
    localizacao: string;
    onCancelar?: () => void;
    onPress?: () => void;
}

export default function InscricaoCard({
    titulo,
    status,
    localizacao,
    onCancelar,
    onPress,
}: InscricaoCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.titulo}>{titulo}</Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.status}>{status}</Text>
                </View>
            </View>

            {/* Localização */}
            <View style={styles.infoItem}>
                <Icone nome="location-outline" tamanho={16} color="#666" />
                <Text style={styles.infoText} numberOfLines={1}>
                    {localizacao}
                </Text>
            </View>

            {/* Botão cancelar */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.botaoCancelar} onPress={onCancelar}>
                    <Text style={styles.botaoText}>Cancelar inscrição</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
        marginRight: 8,
    },
    statusContainer: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
        color: '#295CA9',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
        flex: 1,
    },
    footer: {
        alignItems: 'flex-end',
    },
    botaoCancelar: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    botaoText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
