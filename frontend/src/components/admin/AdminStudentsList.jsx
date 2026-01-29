import { useState, useEffect } from 'react';

const AdminStudentsList = ({ onClose }) => {
  const [students, setStudents] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFilieres();
    loadStudents();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [selectedFiliere, selectedNiveau, searchTerm]);

  const loadFilieres = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/filieres', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setFilieres(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des filières:', err);
      setError('Erreur lors du chargement des filières: ' + err.message);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      // L'admin utilise la route users avec role=ETUDIANT
      let url = 'http://localhost:8000/api/users?role=ETUDIANT';
      const params = new URLSearchParams();
      if (selectedFiliere) params.append('filiere_id', selectedFiliere);
      if (selectedNiveau) params.append('niveau', selectedNiveau);
      if (searchTerm) params.append('search', searchTerm);
      if (params.toString()) url += '&' + params.toString();
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des étudiants:', err);
      setError('Erreur lors du chargement des étudiants: ' + err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${studentId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (response.ok) {
          loadStudents(); // Recharger la liste
        } else {
          throw new Error('Erreur lors de la suppression');
        }
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de l\'étudiant');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Étudiants</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom, matricule ou INE..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <select
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Toutes les filières</option>
          {filieres.map(f => (
            <option key={f.id} value={f.id}>{f.nom_filiere}</option>
          ))}
        </select>
        
        <select
          value={selectedNiveau}
          onChange={(e) => setSelectedNiveau(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Tous les niveaux</option>
          <option value="L1">L1</option>
          <option value="L2">L2</option>
          <option value="L3">L3</option>
          <option value="M1">M1</option>
          <option value="M2">M2</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom & Prénom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  INE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Filière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(students) && students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.prenom} {student.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.matricule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.ine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.filiere?.nom_filiere}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.niveau}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              {error ? 'Impossible de charger les données' : 'Aucun étudiant trouvé'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminStudentsList;