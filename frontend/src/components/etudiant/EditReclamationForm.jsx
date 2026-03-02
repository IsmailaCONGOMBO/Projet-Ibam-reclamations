import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { reclamationService } from '../../services/reclamationService';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function EditReclamationForm({ reclamation, onSuccess }) {
    const { user } = useAuth();
    const [matieres, setMatieres] = useState([]);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            objet: '',
            message: '',
            type: 'NOTE',
            matiere_id: '',
            note_actuelle: '',
            note_souhaitee: '',
        }
    });

    useEffect(() => {
        api.get('/matieres').then(res => setMatieres(res.data));
    }, []);

    useEffect(() => {
        if (reclamation && matieres.length > 0) {
            console.log('Reset form with:', {
                matiere_id: reclamation.matiere_id,
                objet: reclamation.objet,
                note_actuelle: reclamation.note_actuelle,
                note_souhaitee: reclamation.note_souhaitee
            });
            reset({
                objet: reclamation.objet || '',
                message: reclamation.message || '',
                type: reclamation.type || 'NOTE',
                matiere_id: String(reclamation.matiere_id) || '',
                note_actuelle: reclamation.note_actuelle || '',
                note_souhaitee: reclamation.note_souhaitee || '',
            });
        }
    }, [reclamation, matieres, reset]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            console.log('Form Data received:', data);
            console.log('Piece jointe raw:', data.piece_jointe);
            console.log('Piece jointe verify:', data.piece_jointe?.[0]);

            formData.append('objet', data.objet);
            formData.append('message', data.message);
            formData.append('type', data.type);
            formData.append('matiere_id', data.matiere_id);
            formData.append('note_actuelle', data.note_actuelle);
            formData.append('note_souhaitee', data.note_souhaitee);

            // Gestion du fichier uniquement en création pour l'instant (simplification)
            if (!reclamation && data.piece_jointe[0]) {
                formData.append('piece_jointe', data.piece_jointe[0]);
            }

            if (reclamation) {
                // Update logic... (si on veut gérer l'update de fichier plus tard)
                await reclamationService.update(reclamation.id, data);
            } else {
                await reclamationService.create(formData);
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving reclamation:', error);
            const msg = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join('\n')
                : (error.response?.data?.message || 'Erreur lors de la sauvegarde');
            alert(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow" encType="multipart/form-data">
            <div>
                <label className="block text-sm font-medium text-gray-700">Matière</label>
                <select
                    {...register('matiere_id', { required: 'La matière est requise' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="">Sélectionner une matière</option>
                    {matieres.map(m => (
                        <option key={m.id} value={m.id}>{m.nom_matiere} ({m.code_matiere})</option>
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Note actuelle</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        {...register('note_actuelle', { 
                            required: 'La note actuelle est requise',
                            min: { value: 0, message: 'Min 0' },
                            max: { value: 20, message: 'Max 20' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.note_actuelle && <span className="text-red-500 text-sm">{errors.note_actuelle.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Note souhaitée</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        {...register('note_souhaitee', { 
                            required: 'La note souhaitée est requise',
                            min: { value: 0, message: 'Min 0' },
                            max: { value: 20, message: 'Max 20' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.note_souhaitee && <span className="text-red-500 text-sm">{errors.note_souhaitee.message}</span>}
                </div>
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

            {!reclamation && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Justificatif (PDF ou Image, obligatoire)
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        {...register('piece_jointe', { required: 'Le justificatif est obligatoire' })}
                        className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                    />
                    {errors.piece_jointe && <span className="text-red-500 text-sm">{errors.piece_jointe.message}</span>}
                </div>
            )}

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
