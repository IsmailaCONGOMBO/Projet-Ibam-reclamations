import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { reclamationService } from '../services/reclamationService';
import VerifyReclamationForm from '../components/scolarite/VerifyReclamationForm';
import FinaliserReclamationForm from '../components/scolarite/FinaliserReclamationForm';
import ReclamationDetails from '../components/ReclamationDetails';
import StatusBadge from '../components/common/StatusBadge';

const ScolaritePage = () => {
  const [reclamations, setReclamations] = useState([]);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadReclamations();
  }, []);

  const loadReclamations = async () => {
    try {
      const data = await reclamationService.getAll();
      // Le back-end filtre déjà ou on filtre ici. Pour Scolarité:
      // SOUMIS (à vérifier)
      // TRANSMIS_SCOLARITE (à finaliser)
      // TRAITE/REJETE (historique)
      const visibleStatuses = ['SOUMIS', 'RECEVABLE', 'REJETE', 'EN_TRAITEMENT', 'VALIDE_ENSEIGNANT', 'INVALIDE_ENSEIGNANT', 'TRANSMIS_SCOLARITE', 'TRAITE'];
      setReclamations(data.filter(r => visibleStatuses.includes(r.status)));
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleVerifySuccess = () => {
    setSelectedReclamation(null);
    loadReclamations();
  };

  const getFilteredReclamations = () => {
    if (filter === 'ALL') return reclamations;
    return reclamations.filter(r => r.status === filter);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vérification des réclamations</h1>
        </div>
      </div>

      {selectedReclamation && viewingDetails ? (
        <ReclamationDetails
          reclamationId={selectedReclamation.id}
          onClose={() => {
            setSelectedReclamation(null);
            setViewingDetails(false);
          }}
        />
      ) : selectedReclamation && finalizing ? (
        <FinaliserReclamationForm
          reclamation={selectedReclamation}
          onSuccess={() => {
            setSelectedReclamation(null);
            setFinalizing(false);
            loadReclamations();
          }}
          onCancel={() => {
            setSelectedReclamation(null);
            setFinalizing(false);
          }}
        />
      ) : selectedReclamation ? (
        <VerifyReclamationForm
          reclamation={selectedReclamation}
          onSuccess={handleVerifySuccess}
          onCancel={() => setSelectedReclamation(null)}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Historique ({reclamations.length})
            </h2>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Toutes</option>
                <option value="SOUMIS">À vérifier</option>
                <option value="TRANSMIS_SCOLARITE">À finaliser</option>
                <option value="TRAITE">Finalisées</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {reclamations.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center border dashed border-gray-300">
              <p className="text-gray-500">Aucune réclamation trouvée</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        N°
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Étudiant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matière
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredReclamations().map((reclamation) => (
                      <tr key={reclamation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reclamation.numero_demande}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reclamation.etudiant?.prenom} {reclamation.etudiant?.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reclamation.matiere?.nom_matiere}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={reclamation.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedReclamation(reclamation);
                              setViewingDetails(true);
                            }}
                            className="text-gray-600 hover:text-gray-900 font-medium"
                          >
                            {reclamation.status === 'TRAITE' ? 'Voir archive' : 'Détails'}
                          </button>

                          {reclamation.status === 'SOUMIS' && (
                            <button
                              onClick={() => {
                                setSelectedReclamation(reclamation);
                                setViewingDetails(false);
                                setFinalizing(false);
                              }}
                              className="text-blue-600 hover:text-blue-900 font-medium ml-3"
                            >
                              Vérifier
                            </button>
                          )}

                          {reclamation.status === 'TRANSMIS_SCOLARITE' && (
                            <button
                              onClick={() => {
                                setSelectedReclamation(reclamation);
                                setFinalizing(true);
                              }}
                              className="text-green-600 hover:text-green-900 font-medium ml-3"
                            >
                              Finaliser
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScolaritePage;