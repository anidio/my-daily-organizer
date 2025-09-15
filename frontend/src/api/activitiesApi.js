import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getActivitiesByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        return [];
    }
};

export const createActivity = async (activity) => {
    try {
        const response = await axios.post(API_URL, activity);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar atividade:', error);
        return null;
    }
};