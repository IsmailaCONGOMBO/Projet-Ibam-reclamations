import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateReclamationForm from '../components/etudiant/CreateReclamationForm';
import EditReclamationForm from '../components/etudiant/EditReclamationForm';
import ReclamationsList from '../components/etudiant/ReclamationsList';
import ReclamationDetails from '../components/ReclamationDetails';

const ReclamationsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReclamation, setEditingReclamation] = useState(null);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    // La liste se rechargera automatiquement
  };

  const handleView = (reclamation) => {
    setSelectedReclamation(reclamation);
  };

  const handleEdit = (reclamation) => {
    setEditingReclamation(reclamation);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                IBAM - Réclamations
              </h1>
              <p className="text-sm text-gray-600">
                Espace Étudiant - {user.name}
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
          {showCreateForm ? (
            <CreateReclamationForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : editingReclamation ? (
            <EditReclamationForm
              reclamation={editingReclamation}
              onSuccess={() => {
                setEditingReclamation(null);
              }}
              onCancel={() => setEditingReclamation(null)}
            />
          ) : selectedReclamation ? (
            <ReclamationDetails
              reclamationId={selectedReclamation.id}
              onClose={() => setSelectedReclamation(null)}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Mes Réclamations
                </h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  + Nouvelle Réclamation
                </button>
              </div>
              
              <ReclamationsList
                onView={handleView}
                onEdit={handleEdit}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReclamationsPage;