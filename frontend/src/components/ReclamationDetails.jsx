import { useState, useEffect } from 'react';
import { reclamationService } from '../services/reclamationService';
import JustificatifViewer from './JustificatifViewer';

const ReclamationDetails = ({ reclamationId, onClose }) => {
  const [reclamation, setReclamation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReclamationDetails();
  }, [reclamationId]);

  const loadReclamationDetails = async () => {
    try {
      const data = await reclamationService.getById(reclamationId);
      setReclamation(data);
    } catch (err) {
      console.error('Erreur lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    const colors = {
      'BROUILLON': 'bg-gray-100 text-gray-800',
      'SOUMISE': 'bg-blue-100 text-blue-800',
      'RECEVABLE': 'bg-green-100 text-green-800',
      'REJETEE': 'bg-red-100 text-red-800',
      'VALIDEE': 'bg-green-100 text-green-800',
      'INVALIDEE': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (!reclamation) return <div className="text-center py-4">Réclamation non trouvée</div>;

  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-96 overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Détails de la réclamation #{reclamation.numero_demande}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Étudiant</label>
              <p className="mt-1 text-sm text-gray-900">
                {reclamation.etudiant?.prenom} {reclamation.etudiant?.nom}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(reclamation.status)}`}>
                {reclamation.status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Matière</label>
              <p className="mt-1 text-sm text-gray-900">{reclamation.matiere?.nom_matiere}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Enseignant</label>
              <p className="mt-1 text-sm text-gray-900">
                {reclamation.enseignant?.prenom} {reclamation.enseignant?.nom}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Objet de la demande</label>
            <p className="mt-1 text-sm text-gray-900">{reclamation.objet}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Motif détaillé</label>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{reclamation.message}</p>
          </div>

          <div>
            <JustificatifViewer
              piece_jointe={reclamation.piece_jointe}
              justificatifs={reclamation.justificatifs}
              reclamationId={reclamation.id}
            />
          </div>

          {reclamation.note_corrigee && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Note corrigée</label>
              <p className="mt-1 text-sm text-gray-900">{reclamation.note_corrigee}/20</p>
            </div>
          )}

          {reclamation.decision_enseignant && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Décision de l'enseignant</label>
              <p className="mt-1 text-sm text-gray-900">{reclamation.decision_enseignant}</p>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default ReclamationDetails;