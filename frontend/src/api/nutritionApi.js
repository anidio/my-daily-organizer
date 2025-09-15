import axios from 'axios';

const API_URL = '/api/nutrition';

// Funções para a API de Nutrição
export const getNutritionByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados de nutrição:', error);
        return null;
    }
};

export const saveNutrition = async (nutrition) => {
    try {
        const response = await axios.post(API_URL, nutrition);
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar dados de nutrição:', error);
        return null;
    }
};