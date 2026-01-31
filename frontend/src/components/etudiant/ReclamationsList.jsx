import { useState, useEffect } from 'react';
import { reclamationService } from '../../services/reclamationService';
import StatusBadge from '../common/StatusBadge';

const ReclamationsList = ({ onEdit, onView }) => {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReclamations();
  }, []);

  const loadReclamations = async () => {
    try {
      const data = await reclamationService.getAll();
      setReclamations(data);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };



  const handleSoumettre = async (id) => {
    if (confirm('Voulez-vous soumettre cette réclamation ? Elle ne pourra plus être modifiée.')) {
      try {
        await reclamationService.soumettre(id);
        loadReclamations();
      } catch (err) {
        alert('Erreur lors de la soumission');
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Voulez-vous supprimer cette réclamation ?')) {
      try {
        await reclamationService.delete(id);
        loadReclamations();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Mes Réclamations ({reclamations.length})
        </h3>
      </div>

      {reclamations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune réclamation trouvée
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '800px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                  N° Demande
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                  Matière
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reclamations.map((reclamation) => (
                <tr key={reclamation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reclamation.numero_demande}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {reclamation.matiere?.nom_matiere}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={reclamation.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reclamation.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => onView?.(reclamation)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir
                    </button>
                    {reclamation.status === 'BROUILLON' && (
                      <>
                        <button
                          onClick={() => onEdit?.(reclamation)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleSoumettre(reclamation.id)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Soumettre
                        </button>
                        <button
                          onClick={() => handleDelete(reclamation.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReclamationsList;