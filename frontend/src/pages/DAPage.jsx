import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { reclamationService } from '../services/reclamationService';
import ReclamationDetails from '../components/ReclamationDetails';
import TransmettreScolariteForm from '../components/admin/TransmettreScolariteForm';

const DAPage = () => {
  const [reclamations, setReclamations] = useState([]);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [transmettingToScolarite, setTransmettingToScolarite] = useState(false);
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

  const handleImputer = async (reclamationId) => {
    if (confirm('Voulez-vous imputer cette réclamation à l\'enseignant concerné ?')) {
      try {
        await reclamationService.imputer(reclamationId);
        loadReclamations();
      } catch (err) {
        alert('Erreur lors de l\'imputation');
      }
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      'BROUILLON': 'bg-gray-100 text-gray-800',
      'SOUMISE': 'bg-blue-100 text-blue-800',
      'RECEVABLE': 'bg-green-100 text-green-800',
      'REJETEE': 'bg-red-100 text-red-800',
      'IMPUTEE_ENSEIGNANT': 'bg-yellow-100 text-yellow-800',
      'VALIDEE_ENSEIGNANT': 'bg-green-100 text-green-800',
      'INVALIDEE_ENSEIGNANT': 'bg-red-100 text-red-800',
      'TRANSMISE_SCOLARITE': 'bg-purple-100 text-purple-800',
      'FINALISEE': 'bg-green-100 text-green-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getFilteredReclamations = () => {
    if (filter === 'ALL') return reclamations;
    if (filter === 'PENDING') return reclamations.filter(r => r.statut === 'RECEVABLE');
    if (filter === 'ASSIGNED') return reclamations.filter(r => r.statut === 'IMPUTEE_ENSEIGNANT');
    if (filter === 'COMPLETED') return reclamations.filter(r => ['VALIDEE', 'INVALIDEE', 'TRAITEE_NOTE_CORRIGEE'].includes(r.statut));
    return reclamations;
  };

  const getStats = () => {
    const total = reclamations.length;
    const pending = reclamations.filter(r => r.statut === 'RECEVABLE').length;
    const assigned = reclamations.filter(r => r.statut === 'IMPUTEE_ENSEIGNANT').length;
    const completed = reclamations.filter(r => ['VALIDEE', 'INVALIDEE', 'TRAITEE_NOTE_CORRIGEE'].includes(r.statut)).length;
    return { total, pending, assigned, completed };
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  const stats = getStats();
  const filteredReclamations = getFilteredReclamations();

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
          ) : selectedReclamation ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de la réclamation
                </h2>
                <button
                  onClick={() => setSelectedReclamation(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Retour à la liste
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900">N° Demande</h3>
                  <p className="text-gray-600">{selectedReclamation.numero_demande}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Étudiant</h3>
                  <p className="text-gray-600">{selectedReclamation.etudiant?.name} ({selectedReclamation.etudiant?.matricule})</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Matière</h3>
                  <p className="text-gray-600">{selectedReclamation.matiere?.nom_matiere}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Enseignant</h3>
                  <p className="text-gray-600">{selectedReclamation.matiere?.enseignant?.name || 'Non assigné'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Statut</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReclamation.statut)}`}>
                    {selectedReclamation.statut}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Date création</h3>
                  <p className="text-gray-600">{selectedReclamation.created_at}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-900">Objet</h3>
                  <p className="text-gray-600">{selectedReclamation.objet_demande}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-900">Motif</h3>
                  <p className="text-gray-600">{selectedReclamation.motif}</p>
                </div>
                {selectedReclamation.commentaire_scolarite && (
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900">Commentaire Scolarité</h3>
                    <p className="text-gray-600">{selectedReclamation.commentaire_scolarite}</p>
                  </div>
                )}
                {selectedReclamation.decision_enseignant && (
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900">Décision Enseignant</h3>
                    <p className="text-gray-600">{selectedReclamation.decision_enseignant}</p>
                  </div>
                )}
                {selectedReclamation.note_corrigee && (
                  <div>
                    <h3 className="font-medium text-gray-900">Note corrigée</h3>
                    <p className="text-gray-600">{selectedReclamation.note_corrigee}/20</p>
                  </div>
                )}
              </div>

              {selectedReclamation.statut === 'RECEVABLE' && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => handleImputer(selectedReclamation.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-4"
                  >
                    Imputer à l'enseignant
                  </button>
                </div>
              )}
              {(selectedReclamation.statut === 'VALIDEE_ENSEIGNANT' || selectedReclamation.statut === 'INVALIDEE_ENSEIGNANT') && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => setTransmettingToScolarite(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                  >
                    Transmettre à la Scolarité
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Total</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">À imputer</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">En cours</h3>
                  <p className="text-3xl font-bold text-yellow-600">{stats.assigned}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Terminées</h3>
                  <p className="text-3xl font-bold text-gray-600">{stats.completed}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Toutes les réclamations ({filteredReclamations.length})
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('ALL')}
                    className={`px-3 py-1 rounded text-sm ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Toutes
                  </button>
                  <button
                    onClick={() => setFilter('PENDING')}
                    className={`px-3 py-1 rounded text-sm ${filter === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    À imputer
                  </button>
                  <button
                    onClick={() => setFilter('ASSIGNED')}
                    className={`px-3 py-1 rounded text-sm ${filter === 'ASSIGNED' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    En cours
                  </button>
                  <button
                    onClick={() => setFilter('COMPLETED')}
                    className={`px-3 py-1 rounded text-sm ${filter === 'COMPLETED' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Terminées
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200" style={{minWidth: '1000px'}}>
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
                      {filteredReclamations.map((reclamation) => (
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
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reclamation.statut)}`}>
                              {reclamation.statut}
                            </span>
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
                              Voir détails
                            </button>
                            {reclamation.statut === 'RECEVABLE' && (
                              <button
                                onClick={() => handleImputer(reclamation.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Imputer
                              </button>
                            )}
                            {(reclamation.statut === 'VALIDEE_ENSEIGNANT' || reclamation.statut === 'INVALIDEE_ENSEIGNANT') && (
                              <button
                                onClick={() => {
                                  setSelectedReclamation(reclamation);
                                  setTransmettingToScolarite(true);
                                }}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
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