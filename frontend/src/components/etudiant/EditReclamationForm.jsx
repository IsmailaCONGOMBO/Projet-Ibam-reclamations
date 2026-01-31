import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { reclamationService } from '../../services/reclamationService';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function EditReclamationForm({ reclamation, onSuccess }) {
    const { user } = useAuth();
    const [matieres, setMatieres] = useState([]);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            objet: reclamation?.objet || '',
            message: reclamation?.message || '',
            type: reclamation?.type || 'NOTE',
            matiere_id: reclamation?.matiere_id || '',
        }
    });

    useEffect(() => {
        // Fetch matieres
        api.get('/matieres').then(res => setMatieres(res.data));
    }, []);

    const onSubmit = async (data) => {
        try {
            if (reclamation) {
                await reclamationService.update(reclamation.id, data);
            } else {
                await reclamationService.create(data);
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving reclamation:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
            <div>
                <label className="block text-sm font-medium text-gray-700">Matière</label>
                <select
                    {...register('matiere_id', { required: 'La matière est requise' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="">Sélectionner une matière</option>
                    {matieres.map(m => (
                        <option key={m.id} value={m.id}>{m.nom} ({m.code})</option>
                    ))}
                </select>
                {errors.matiere_id && <span className="text-red-500 text-sm">{errors.matiere_id.message}</span>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    {...register('type', { required: 'Le type est requis' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="NOTE">Erreur de Note</option>
                    <option value="ABSENCE">Absence injustifiée</option>
                    <option value="AUTRE">Autre</option>
                </select>
                {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Objet</label>
                <input
                    type="text"
                    {...register('objet', { required: "L'objet est requis" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.objet && <span className="text-red-500 text-sm">{errors.objet.message}</span>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                    rows={4}
                    {...register('message', { required: 'Le message est requis' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Enregistrement...' : (reclamation ? 'Mettre à jour' : 'Créer')}
                </button>
            </div>
        </form>
    );
}
