import { useState, useEffect } from 'react';
import { reclamationService } from '../../services/reclamationService';

const StudentsListFromReclamations = ({ onClose }) => {
  const [students, setStudents] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Charger les réclamations pour extraire les étudiants
      const reclamations = await reclamationService.getAll();
      
      // Extraire les étudiants uniques des réclamations
      const uniqueStudents = [];
      const studentIds = new Set();
      
      reclamations.forEach(reclamation => {
        if (reclamation.etudiant && !studentIds.has(reclamation.etudiant.id)) {
          studentIds.add(reclamation.etudiant.id);
          uniqueStudents.push({
            id: reclamation.etudiant.id,
            prenom: reclamation.etudiant.prenom,
            nom: reclamation.etudiant.nom,
            matricule: reclamation.etudiant.matricule,
            ine: reclamation.etudiant.ine,
            niveau: reclamation.etudiant.niveau,
            filiere: reclamation.etudiant.filiere
          });
        }
      });

      // Extraire les filières uniques
      const uniqueFilieres = [];
      const filiereIds = new Set();
      
      uniqueStudents.forEach(student => {
        if (student.filiere && !filiereIds.has(student.filiere.id)) {
          filiereIds.add(student.filiere.id);
          uniqueFilieres.push(student.filiere);
        }
      });

      setStudents(uniqueStudents);
      setFilieres(uniqueFilieres);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStudents = () => {
    return students.filter(student => {
      const filiereMatch = !selectedFiliere || student.filiere?.id == selectedFiliere;
      const niveauMatch = !selectedNiveau || student.niveau === selectedNiveau;
      return filiereMatch && niveauMatch;
    });
  };

  const filteredStudents = getFilteredStudents();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Étudiants (via réclamations)</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
        <p className="text-sm">
          <strong>Note:</strong> Cette liste affiche uniquement les étudiants qui ont soumis des réclamations.
        </p>
      </div>

      <div className="flex space-x-4 mb-6">
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
                  Filière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Niveau
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
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
          {filteredStudents.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              {error ? 'Impossible de charger les données' : 'Aucun étudiant trouvé'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentsListFromReclamations;