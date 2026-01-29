import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const FiliereManagement = () => {
  const [filieres, setFilieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [showCreateFiliere, setShowCreateFiliere] = useState(false);
  const [showCreateMatiere, setShowCreateMatiere] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [filiereForm, setFiliereForm] = useState({
    code_filiere: '',
    nom_filiere: ''
  });

  const [matiereForm, setMatiereForm] = useState({
    code_matiere: '',
    nom_matiere: '',
    credit: '',
    filiere_id: ''
  });

  useEffect(() => {
    loadFilieres();
    loadEnseignants();
  }, []);

  const loadFilieres = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/filieres', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setFilieres(data);
    } catch (err) {
      console.error('Erreur lors du chargement des filières');
    }
  };

  const loadEnseignants = async () => {
    try {
      const response = await fetch('/api/users?role=ENSEIGNANT', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setEnseignants(data);
    } catch (err) {
      console.error('Erreur lors du chargement des enseignants');
    }
  };

  const handleCreateFiliere = async (e) => {
    e.preventDefault();
    console.log('Tentative de création:', filiereForm);
    console.log('Token:', localStorage.getItem('token'));
    
    try {
      const response = await fetch('http://localhost:8000/api/filieres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(filiereForm)
      });

      console.log('Réponse status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Succès:', result);
        setShowCreateFiliere(false);
        setFiliereForm({ code_filiere: '', nom_filiere: '' });
        loadFilieres();
        alert('Filière créée avec succès!');
      } else {
        const errorData = await response.json();
        console.error('Erreur réponse:', errorData);
        alert('Erreur: ' + (errorData.message || 'Impossible de créer la filière'));
      }
    } catch (err) {
      console.error('Erreur catch:', err);
      alert('Erreur de connexion: ' + err.message);
    }
  };

  const handleCreateMatiere = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/matieres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(matiereForm)
      });

      if (response.ok) {
        setShowCreateMatiere(false);
        setMatiereForm({ code_matiere: '', nom_matiere: '', credit: '', filiere_id: '' });
        loadFilieres();
      }
    } catch (err) {
      console.error('Erreur lors de la création');
    }
  };

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
                  Gestion Filières & Matières
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
        <h2 className="text-xl font-bold text-gray-900">Administration des Filières</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowCreateFiliere(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Créer Filière
          </button>
          <button
            onClick={() => setShowCreateMatiere(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Créer Matière
          </button>
        </div>
      </div>

      {showCreateFiliere && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Créer une Filière</h2>
            <form onSubmit={handleCreateFiliere} className="space-y-4">
              <input
                type="text"
                placeholder="Code filière"
                value={filiereForm.code_filiere}
                onChange={(e) => setFiliereForm({...filiereForm, code_filiere: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Nom filière"
                value={filiereForm.nom_filiere}
                onChange={(e) => setFiliereForm({...filiereForm, nom_filiere: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <div className="flex space-x-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateFiliere(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateMatiere && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Créer une Matière</h2>
            <form onSubmit={handleCreateMatiere} className="space-y-4">
              <input
                type="text"
                placeholder="Code matière"
                value={matiereForm.code_matiere}
                onChange={(e) => setMatiereForm({...matiereForm, code_matiere: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Nom matière"
                value={matiereForm.nom_matiere}
                onChange={(e) => setMatiereForm({...matiereForm, nom_matiere: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Crédit"
                value={matiereForm.credit}
                onChange={(e) => setMatiereForm({...matiereForm, credit: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <select
                value={matiereForm.filiere_id}
                onChange={(e) => setMatiereForm({...matiereForm, filiere_id: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Sélectionner une filière</option>
                {filieres.map(f => (
                  <option key={f.id} value={f.id}>{f.nom_filiere}</option>
                ))}
              </select>
              <div className="flex space-x-2">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateMatiere(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filieres.map(filiere => (
          <div key={filiere.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold text-blue-600">{filiere.nom_filiere}</h3>
            <p className="text-sm text-gray-600">Code: {filiere.code_filiere}</p>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Matières ({filiere.matieres?.length || 0})</h4>
              {filiere.matieres?.map(matiere => (
                <div key={matiere.id} className="bg-gray-50 p-2 rounded mb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{matiere.nom_matiere}</span>
                    <span className="text-sm text-gray-600">{matiere.credit} crédits</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Enseignant: {matiere.enseignant ? `${matiere.enseignant.prenom} ${matiere.enseignant.nom}` : 'Non attribué'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default FiliereManagement;