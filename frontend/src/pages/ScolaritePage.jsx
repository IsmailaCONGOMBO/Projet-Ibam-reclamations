import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { reclamationService } from '../services/reclamationService';
import VerifyReclamationForm from '../components/scolarite/VerifyReclamationForm';
import FinaliserReclamationForm from '../components/scolarite/FinaliserReclamationForm';
import ReclamationDetails from '../components/ReclamationDetails';

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
      // Afficher toutes les réclamations (historique complet)
      setReclamations(data);
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
    return reclamations.filter(r => r.statut === filter);
  };

  const getStatusColor = (statut) => {
    const colors = {
      'SOUMISE': 'bg-blue-100 text-blue-800',
      'TRANSMISE_SCOLARITE': 'bg-purple-100 text-purple-800',
      'RECEVABLE': 'bg-green-100 text-green-800',
      'REJETEE': 'bg-red-100 text-red-800',
      'FINALISEE': 'bg-green-100 text-green-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                IBAM - Scolarité
              </h1>
              <p className="text-sm text-gray-600">
                Vérification des réclamations - {user.prenom} {user.nom}
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

      {/* Main Content */}
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Historique des réclamations ({reclamations.length})
                </h2>
                <div className="flex space-x-2">
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="ALL">Toutes</option>
                    <option value="SOUMISE">À vérifier</option>
                    <option value="TRANSMISE_SCOLARITE">À finaliser</option>
                    <option value="FINALISEE">Finalisées</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {reclamations.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <p className="text-gray-500">Aucune réclamation trouvée</p>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200" style={{minWidth: '900px'}}>
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
                              {reclamation.etudiant?.prenom} {reclamation.etudiant?.nom}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {reclamation.matiere?.nom_matiere}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reclamation.statut)}`}>
                                {reclamation.statut}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedReclamation(reclamation);
                                  setViewingDetails(true);
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Voir détails
                              </button>
                              {reclamation.statut === 'SOUMISE' && (
                                <button
                                  onClick={() => {
                                    setSelectedReclamation(reclamation);
                                    setViewingDetails(false);
                                    setFinalizing(false);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  Vérifier
                                </button>
                              )}
                              {reclamation.statut === 'TRANSMISE_SCOLARITE' && (
                                <button
                                  onClick={() => {
                                    setSelectedReclamation(reclamation);
                                    setFinalizing(true);
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
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
      </main>
    </div>
  );
};

export default ScolaritePage;