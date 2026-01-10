import { useState } from 'react';
import { reclamationService } from '../../services/reclamationService';

const TransmettreScolariteForm = ({ reclamation, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransmettre = async () => {
    setLoading(true);
    setError('');

    try {
      await reclamationService.transmettreScolarite(reclamation.id);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la transmission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Transmission à la Scolarité
      </h2>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Réclamation #{reclamation.numero_demande}</h3>
        <p className="text-gray-600 mb-2">
          <strong>Étudiant:</strong> {reclamation.etudiant?.prenom} {reclamation.etudiant?.nom}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Matière:</strong> {reclamation.matiere?.nom_matiere}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Décision enseignant:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-sm ${
            reclamation.statut === 'VALIDEE_ENSEIGNANT' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {reclamation.statut === 'VALIDEE_ENSEIGNANT' ? 'Validée' : 'Invalidée'}
          </span>
        </p>
        {reclamation.note_corrigee && (
          <p className="text-gray-600 mb-2">
            <strong>Note corrigée:</strong> {reclamation.note_corrigee}/20
          </p>
        )}
        {reclamation.decision_enseignant && (
          <p className="text-gray-600">
            <strong>Commentaire:</strong> {reclamation.decision_enseignant}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          onClick={handleTransmettre}
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Transmission...' : 'Transmettre à la Scolarité'}
        </button>
      </div>
    </div>
  );
};

export default TransmettreScolariteForm;