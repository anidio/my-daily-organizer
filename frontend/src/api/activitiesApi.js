import api from '../services/Api';

export const getActivitiesByUserId = async (userId) => {
    try {
        const response = await api.get(`/api/activities/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        return [];
    }
};

export const createActivity = async (activity) => {
    try {
        const response = await api.post('/api/activities', activity);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar atividade:', error);
        return null;
    }
};