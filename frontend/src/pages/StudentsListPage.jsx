import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StudentsList from '../components/scolarite/StudentsList';

const StudentsListPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
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
                  Liste des Étudiants
                </h1>
                <p className="text-gray-600">
                  {user.name} - Agent Scolarité
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
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <StudentsList onClose={() => navigate('/dashboard')} />
        </div>
      </main>
    </div>
  );
};

export default StudentsListPage;