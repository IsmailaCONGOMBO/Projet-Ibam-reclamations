import { useState, useEffect } from 'react';
import { reclamationService } from '../../services/reclamationService';

const CreateReclamationForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    filiere_id: '',
    matiere_id: '',
    enseignant_id: '',
    objet_demande: '',
    motif: '',
    justificatif: null
  });
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFilieres();
  }, []);

  useEffect(() => {
    if (formData.filiere_id) {
      loadMatieres(formData.filiere_id);
      loadEnseignants(formData.filiere_id);
    } else {
      setMatieres([]);
      setEnseignants([]);
      setFormData(prev => ({ ...prev, matiere_id: '', enseignant_id: '' }));
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

  const loadEnseignants = async (filiereId) => {
    try {
      const data = await reclamationService.getEnseignantsByFiliere(filiereId);
      setEnseignants(data);
    } catch (err) {
      setError('Erreur lors du chargement des enseignants');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation des champs obligatoires
    if (!formData.matiere_id || !formData.objet_demande || !formData.motif) {
      setError('Tous les champs obligatoires doivent être remplis');
      setLoading(false);
      return;
    }

    // Validation du fichier justificatif
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(formData.justificatif.type)) {
      setError('Le justificatif doit être une image (JPG, PNG) ou un PDF');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('matiere_id', formData.matiere_id);
      formDataToSend.append('objet_demande', formData.objet_demande);
      formDataToSend.append('motif', formData.motif);
      if (formData.justificatif) {
        formDataToSend.append('piece_jointe', formData.justificatif);
      }

      await reclamationService.create(formDataToSend);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
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
        Nouvelle Réclamation
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
            Enseignant *
          </label>
          <select
            name="enseignant_id"
            value={formData.enseignant_id}
            onChange={handleChange}
            required
            disabled={!formData.filiere_id}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Sélectionner un enseignant</option>
            {enseignants.map(enseignant => (
              <option key={enseignant.id} value={enseignant.id}>
                {enseignant.prenom} {enseignant.nom}
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
            placeholder="Ex: Erreur de note, Note manquante..."
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
            placeholder="Expliquez en détail votre réclamation..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justificatif (Feuille de copie) *
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            accept=".jpg,.jpeg,.png,.pdf"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Formats acceptés : JPG, PNG, PDF (max 5MB)
          </p>
          {formData.justificatif && (
            <p className="text-sm text-green-600 mt-1">
              Fichier sélectionné : {formData.justificatif.name}
            </p>
          )}
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
            {loading ? 'Création...' : 'Créer (Brouillon)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReclamationForm;