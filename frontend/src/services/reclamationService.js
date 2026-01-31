import api from './api';

export const reclamationService = {
    // Récupérer les réclamations
    getAll: async () => {
        const response = await api.get('/reclamations');
        return response.data;
    },

    // Créer une réclamation (avec support fichier)
    create: async (data) => {
        // Si c'est du FormData, axios le détecte, mais on peut forcer le header si besoin
        const response = await api.post('/reclamations', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Récupérer une réclamation par ID
    getById: async (id) => {
        const response = await api.get(`/reclamations/${id}`);
        return response.data;
    },

    // Mettre à jour une réclamation (étudiant)
    update: async (id, data) => {
        const response = await api.post(`/reclamations/${id}`, data);
        return response.data;
    },

    // Soumettre une réclamation
    soumettre: async (id) => {
        const response = await api.post(`/reclamations/${id}/soumettre`);
        return response.data;
    },

    // Vérifier la recevabilité (Scolarité)
    verifier: async (id, recevable, commentaire = '') => {
        const response = await api.put(`/reclamations/${id}/verifier`, { recevable, commentaire });
        return response.data;
    },

    // Imputer (assigner) une réclamation
    imputer: async (id, enseignantId) => {
        const response = await api.put(`/reclamations/${id}/imputer`, { enseignant_id: enseignantId });
        return response.data;
    },

    // Traiter une réclamation (enseignant)
    traiter: async (id, valide, commentaire, noteCorrigee = null) => {
        const response = await api.put(`/reclamations/${id}/traiter`, {
            valide,
            commentaire,
            note_corrigee: noteCorrigee
        });
        return response.data;
    },

    // Transmettre à la scolarité
    transmettreScolarite: async (id, commentaire = '') => {
        const response = await api.put(`/reclamations/${id}/transmettre-scolarite`, { commentaire });
        return response.data;
    },

    // Finaliser une réclamation (scolarité)
    finaliser: async (id, commentaire) => {
        const response = await api.put(`/reclamations/${id}/finaliser`, { commentaire });
        return response.data;
    },

    // Supprimer une réclamation (brouillon)
    delete: async (id) => {
        const response = await api.delete(`/reclamations/${id}`);
        return response.data;
    },

    // Ajouter un justificatif
    addJustificatif: async (id, formData) => {
        const response = await api.post(`/reclamations/${id}/justificatifs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Supprimer un justificatif
    deleteJustificatif: async (id) => {
        await api.delete(`/justificatifs/${id}`);
    },

    // Télécharger un justificatif
    downloadJustificatif: async (id) => {
        const response = await api.get(`/justificatifs/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
