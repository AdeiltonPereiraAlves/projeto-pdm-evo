import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Icone from '../shared/Icone';

export interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    onSearch?: () => void;
    onFilterPress?: () => void;
}

export default function SearchBar({ 
    placeholder = "Buscar oportunidades...",
    value,
    onChangeText,
    onSearch,
    onFilterPress
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Icone nome="search-outline" tamanho={20} color="#666" />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor="#999"
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={() => onChangeText('')}>
                        <Icone nome="close-circle" tamanho={20} color="#666" />
                    </TouchableOpacity>
                )}
            </View>
            
            {/* <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                <Icone nome="options-outline" tamanho={20} color="#295CA9" />
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
       paddingLeft:10,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 2,
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
        marginLeft: 8,
    },
    // filterButton: {
    //     backgroundColor: '#f5f5f5',
    //     borderRadius: 25,
    //     padding: 12,
    //     width: 50,
    //     height: 50,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
});
