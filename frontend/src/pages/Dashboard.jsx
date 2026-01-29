import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ModernCard from '../components/ModernCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getRoleDisplay = (role) => {
    const roles = {
      'ETUDIANT': 'Étudiant',
      'SCOLARITE': 'Agent Scolarité',
      'ENSEIGNANT': 'Enseignant',
      'DA': 'Directeur Adjoint'
    };
    return roles[role] || role;
  };

  const getWelcomeMessage = (role) => {
    const messages = {
      'ETUDIANT': 'Gérez vos réclamations de notes en toute simplicité',
      'SCOLARITE': 'Traitez les demandes de réclamation des étudiants',
      'ENSEIGNANT': 'Consultez et traitez vos réclamations assignées',
      'DA': 'Supervisez l\'ensemble du processus de réclamation'
    };
    return messages[role] || 'Bienvenue sur la plateforme IBAM';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header moderne */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IBAM</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Tableau de bord
                </h1>
                <p className="text-gray-600">
                  {getRoleDisplay(user.role)} - {user.name}
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                const { logout } = await import('../contexts/AuthContext');
                // Cette approche n'est pas idéale, on va utiliser le contexte directement
                navigate('/login');
              }}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Section de bienvenue */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue, {user.name}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {getWelcomeMessage(user.role)}
          </p>
        </div>
        
        {/* Actions selon le rôle */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {user.role === 'ETUDIANT' && (
            <>
              <ModernCard
                title="Mes Réclamations"
                subtitle="Consultez et gérez vos demandes de réclamation"
                color="blue"
                onClick={() => navigate('/reclamations')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <ModernCard
                title="Nouvelle Réclamation"
                subtitle="Créez une nouvelle demande de réclamation"
                color="green"
                onClick={() => navigate('/reclamations?action=create')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              />
            </>
          )}
          
          {user.role === 'SCOLARITE' && (
            <>
              <ModernCard
                title="Réclamations à vérifier"
                subtitle="Traitez les demandes en attente de vérification"
                color="orange"
                onClick={() => navigate('/scolarite')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                }
              />
              <ModernCard
                title="Liste des Étudiants"
                subtitle="Consultez tous les étudiants par filière et niveau"
                color="blue"
                onClick={() => navigate('/students-list')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                }
              />
            </>
          )}
          
          {user.role === 'ENSEIGNANT' && (
            <>
              <ModernCard
                title="Réclamations imputées"
                subtitle="Traitez les réclamations qui vous sont assignées"
                color="purple"
                onClick={() => navigate('/enseignant')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />
              <ModernCard
                title="Mes Étudiants"
                subtitle="Consultez les étudiants que vous enseignez"
                color="green"
                onClick={() => navigate('/teacher-students')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
            </>
          )}
          
          {user.role === 'DA' && (
            <>
              <ModernCard
                title="Toutes les réclamations"
                subtitle="Vue d'ensemble de toutes les demandes"
                color="indigo"
                onClick={() => navigate('/da')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              />
              <ModernCard
                title="Gestion des Utilisateurs"
                subtitle="Créer et gérer étudiants et enseignants"
                color="green"
                onClick={() => navigate('/users')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                }
              />
              <ModernCard
                title="Gestion des Étudiants"
                subtitle="Consulter et gérer tous les étudiants"
                color="blue"
                onClick={() => navigate('/admin-students')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
              <ModernCard
                title="Filières & Matières"
                subtitle="Gérer les filières et leurs matières"
                color="purple"
                onClick={() => navigate('/filieres')}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />
            </>
          )}
        </div>
        
      </main>
      
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 IBAM - Institut Burkinabé des Arts et Métiers
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Système de gestion des réclamations de notes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;