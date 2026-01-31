import api from './api';

export const matiereService = {
    getAll: async () => {
        const response = await api.get('/matieres');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/matieres', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/matieres/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/matieres/${id}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/matieres/${id}`);
        return response.data;
    }
};
