import { useState, useEffect } from 'react';
import ReclamationDetails from '../ReclamationDetails';
import EditReclamationForm from './EditReclamationForm';

const MesReclamations = () => {
  const [reclamations, setReclamations] = useState([]);
  const [selectedReclamationId, setSelectedReclamationId] = useState(null);
  const [editingReclamation, setEditingReclamation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReclamations();
  }, []);

  const loadReclamations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/reclamations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setReclamations(data);
    } catch (err) {
      console.error('Erreur lors du chargement des réclamations');
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

  if (editingReclamation) {
    return (
      <EditReclamationForm
        reclamation={editingReclamation}
        onSuccess={() => {
          setEditingReclamation(null);
          loadReclamations();
        }}
        onCancel={() => setEditingReclamation(null)}
      />
    );
  }

  if (selectedReclamationId) {
    return (
      <ReclamationDetails
        reclamationId={selectedReclamationId}
        onClose={() => setSelectedReclamationId(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes Réclamations</h1>
        <button
          onClick={() => window.location.href = '/nouvelle-reclamation'}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Nouvelle réclamation
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Chargement...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {reclamations.map((reclamation) => (
              <li key={reclamation.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(reclamation.statut)}`}>
                          {reclamation.statut}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{reclamation.numero_demande}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reclamation.objet_demande}
                        </div>
                        <div className="text-sm text-gray-500">
                          Matière: {reclamation.matiere?.nom_matiere}
                        </div>
                        <div className="text-sm text-gray-500">
                          Créée le: {new Date(reclamation.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedReclamationId(reclamation.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Voir détails
                    </button>
                    {reclamation.statut === 'BROUILLON' && (
                      <button
                        onClick={() => setEditingReclamation(reclamation)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MesReclamations;