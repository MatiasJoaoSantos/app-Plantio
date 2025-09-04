// Endereço base da sua API Flask. 
// Use o IP da sua máquina em vez de 'localhost' para testar no telemóvel físico.
// Ex: 'http://192.168.1.10:5000/api'
const API_URL = 'http://localhost:5000/api';

// Função para registrar uma nova planta
export const registerPlant = async (plantData) => {
    try {
        const response = await fetch(`${API_URL}/plants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(plantData),
        });

        if (!response.ok) {
            throw new Error('Falha ao registrar a planta.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em registerPlant:', error);
        throw error; // Propaga o erro para o componente tratar
    }
};

// Função para adicionar uma nova fase à timeline
export const addTimelineEvent = async (plantId, eventData) => {
    try {
        const response = await fetch(`${API_URL}/plants/${plantId}/timeline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            throw new Error('Falha ao adicionar evento.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em addTimelineEvent:', error);
        throw error;
    }
};

// Poderíamos adicionar mais funções aqui, como getPlants, deletePlant, etc.
