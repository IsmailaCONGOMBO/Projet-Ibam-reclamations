import { useState } from 'react';
import { reclamationService } from '../../services/reclamationService';

const FinaliserReclamationForm = ({ reclamation, onSuccess, onCancel }) => {
  const [noteFinal, setNoteFinal] = useState(reclamation.note_corrigee || '');
  const [commentaireFinal, setCommentaireFinal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await reclamationService.finaliser(reclamation.id, {
        note_finale: parseFloat(noteFinal),
        commentaire_final: commentaireFinal
      });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la finalisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Finalisation de la réclamation
      </h2>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900">N° Demande</h3>
            <p className="text-gray-600">{reclamation.numero_demande}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Étudiant</h3>
            <p className="text-gray-600">{reclamation.etudiant?.prenom} {reclamation.etudiant?.nom}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Matière</h3>
            <p className="text-gray-600">{reclamation.matiere?.nom_matiere}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Note proposée par l'enseignant</h3>
            <p className="text-gray-600">{reclamation.note_corrigee || 'Non renseignée'}/20</p>
          </div>
          {reclamation.decision_enseignant && (
            <div className="md:col-span-2">
              <h3 className="font-medium text-gray-900">Commentaire enseignant</h3>
              <p className="text-gray-600">{reclamation.decision_enseignant}</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note finale * (0-20)
          </label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.25"
            value={noteFinal}
            onChange={(e) => setNoteFinal(e.target.value)}
            required
            placeholder="Ex: 15.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Vous pouvez modifier la note proposée par l'enseignant si nécessaire
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire final (optionnel)
          </label>
          <textarea
            value={commentaireFinal}
            onChange={(e) => setCommentaireFinal(e.target.value)}
            rows={4}
            placeholder="Commentaire sur la finalisation de la réclamation..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Finalisation...' : 'Finaliser et notifier l\'étudiant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinaliserReclamationForm;