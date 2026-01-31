import api from './api';

export const filiereService = {
    getAll: async () => {
        const response = await api.get('/filieres');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/filieres', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/filieres/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/filieres/${id}`);
        return response.data;
    },

    getMatieres: async (id) => {
        const response = await api.get(`/filieres/${id}/matieres`);
        return response.data;
    },

    getEnseignants: async (id) => {
        const response = await api.get(`/filieres/${id}/enseignants`);
        return response.data;
    }
};
