import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LocationIcon, PlantIcon, TimelineIcon } from '../components/Icons';

const TimelineScreen = ({ plant, onAddPhase, onBack }) => {
    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <PlantIcon />
                <Text style={styles.title}>Linha do Tempo</Text>
            </View>
            <Text style={styles.plantName}>{plant.name}</Text>
            
            <ScrollView style={styles.timelineContainer}>
                {plant.timeline.map((event, index) => (
                    <View key={index} style={styles.eventItem}>
                        <TimelineIcon phase={event.phase} />
                        <View style={styles.eventDetails}>
                            <Text style={styles.eventPhase}>{event.phase}</Text>
                            {/* --- CORREÇÃO APLICADA AQUI --- */}
                            {/* O nome do campo no JSON de resposta é 'event_date', não 'date' */}
                            <Text style={styles.eventDate}>{new Date(event.event_date).toLocaleString('pt-BR')}</Text>
                            {/* --- FIM DA CORREÇÃO --- */}
                            {event.location && (
                                <View style={styles.eventLocation}>
                                    <LocationIcon />
                                    <Text style={styles.eventLocationText}>
                                        {event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.actionsContainer}>
                <Text style={styles.actionsTitle}>Adicionar Nova Fase:</Text>
                <View style={styles.buttonsGrid}>
                    <Pressable onPress={() => onAddPhase('Irrigação')} style={[styles.phaseButton, styles.irrigationButton]}>
                        <Text style={styles.phaseButtonText}>💧 Irrigação</Text>
                    </Pressable>
                    <Pressable onPress={() => onAddPhase('Adubação')} style={[styles.phaseButton, styles.fertilizeButton]}>
                        <Text style={styles.phaseButtonText}>🧪 Adubação</Text>
                    </Pressable>
                    <Pressable onPress={() => onAddPhase('Colheita')} style={[styles.phaseButton, styles.harvestButton]}>
                        <Text style={styles.phaseButtonText}>🌾 Colheita</Text>
                    </Pressable>
                </View>
            </View>

            <Pressable onPress={onBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>Registar Nova Planta</Text>
            </Pressable>
        </View>
    );
};

// ... Estilos (ver abaixo)
const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
    plantName: {
        textAlign: 'center',
        fontSize: 18,
        color: '#15803d',
        fontWeight: '600',
        marginBottom: 24,
    },
    timelineContainer: {
        flex: 1, // Permite que a lista ocupe o espaço disponível
        marginBottom: 24,
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        marginBottom: 12,
    },
    eventDetails: { flex: 1 },
    eventPhase: { fontWeight: 'bold', color: '#111827', fontSize: 16 },
    eventDate: { fontSize: 12, color: '#6b7280' },
    eventLocation: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    eventLocationText: { marginLeft: 4, fontSize: 12, color: '#2563eb' },
    actionsContainer: { marginBottom: 24, gap: 8 },
    actionsTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        textAlign: 'center',
    },
    buttonsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    phaseButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
    },
    phaseButtonText: { color: 'white', fontWeight: '600', fontSize: 12 },
    irrigationButton: { backgroundColor: '#3b82f6' }, // blue-500
    fertilizeButton: { backgroundColor: '#eab308' },  // yellow-500
    harvestButton: { backgroundColor: '#f97316' },   // orange-500
    backButton: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: '#e5e7eb',
        borderRadius: 8,
        alignItems: 'center',
    },
    backButtonText: { fontSize: 16, fontWeight: '600', color: '#374151' },
});


export default TimelineScreen;
