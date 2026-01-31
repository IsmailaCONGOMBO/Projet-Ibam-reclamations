import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { reclamationService } from '../services/reclamationService';
import ReclamationDetails from '../components/ReclamationDetails';
import TransmettreScolariteForm from '../components/admin/TransmettreScolariteForm';
import ImputerForm from '../components/admin/ImputerForm'; // Assuming this exists or I will create it
import StatusBadge from '../components/common/StatusBadge';

const DAPage = () => {
  const [reclamations, setReclamations] = useState([]);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [transmettingToScolarite, setTransmettingToScolarite] = useState(false);
  const [imputing, setImputing] = useState(false);
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
      // DA voit :
      // RECEVABLE (à imputer)
      // EN_TRAITEMENT (en cours chez prof)
      // VALIDE_ENSEIGNANT / INVALIDE_ENSEIGNANT (retour prof, à transmettre)
      // TRANSMIS_SCOLARITE (suivi)
      // TRAITE (historique)
      const visibleStatuses = ['RECEVABLE', 'EN_TRAITEMENT', 'VALIDE_ENSEIGNANT', 'INVALIDE_ENSEIGNANT', 'TRANSMIS_SCOLARITE', 'TRAITE'];
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

  const getFilteredReclamations = () => {
    if (filter === 'ALL') return reclamations;
    if (filter === 'A_IMPUTER') return reclamations.filter(r => r.status === 'RECEVABLE');
    if (filter === 'EN_COURS') return reclamations.filter(r => r.status === 'EN_TRAITEMENT');
    if (filter === 'A_TRANSMETTRE') return reclamations.filter(r => ['VALIDE_ENSEIGNANT', 'INVALIDE_ENSEIGNANT'].includes(r.status));
    return reclamations.filter(r => r.status === filter);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                IBAM - Directeur Adjoint
              </h1>
              <p className="text-sm text-gray-600">
                Administration des réclamations - {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                Tableau de bord
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {selectedReclamation && viewingDetails ? (
            <ReclamationDetails
              reclamationId={selectedReclamation.id}
              onClose={() => {
                setSelectedReclamation(null);
                setViewingDetails(false);
              }}
            />
          ) : selectedReclamation && imputing ? (
            // Placeholder for ImputerForm if I need to separate it, or logic here
            // For now assuming we need a form to select teacher
            <ImputerForm
              reclamation={selectedReclamation}
              onSuccess={() => {
                setSelectedReclamation(null);
                setImputing(false);
                loadReclamations();
              }}
              onCancel={() => {
                setSelectedReclamation(null);
                setImputing(false);
              }}
            />
          ) : selectedReclamation && transmettingToScolarite ? (
            <TransmettreScolariteForm
              reclamation={selectedReclamation}
              onSuccess={() => {
                setSelectedReclamation(null);
                setTransmettingToScolarite(false);
                loadReclamations();
              }}
              onCancel={() => {
                setSelectedReclamation(null);
                setTransmettingToScolarite(false);
              }}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Toutes les réclamations ({reclamations.length})
                </h2>
                <div className="flex space-x-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="ALL">Toutes</option>
                    <option value="A_IMPUTER">À imputer</option>
                    <option value="EN_COURS">En traitement</option>
                    <option value="A_TRANSMETTRE">À transmettre</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1000px' }}>
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                          N° Demande
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                          Étudiant
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredReclamations().map((reclamation) => (
                        <tr key={reclamation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {reclamation.numero_demande}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {reclamation.etudiant?.name}
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
                              onClick={() => {
                                setSelectedReclamation(reclamation);
                                setViewingDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Détails
                            </button>
                            {reclamation.status === 'RECEVABLE' && (
                              <button
                                onClick={() => {
                                  setSelectedReclamation(reclamation);
                                  setImputing(true);
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                Imputer
                              </button>
                            )}
                            {(reclamation.status === 'VALIDE_ENSEIGNANT' || reclamation.status === 'INVALIDE_ENSEIGNANT') && (
                              <button
                                onClick={() => {
                                  setSelectedReclamation(reclamation);
                                  setTransmettingToScolarite(true);
                                }}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                Transmettre
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DAPage;