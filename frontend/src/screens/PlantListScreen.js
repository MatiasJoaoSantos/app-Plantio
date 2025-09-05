import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { PlantIcon } from '../components/Icons';

// Função auxiliar para formatar a data
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const PlantListScreen = ({ plants, onSelectPlant, onGoToRegister }) => {
    const renderItem = ({ item }) => (
        <Pressable style={styles.plantItem} onPress={() => onSelectPlant(item)}>
            <PlantIcon />
            <View>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.plantDate}>Plantada em: {formatDate(item.planting_date)}</Text>
            </View>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Minhas Plantas</Text>
            </View>

            <FlatList
                data={plants}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma planta registrada ainda.</Text>}
            />

            <Pressable onPress={onGoToRegister} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Registrar Nova Planta</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 24,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    listContainer: {
        paddingBottom: 80, // Espaço para o botão flutuante
    },
    plantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    plantName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    plantDate: {
        fontSize: 12,
        color: '#6b7280',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#6b7280',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        left: 24,
        right: 24,
        paddingVertical: 16,
        backgroundColor: '#16a34a',
        borderRadius: 12,
        alignItems: 'center',
        elevation: 5,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default PlantListScreen;
