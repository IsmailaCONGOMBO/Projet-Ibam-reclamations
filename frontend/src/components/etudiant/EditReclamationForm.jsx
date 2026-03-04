import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { reclamationService } from '../../services/reclamationService';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function EditReclamationForm({ reclamation, onSuccess }) {
    const { user } = useAuth();
    const [matieres, setMatieres] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            objet: '',
            message: '',
            type: 'ERREUR_COMPTE',
            type_autre: '',
            matiere_id: '',
            enseignant_id: '',
            note_actuelle: '',
            note_souhaitee: '',
        }
    });

    const matiereId = watch('matiere_id');
    const typeValue = watch('type');

    useEffect(() => {
        api.get('/matieres').then(res => setMatieres(res.data));
    }, []);

    useEffect(() => {
        if (matiereId) {
            api.get(`/matieres/${matiereId}`)
                .then(res => {
                    if (res.data.enseignant) {
                        setEnseignants([res.data.enseignant]);
                        setValue('enseignant_id', res.data.enseignant.id);
                    } else {
                        setEnseignants([]);
                        setValue('enseignant_id', '');
                    }
                })
                .catch(() => {
                    setEnseignants([]);
                    setValue('enseignant_id', '');
                });
        } else {
            setEnseignants([]);
            setValue('enseignant_id', '');
        }
    }, [matiereId, setValue]);

    useEffect(() => {
        if (reclamation && matieres.length > 0) {
            console.log('Reset form with:', {
                matiere_id: reclamation.matiere_id,
                objet: reclamation.objet,
                note_actuelle: reclamation.note_actuelle,
                note_souhaitee: reclamation.note_souhaitee
            });
            const isAutreType = !['ERREUR_COMPTE', 'PARTIE_NON_CORRIGEE'].includes(reclamation.type);
            reset({
                objet: reclamation.objet || '',
                message: reclamation.message || '',
                type: isAutreType ? 'AUTRE' : reclamation.type,
                type_autre: isAutreType ? reclamation.type : '',
                matiere_id: String(reclamation.matiere_id) || '',
                enseignant_id: String(reclamation.enseignant_id) || '',
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
            formData.append('type', data.type === 'AUTRE' ? data.type_autre : data.type);
            formData.append('matiere_id', data.matiere_id);
            formData.append('enseignant_id', data.enseignant_id);
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
                <label className="block text-sm font-medium text-gray-700">Enseignant</label>
                <select
                    {...register('enseignant_id', { required: "L'enseignant est requis" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    disabled={!matiereId || enseignants.length === 0}
                >
                    <option value="">Sélectionner un enseignant</option>
                    {enseignants.map(e => (
                        <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                    ))}
                </select>
                {errors.enseignant_id && <span className="text-red-500 text-sm">{errors.enseignant_id.message}</span>}
                {matiereId && enseignants.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">Aucun enseignant assigné à cette matière</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    {...register('type', { required: 'Le type est requis' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="ERREUR_COMPTE">Erreur de Compte</option>
                    <option value="PARTIE_NON_CORRIGEE">Partie non corrigée</option>
                    <option value="AUTRE">Autre</option>
                </select>
                {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
            </div>

            {typeValue === 'AUTRE' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Précisez le type</label>
                    <input
                        type="text"
                        {...register('type_autre', { required: typeValue === 'AUTRE' ? 'Veuillez préciser le type' : false })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Ex: Erreur de saisie, Copie non rendue..."
                    />
                    {errors.type_autre && <span className="text-red-500 text-sm">{errors.type_autre.message}</span>}
                </div>
            )}

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
