import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PlantIcon } from '../components/Icons';

const RegisterScreen = ({
    plantName, setPlantName, plantingDate, setPlantingDate,
    location, locationError, isLoadingLocation,
    onGetLocation, onRegister
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || plantingDate;
        setShowDatePicker(Platform.OS === 'ios'); // No iOS o picker é um modal
        setPlantingDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <PlantIcon />
                <Text style={styles.title}>Rastreio de Cultivo</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome/ID da Planta</Text>
                    <TextInput
                        style={styles.input}
                        value={plantName}
                        onChangeText={setPlantName}
                        placeholder="Ex: Soja-Lote-A1"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Data de Plantio</Text>
                    <Pressable onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.input}>{plantingDate.toLocaleString('pt-BR')}</Text>
                    </Pressable>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={plantingDate}
                            mode="datetime"
                            is24Hour={true}
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Geolocalização</Text>
                    <View style={styles.locationBox}>
                        <View style={styles.locationTextContainer}>
                            {isLoadingLocation && <Text style={styles.locationStatus}>A obter coordenadas...</Text>}
                            {locationError && <Text style={styles.locationError}>{locationError}</Text>}
                            {location && (
                                <>
                                    <Text style={styles.locationCoords}>Lat: {location.latitude.toFixed(5)}</Text>
                                    <Text style={styles.locationCoords}>Lon: {location.longitude.toFixed(5)}</Text>
                                </>
                            )}
                        </View>
                        <Pressable
                            onPress={onGetLocation}
                            disabled={isLoadingLocation}
                            style={({ pressed }) => [styles.locationButton, (isLoadingLocation || pressed) && styles.buttonDisabled]}
                        >
                            <Text style={styles.locationButtonText}>{isLoadingLocation ? 'Aguarde' : 'Atualizar'}</Text>
                        </Pressable>
                    </View>
                </View>

                <Pressable onPress={onRegister} style={({ pressed }) => [styles.registerButton, pressed && styles.buttonDisabled]}>
                    <Text style={styles.registerButtonText}>Registar Planta</Text>
                </Pressable>
            </View>
        </View>
    );
};

// ... Estilos (ver abaixo)
const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
    form: { gap: 24 },
    inputGroup: { gap: 4 },
    label: { fontSize: 14, fontWeight: '500', color: '#374151' },
    input: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        fontSize: 16,
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 8,
    },
    locationTextContainer: { flex: 1 },
    locationStatus: { color: '#6b7280' },
    locationError: { color: '#ef4444', fontSize: 12 },
    locationCoords: { fontSize: 14, color: '#1f2937' },
    locationButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#2563eb',
        borderRadius: 8,
        elevation: 2,
    },
    locationButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
    registerButton: {
        width: '100%',
        paddingVertical: 16,
        backgroundColor: '#16a34a',
        borderRadius: 8,
        alignItems: 'center',
        elevation: 3,
    },
    registerButtonText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
    buttonDisabled: { opacity: 0.7 },
});


export default RegisterScreen;
