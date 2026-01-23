import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

interface CandidaturasChartProps {
    pendentes: number;
    aprovados: number;
    totalCandidaturas: number;
}

export default function CandidaturasChart({ pendentes, aprovados, totalCandidaturas }: CandidaturasChartProps) {
    if (totalCandidaturas === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Não há candidaturas para exibir</Text>
            </View>
        );
    }

    const data = {
        labels: ['Pendentes', 'Aprovados'],
        datasets: [
            {
                data: [pendentes, aprovados],
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Status das Candidaturas</Text>
            <View style={styles.chartContainer}>
                <BarChart
                    data={data}
                    width={screenWidth * 0.85}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        barPercentage: 0.6,
                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                        propsForBackgroundLines: {
                            strokeWidth: 0,
                        },
                    }}
                    fromZero
                    showValuesOnTopOfBars
                    withInnerLines={false}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    segments={2}
                />
            </View>
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
                    <Text style={styles.legendText}>Pendentes ({pendentes})</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#22c55e' }]} />
                    <Text style={styles.legendText}>Aprovados ({aprovados})</Text>
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
