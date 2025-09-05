// Endereço base da sua API Flask. 
// Use o IP da sua máquina em vez de 'localhost' para testar no telemóvel físico.
// Ex: 'http://192.168.1.5:5000/api'
const API_URL = 'http://localhost:5000/api'; // Lembre-se de ajustar para o seu IP se necessário

/**
 * Busca a lista de todas as plantas.
 * @returns {Promise<Array>} A lista de plantas.
 */
export const getPlants = async () => {
    try {
        const response = await fetch(`${API_URL}/plants`);
        if (!response.ok) {
            throw new Error('Falha ao buscar plantas.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em getPlants:', error);
        throw error;
    }
};

/**
 * Busca os dados de uma planta específica pelo ID.
 * @param {number} plantId O ID da planta.
 * @returns {Promise<object>} Os dados da planta.
 */
export const getPlant = async (plantId) => {
    try {
        const response = await fetch(`${API_URL}/plants/${plantId}`);
        if (!response.ok) {
            throw new Error('Planta não encontrada.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em getPlant:', error);
        throw error;
    }
};

/**
 * Registra uma nova planta.
 * @param {object} plantData Os dados da nova planta.
 * @returns {Promise<object>} A planta recém-criada.
 */
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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao registrar a planta.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em registerPlant:', error);
        throw error;
    }
};

/**
 * Adiciona um novo evento à timeline de uma planta.
 * @param {number} plantId O ID da planta.
 * @param {object} eventData Os dados do novo evento.
 * @returns {Promise<object>} O evento recém-criado.
 */
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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao adicionar evento.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em addTimelineEvent:', error);
        throw error;
    }
};

