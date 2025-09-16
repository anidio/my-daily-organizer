import api from '../services/Api';

export const getNutritionByUserId = async (userId) => {
    try {
        const response = await api.get(`/api/nutrition/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados de nutrição:', error);
        return null;
    }
};

export const saveNutrition = async (nutrition) => {
    try {
        const response = await api.post('/api/nutrition', nutrition);
        return response.data;
    } catch (error) {
        console.error('Erro ao salvar dados de nutrição:', error);
        return null;
    }
};