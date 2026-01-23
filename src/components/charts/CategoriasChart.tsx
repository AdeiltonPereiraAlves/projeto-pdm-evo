import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

interface CategoriasChartProps {
    categorias: { [key: string]: number };
}

export default function CategoriasChart({ categorias }: CategoriasChartProps) {
    const categoriasArray = Object.entries(categorias)
        .filter(([_, quantidade]) => quantidade > 0)
        .map(([nome, quantidade]) => ({
            name: nome || 'Outras',
            population: quantidade,
            color: '',
            legendFontColor: '#1A1A1A',
            legendFontSize: 12,
        }));

    if (categoriasArray.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Não há vagas por categoria para exibir</Text>
            </View>
        );
    }

    const colors = ['#295CA9', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
    const chartData = categoriasArray.map((item, index) => ({
        ...item,
        color: colors[index % colors.length],
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vagas por Categoria</Text>
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
                {chartData.map((item, index) => (
                    <View key={item.name} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>
                            {item.name} ({item.population})
                        </Text>
                    </View>
                ))}
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
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginVertical: 4,
    },
    legendColor: {
        width: 14,
        height: 14,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 12,
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
