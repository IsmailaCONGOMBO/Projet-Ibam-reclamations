import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReclamationsPage from './pages/ReclamationsPage';
import ScolaritePage from './pages/ScolaritePage';
import EnseignantPage from './pages/EnseignantPage';
import DAPage from './pages/DAPage';
import UsersList from './components/admin/UsersList';
import FiliereManagement from './components/admin/FiliereManagement';
import MatiereManagement from './components/admin/MatiereManagement';
import Layout from './components/layout/Layout';
import StudentsListPage from './pages/StudentsListPage';
import AdminStudentsPage from './pages/AdminStudentsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Routes protégées avec Layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reclamations"
              element={
                <ProtectedRoute roles={['ETUDIANT']}>
                  <ReclamationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scolarite"
              element={
                <ProtectedRoute roles={['SCOLARITE']}>
                  <ScolaritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enseignant"
              element={
                <ProtectedRoute roles={['ENSEIGNANT']}>
                  <EnseignantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/da"
              element={
                <ProtectedRoute roles={['DA']}>
                  <DAPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={['DA']}>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/filieres"
              element={
                <ProtectedRoute roles={['DA']}>
                  <FiliereManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matieres"
              element={
                <ProtectedRoute roles={['DA']}>
                  <MatiereManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students-list"
              element={
                <ProtectedRoute roles={['SCOLARITE']}>
                  <StudentsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-students"
              element={
                <ProtectedRoute roles={['DA']}>
                  <AdminStudentsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                  <p className="mt-2 text-gray-600">Vous n'avez pas les permissions nécessaires.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
