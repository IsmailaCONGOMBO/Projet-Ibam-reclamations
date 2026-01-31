import api from './api';

export const userService = {
    // Récupérer tous les utilisateurs
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // Récupérer les enseignants
    getEnseignants: async () => {
        // Supposons une route spécifique ou un filtre. 
        // Si le backend n'a pas de filtre, on récupère tout et on filtre (moins performant mais ok pour petit projet)
        // Mais le backend a `getEtudiants`. On devrait ajouter `getEnseignants` au backend si absent.
        // On va essayer d'appeler /users?role=ENSEIGNANT si le backend le supporte, ou juste /users
        const response = await api.get('/users?role=ENSEIGNANT');
        return response.data;
    },

    getEtudiants: async () => {
        const response = await api.get('/etudiants');
        return response.data;
    }
};
