import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

interface VagasStatusChartProps {
    vagasAbertas: number;
    vagasFechadas: number;
    totalVagas: number;
}

export default function VagasStatusChart({ vagasAbertas, vagasFechadas, totalVagas }: VagasStatusChartProps) {
    if (totalVagas === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Não há dados para exibir</Text>
            </View>
        );
    }

    const chartData = [
        {
            name: 'Abertas',
            population: vagasAbertas,
            color: '#22c55e',
            legendFontColor: '#1A1A1A',
            legendFontSize: 14,
        },
        {
            name: 'Fechadas',
            population: vagasFechadas,
            color: '#ef4444',
            legendFontColor: '#1A1A1A',
            legendFontSize: 14,
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Status das Vagas</Text>
            <View style={styles.chartContainer}>
                <PieChart
                    data={chartData}
                    width={screenWidth * 0.85}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#22c55e' }]} />
                    <Text style={styles.legendText}>Abertas ({vagasAbertas})</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.legendText}>Fechadas ({vagasFechadas})</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
        textAlign: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        gap: 24,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
    },
});
