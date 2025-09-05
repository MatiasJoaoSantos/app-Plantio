import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { addTimelineEvent, getPlant, getPlants, registerPlant } from './services/api';

import PlantListScreen from './screens/PlantListScreen';
import RegisterScreen from './screens/RegisterScreen';
import TimelineScreen from './screens/TimelineScreen';

export default function App() {
    const [screen, setScreen] = useState('plantList'); // Tela inicial é a lista
    const [plantName, setPlantName] = useState('');
    const [plantingDate, setPlantingDate] = useState(new Date());
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [activePlant, setActivePlant] = useState(null);
    const [allPlants, setAllPlants] = useState([]); // Novo estado para a lista de plantas

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const storedPlantId = await AsyncStorage.getItem('activePlantId');
                if (storedPlantId) {
                    const plantData = await getPlant(storedPlantId);
                    setActivePlant(plantData);
                    setScreen('timeline');
                } else {
                    // Se não há planta ativa, carregamos a lista de plantas
                    await fetchAllPlants();
                    setScreen('plantList');
                }
            } catch (error) {
                console.error("Falha ao inicializar:", error);
                await AsyncStorage.removeItem('activePlantId');
                await fetchAllPlants();
                setScreen('plantList');
            } finally {
                setIsInitializing(false);
            }
        };

        initializeApp();
    }, []);

    const fetchAllPlants = async () => {
        try {
            setIsLoading(true);
            const plants = await getPlants();
            setAllPlants(plants);
        } catch (error) {
            Alert.alert("Erro de Rede", "Não foi possível buscar as plantas registradas.");
        } finally {
            setIsLoading(false);
        }
    };
    
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
            await AsyncStorage.setItem('activePlantId', String(newPlant.id));
            setScreen('timeline');
        } catch (error) {
            Alert.alert('Falha na API', error.message || 'Não foi possível registrar a planta.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPhase = async (phase) => {
        if (!activePlant) return;

        setIsLoading(true);
        try {
            let currentPosition = await Location.getCurrentPositionAsync({});
            const currentLocation = {
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude,
            };

            const dataToSend = {
                phase: phase,
                date: new Date().toISOString(),
                location: currentLocation,
            };
            
            const newEvent = await addTimelineEvent(activePlant.id, dataToSend);
            
            setActivePlant(prevPlant => ({
                ...prevPlant,
                timeline: [newEvent, ...prevPlant.timeline],
            }));

        } catch (error) {
            Alert.alert('Falha na API', error.message || 'Não foi possível adicionar a nova fase.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelectPlant = async (plant) => {
        setActivePlant(plant);
        await AsyncStorage.setItem('activePlantId', String(plant.id));
        setScreen('timeline');
    };

    const goBackToList = async () => {
        await AsyncStorage.removeItem('activePlantId');
        setActivePlant(null);
        await fetchAllPlants();
        setScreen('plantList');
    };

    const goToRegister = async () => {
        await handleGetLocation();
        setPlantName('');
        setPlantingDate(new Date());
        setScreen('register');
    };

    const renderContent = () => {
        if (isInitializing) {
            return (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#16a34a" />
                </View>
            );
        }

        switch(screen) {
            case 'plantList':
                return <PlantListScreen plants={allPlants} onSelectPlant={handleSelectPlant} onGoToRegister={goToRegister} />;
            case 'register':
                return <RegisterScreen
                        plantName={plantName}
                        setPlantName={setPlantName}
                        plantingDate={plantingDate}
                        setPlantingDate={setPlantingDate}
                        location={location}
                        locationError={locationError}
                        isLoadingLocation={isLoading}
                        onGetLocation={handleGetLocation}
                        onRegister={handleRegisterPlant}
                    />;
            case 'timeline':
                return activePlant && <TimelineScreen plant={activePlant} onAddPhase={handleAddPhase} onBack={goBackToList} />;
            default:
                return null;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {renderContent()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
    }
});

