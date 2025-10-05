import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
}

export default function CategoryFilter({ 
    categories, 
    selectedCategory, 
    onCategorySelect 
}: CategoryFilterProps) {
    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category && styles.selectedCategory
                        ]}
                        onPress={() => onCategorySelect(category)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category && styles.selectedCategoryText
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedCategory: {
        backgroundColor: '#295CA9',
        borderColor: '#295CA9',
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    selectedCategoryText: {
        color: '#fff',
        fontWeight: '600',
    },
});
