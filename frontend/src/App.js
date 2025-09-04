import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { addTimelineEvent, registerPlant } from './services/api';

import RegisterScreen from './screens/RegisterScreen';
import TimelineScreen from './screens/TimelineScreen';

export default function App() {
    const [screen, setScreen] = useState('register');
    const [plantName, setPlantName] = useState('');
    const [plantingDate, setPlantingDate] = useState(new Date());
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Um estado de loading geral
    const [activePlant, setActivePlant] = useState(null);

    useEffect(() => {
        handleGetLocation();
    }, []);

    const handleGetLocation = async () => {
        setIsLoading(true);
        setLocationError('');
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocationError('Permissão de acesso à localização foi negada.');
            setIsLoading(false);
            return;
        }
        try {
            let position = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        } catch (error) {
            setLocationError('Não foi possível obter a localização.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterPlant = async () => {
        if (!plantName || !plantingDate || !location) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos e obtenha a geolocalização.');
            return;
        }

        setIsLoading(true);
        try {
            const dataToSend = {
                name: plantName,
                planting_date: plantingDate.toISOString(),
                location: location,
            };
            const newPlant = await registerPlant(dataToSend);
            setActivePlant(newPlant);
            setScreen('timeline');
        } catch (error) {
            Alert.alert('Falha na API', 'Não foi possível registrar a planta. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPhase = async (phase) => {
        if (!activePlant) return;

        setIsLoading(true);
        try {
            const dataToSend = {
                phase: phase,
                date: new Date().toISOString(),
                location: null, // Para novas fases, podemos omitir a localização ou pegar a atual
            };
            // Adiciona o novo evento ao estado local para uma atualização instantânea da UI
            const newEvent = await addTimelineEvent(activePlant.id, dataToSend);
            setActivePlant(prevPlant => ({
                ...prevPlant,
                timeline: [...prevPlant.timeline, newEvent],
            }));
        } catch (error) {
            Alert.alert('Falha na API', 'Não foi possível adicionar a nova fase.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const backToRegister = () => {
        setPlantName('');
        setPlantingDate(new Date());
        setActivePlant(null);
        setScreen('register');
        handleGetLocation();
    };

    // Ajusta o ecrã de registo para passar o estado de loading
    const renderRegisterScreen = () => (
        <RegisterScreen
            plantName={plantName}
            setPlantName={setPlantName}
            plantingDate={plantingDate}
            setPlantingDate={setPlantingDate}
            location={location}
            locationError={locationError}
            isLoadingLocation={isLoading} // Usamos o loading geral
            onGetLocation={handleGetLocation}
            onRegister={handleRegisterPlant}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {screen === 'register' 
                ? renderRegisterScreen()
                : (activePlant && (
                    <TimelineScreen
                        plant={activePlant}
                        onAddPhase={handleAddPhase}
                        onBack={backToRegister}
                    />
                  ))
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
});