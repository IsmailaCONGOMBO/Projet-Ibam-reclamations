import { useState, useEffect } from 'react';
import { reclamationService } from '../../services/reclamationService';
import { userService } from '../../services/userService'; // Assuming this service exists

export default function ImputerForm({ reclamation, onSuccess, onCancel }) {
    const [enseignants, setEnseignants] = useState([]);
    const [selectedEnseignant, setSelectedEnseignant] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadEnseignants();
    }, []);

    const loadEnseignants = async () => {
        try {
            // Ideally fetch teachers linked to the subject reclamation.matiere_id
            // For now, let's assume we can fetch all teachers or filter them
            // We might need a specific endpoint like /matieres/:id/enseignants
            // Or just get all users with role ENSEIGNANT
            const data = await userService.getEnseignants();
            setEnseignants(data);
        } catch (err) {
            console.error(err);
            setError('Impossible de charger les enseignants');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEnseignant) return;

        setSubmitting(true);
        try {
            await reclamationService.imputer(reclamation.id, selectedEnseignant);
            onSuccess();
        } catch (err) {
            setError('Erreur lors de l\'imputation');
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Imputer la réclamation</h2>

            <div className="mb-4">
                <p className="text-sm text-gray-600">Matière: <span className="font-semibold">{reclamation.matiere?.nom_matiere}</span></p>
                <p className="text-sm text-gray-600">Étudiant: <span className="font-semibold">{reclamation.etudiant?.name}</span></p>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choisir l'enseignant
                    </label>
                    <select
                        value={selectedEnseignant}
                        onChange={(e) => setSelectedEnseignant(e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Sélectionner un enseignant</option>
                        {enseignants.map(ens => (
                            <option key={ens.id} value={ens.id}>
                                {ens.nom} {ens.prenom}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        disabled={submitting}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={submitting || !selectedEnseignant}
                    >
                        {submitting ? 'Validation...' : 'Valider'}
                    </button>
                </div>
            </form>
        </div>
    );
}
