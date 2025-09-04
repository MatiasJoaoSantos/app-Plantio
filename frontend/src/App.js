import * as Location from 'expo-location'; // API de localização do Expo
import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import RegisterScreen from './screens/RegisterScreen';
import TimelineScreen from './screens/TimelineScreen';

export default function App() {
    const [screen, setScreen] = useState('register');
    const [plantName, setPlantName] = useState('');
    const [plantingDate, setPlantingDate] = useState(new Date());
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [activePlant, setActivePlant] = useState(null);

    useEffect(() => {
        handleGetLocation();
    }, []);

    const handleGetLocation = async () => {
        setIsLoadingLocation(true);
        setLocationError('');

        // 1. Pedir permissão ao usuário
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocationError('Permissão de acesso à localização foi negada.');
            setIsLoadingLocation(false);
            return;
        }

        // 2. Obter a localização
        try {
            let position = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        } catch (error) {
            setLocationError('Não foi possível obter a localização.');
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const handleRegisterPlant = () => {
        if (!plantName || !plantingDate || !location) {
            // Em apps nativos, é melhor usar um componente de alerta customizado
            // mas por enquanto o console.error serve.
            console.error('Por favor, preencha todos os campos e obtenha a geolocalização.');
            return;
        }
        const newPlant = {
            id: Date.now(),
            name: plantName,
            timeline: [
                { phase: 'Plantio', date: plantingDate.toISOString(), location: location },
            ],
        };
        setActivePlant(newPlant);
        setScreen('timeline');
    };

    const handleAddPhase = (phase) => {
        const newPhase = {
            phase: phase,
            date: new Date().toISOString(),
            location: null, // Pode-se obter a localização novamente aqui se desejado
        };
        setActivePlant(prevPlant => ({
            ...prevPlant,
            timeline: [...prevPlant.timeline, newPhase],
        }));
    };

    const backToRegister = () => {
        setPlantName('');
        setPlantingDate(new Date());
        setActivePlant(null);
        setScreen('register');
        handleGetLocation();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {screen === 'register' ? (
                <RegisterScreen
                    plantName={plantName}
                    setPlantName={setPlantName}
                    plantingDate={plantingDate}
                    setPlantingDate={setPlantingDate}
                    location={location}
                    locationError={locationError}
                    isLoadingLocation={isLoadingLocation}
                    onGetLocation={handleGetLocation}
                    onRegister={handleRegisterPlant}
                />
            ) : (
                activePlant && (
                    <TimelineScreen
                        plant={activePlant}
                        onAddPhase={handleAddPhase}
                        onBack={backToRegister}
                    />
                )
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6', // bg-gray-100
    },
});
