import { useState, useEffect } from 'react';
import api from '../../services/api';

const CreateUserForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'ETUDIANT',
    filiere_id: '',
    telephone: '',
    niveau: '',
    matiere_ids: [],
    password: '',
    password_confirmation: ''
  });
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFilieres();
  }, []);

  useEffect(() => {
    if (formData.filiere_id && formData.role === 'ENSEIGNANT') {
      loadMatieresByFiliere(formData.filiere_id);
    }
  }, [formData.filiere_id, formData.role]);

  const loadMatieresByFiliere = async (filiereId) => {
    try {
      const response = await api.get(`/filieres/${filiereId}/matieres`);
      setMatieres(response.data.filter(m => !m.enseignant_id));
    } catch (err) {
      console.error('Erreur lors du chargement des matières');
    }
  };

  const loadFilieres = async () => {
    try {
      const response = await api.get('/filieres');
      setFilieres(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des filières');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/users', formData);
      onSuccess?.();
    } catch (err) {
      // Axios stores response error in err.response
      const message = err.response?.data?.message || 'Erreur lors de la création';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Créer un {formData.role === 'ETUDIANT' ? 'Étudiant' : 'Enseignant'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rôle *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ETUDIANT">Étudiant</option>
            <option value="ENSEIGNANT">Enseignant</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filière *
          </label>
          <select
            name="filiere_id"
            value={formData.filiere_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner une filière</option>
            {filieres.map(filiere => (
              <option key={filiere.id} value={filiere.id}>
                {filiere.nom_filiere}
              </option>
            ))}
          </select>
        </div>

        {formData.role === 'ETUDIANT' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau *
            </label>
            <select
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un niveau</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
              <option value="M1">M1</option>
              <option value="M2">M2</option>
            </select>
          </div>
        )}

        {formData.role === 'ENSEIGNANT' && formData.filiere_id && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matières à attribuer
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
              {matieres.map(matiere => (
                <label key={matiere.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.matiere_ids.includes(matiere.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, matiere_ids: [...formData.matiere_ids, matiere.id] });
                      } else {
                        setFormData({ ...formData, matiere_ids: formData.matiere_ids.filter(id => id !== matiere.id) });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{matiere.nom_matiere} ({matiere.code_matiere})</span>
                </label>
              ))}
              {matieres.length === 0 && (
                <p className="text-sm text-gray-500">Aucune matière disponible dans cette filière</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer Mot de passe *
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;