import { useState, useEffect } from 'react';
import { reclamationService } from '../../services/reclamationService';
import JustificatifViewer from '../JustificatifViewer';

const TraiterReclamationForm = ({ reclamation, onSuccess, onCancel }) => {
  const [decision, setDecision] = useState('');
  const [noteCorrigee, setNoteCorrigee] = useState('');
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
      const payload = {
        decision,
        commentaire
      };

      // Ajouter note_corrigee seulement si la décision est VALIDEE
      if (decision === 'VALIDEE') {
        payload.note_corrigee = parseFloat(noteCorrigee);
      }

      await reclamationService.traiter(reclamation.id, payload);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du traitement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Traitement de la réclamation
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
            <p className="text-gray-600">{reclamation.etudiant?.prenom} {reclamation.etudiant?.nom} ({reclamation.etudiant?.matricule})</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Matière</h3>
            <p className="text-gray-600">{reclamation.matiere?.nom_matiere}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Note actuelle</h3>
            <p className="text-gray-600">{reclamation.note_actuelle || 'Non renseignée'}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium text-gray-900">Objet de la réclamation</h3>
            <p className="text-gray-600">{reclamation.objet_demande}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium text-gray-900">Motif détaillé</h3>
            <p className="text-gray-600">{reclamation.motif}</p>
          </div>
          {reclamation.commentaire_scolarite && (
            <div className="md:col-span-2">
              <h3 className="font-medium text-gray-900">Commentaire Scolarité</h3>
              <p className="text-gray-600">{reclamation.commentaire_scolarite}</p>
            </div>
          )}
          <div className="md:col-span-2">
            <JustificatifViewer justificatifs={reclamationDetails?.justificatifs || []} />
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
            <option value="VALIDEE">Valider la réclamation</option>
            <option value="INVALIDEE">Invalider la réclamation</option>
          </select>
        </div>

        {decision === 'VALIDEE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note corrigée * (0-20)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.25"
              value={noteCorrigee}
              onChange={(e) => setNoteCorrigee(e.target.value)}
              required
              placeholder="Ex: 15.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire {decision === 'INVALIDEE' && '*'}
          </label>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            required={decision === 'INVALIDEE'}
            rows={4}
            placeholder={
              decision === 'VALIDEE' 
                ? 'Commentaire sur la correction (optionnel)' 
                : decision === 'INVALIDEE'
                ? 'Justification du refus (obligatoire)'
                : 'Votre commentaire...'
            }
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
            className={`px-4 py-2 text-white rounded-md disabled:opacity-50 ${
              decision === 'VALIDEE' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Traitement...' : decision === 'VALIDEE' ? 'Valider et corriger' : 'Invalider'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TraiterReclamationForm;