import { useState, useEffect } from 'react';
import { reclamationService } from '../../services/reclamationService';
import JustificatifViewer from '../JustificatifViewer';

const VerifyReclamationForm = ({ reclamation, onSuccess, onCancel }) => {
  const [decision, setDecision] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reclamationDetails, setReclamationDetails] = useState(null);

  useEffect(() => {
    loadReclamationDetails();
  }, [reclamation.id]);

  const loadReclamationDetails = async () => {
    try {
      const data = await reclamationService.getById(reclamation.id);
      setReclamationDetails(data);
    } catch (err) {
      console.error('Erreur chargement détails');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await reclamationService.verifier(
        reclamation.id,
        decision === 'RECEVABLE', // true if RECEVABLE, false if REJETEE
        commentaire
      );
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Vérification de la réclamation
      </h2>

      {/* Détails de la réclamation */}
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
            <h3 className="font-medium text-gray-900">Note actuelle</h3>
            <p className="text-gray-600 font-semibold">{reclamation.note_actuelle}/20</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Note souhaitée</h3>
            <p className="text-indigo-600 font-semibold">{reclamation.note_souhaitee}/20</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Date soumission</h3>
            <p className="text-gray-600">{reclamation.date_soumission}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium text-gray-900">Objet</h3>
            <p className="text-gray-600">{reclamation.objet}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium text-gray-900">Motif</h3>
            <p className="text-gray-600">{reclamation.message}</p>
          </div>
          <div className="md:col-span-2">
            <JustificatifViewer
              piece_jointe={reclamation.piece_jointe}
              justificatifs={reclamationDetails?.justificatifs || []}
              reclamationId={reclamation.id}
            />
          </div>
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
            Décision *
          </label>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner une décision</option>
            <option value="RECEVABLE">Recevable</option>
            <option value="REJETEE">Rejetée</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire {decision === 'REJETEE' && '*'}
          </label>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            required={decision === 'REJETEE'}
            rows={4}
            placeholder={decision === 'REJETEE' ? 'Motif du rejet (obligatoire)' : 'Commentaire (optionnel)'}
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
            className={`px-4 py-2 text-white rounded-md disabled:opacity-50 ${decision === 'RECEVABLE'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            {loading ? 'Traitement...' : `Marquer comme ${decision}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyReclamationForm;