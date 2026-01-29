import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CreateUserForm from './CreateUserForm';
import UserDetails from './UserDetails';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const url = filter ? `http://localhost:8000/api/users?role=${filter}` : 'http://localhost:8000/api/users';
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await fetch(`http://localhost:8000/api/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        loadUsers();
      } catch (err) {
        console.error('Erreur lors de la suppression');
      }
    }
  };

  if (selectedUserId) {
    return (
      <UserDetails
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    );
  }

  if (showCreateForm) {
    return (
      <CreateUserForm
        onSuccess={() => {
          setShowCreateForm(false);
          loadUsers();
        }}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IBAM</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Gestion des Utilisateurs
                </h1>
                <p className="text-gray-600">
                  {user.name} - Directeur Adjoint
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                Tableau de bord
              </button>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Liste des Utilisateurs</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Créer un utilisateur
        </button>
      </div>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Tous les utilisateurs</option>
          <option value="ETUDIANT">Étudiants</option>
          <option value="ENSEIGNANT">Enseignants</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">Chargement...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'ETUDIANT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email} • {user.matricule}
                        </div>
                        {user.ine && (
                          <div className="text-sm text-gray-500">
                            INE: {user.ine} • Niveau: {user.niveau}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Filière: {user.filiere?.nom_filiere}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedUserId(user.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Voir détails
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
};

export default UsersList;