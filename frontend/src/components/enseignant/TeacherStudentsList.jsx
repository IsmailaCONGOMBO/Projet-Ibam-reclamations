import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const TeacherStudentsList = ({ onClose }) => {
  const [students, setStudents] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadTeacherMatieres();
  }, []);

  useEffect(() => {
    if (selectedMatiere) {
      loadStudentsByMatiere();
    }
  }, [selectedMatiere]);

  const loadTeacherMatieres = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/enseignant/${user.id}/matieres`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.status === 403) {
        setError('Accès non autorisé pour charger vos matières.');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const matieresArray = Array.isArray(data) ? data : [];
      setMatieres(matieresArray);
      if (matieresArray.length > 0) {
        setSelectedMatiere(matieresArray[0].id);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des matières:', err);
      setError('Erreur lors du chargement des matières: ' + err.message);
    }
  };

  const loadStudentsByMatiere = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/api/matiere/${selectedMatiere}/etudiants`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.status === 403) {
        setError('Accès non autorisé pour consulter les étudiants de cette matière.');
        setStudents([]);
        return;
      }
      
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mes Étudiants</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="mb-6">
        <select
          value={selectedMatiere}
          onChange={(e) => setSelectedMatiere(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Sélectionner une matière</option>
          {matieres.map(m => (
            <option key={m.id} value={m.id}>{m.nom_matiere}</option>
          ))}
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
                  Filière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Niveau
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
                    {student.filiere?.nom_filiere}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.niveau}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun étudiant trouvé pour cette matière
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherStudentsList;