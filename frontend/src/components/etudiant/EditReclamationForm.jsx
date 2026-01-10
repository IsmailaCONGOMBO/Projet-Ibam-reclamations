import { useState, useEffect } from 'react';
import { reclamationService } from '../../services/reclamationService';

const EditReclamationForm = ({ reclamation, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    filiere_id: '',
    matiere_id: '',
    objet_demande: '',
    motif: '',
    justificatif: null
  });
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reclamation) {
      setFormData({
        filiere_id: reclamation.matiere?.filiere_id || '',
        matiere_id: reclamation.matiere_id || '',
        objet_demande: reclamation.objet_demande || '',
        motif: reclamation.motif || '',
        justificatif: null
      });
    }
    loadFilieres();
  }, [reclamation]);

  useEffect(() => {
    if (formData.filiere_id) {
      loadMatieres(formData.filiere_id);
    }
  }, [formData.filiere_id]);

  const loadFilieres = async () => {
    try {
      const data = await reclamationService.getFilieres();
      setFilieres(data);
    } catch (err) {
      setError('Erreur lors du chargement des filières');
    }
  };

  const loadMatieres = async (filiereId) => {
    try {
      const data = await reclamationService.getMatieresByFiliere(filiereId);
      setMatieres(data);
    } catch (err) {
      setError('Erreur lors du chargement des matières');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('matiere_id', formData.matiere_id);
      formDataToSend.append('objet_demande', formData.objet_demande);
      formDataToSend.append('motif', formData.motif);
      if (formData.justificatif) {
        formDataToSend.append('justificatif', formData.justificatif);
      }
      
      await reclamationService.update(reclamation.id, formDataToSend);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification');
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      justificatif: file
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Modifier la réclamation #{reclamation?.numero_demande}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                {filiere.nom_filiere} ({filiere.code_filiere})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Matière *
          </label>
          <select
            name="matiere_id"
            value={formData.matiere_id}
            onChange={handleChange}
            required
            disabled={!formData.filiere_id}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Sélectionner une matière</option>
            {matieres.map(matiere => (
              <option key={matiere.id} value={matiere.id}>
                {matiere.nom_matiere} ({matiere.code_matiere})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objet de la demande *
          </label>
          <input
            type="text"
            name="objet_demande"
            value={formData.objet_demande}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motif détaillé *
          </label>
          <textarea
            name="motif"
            value={formData.motif}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouveau justificatif (optionnel)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Laissez vide pour conserver le justificatif actuel
          </p>
        </div>

        <div className="flex justify-end space-x-4">
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
            {loading ? 'Modification...' : 'Modifier'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReclamationForm;