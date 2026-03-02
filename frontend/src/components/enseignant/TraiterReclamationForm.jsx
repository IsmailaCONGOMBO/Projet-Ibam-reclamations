import { useState } from 'react';
import { reclamationService } from '../../services/reclamationService';
import { useForm } from 'react-hook-form';
import JustificatifViewer from '../JustificatifViewer';

export default function TraiterReclamationForm({ reclamation, onSuccess }) {
    const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm();
    const valideValue = watch('valide');

    const onSubmit = async (data) => {
        try {
            // data.valide est une string "true"/"false" venant des radios, convertir en bool
            const isValid = data.valide === 'true';
            await reclamationService.traiter(
                reclamation.id,
                isValid,
                data.commentaire,
                isValid ? data.note_corrigee : null
            );
            onSuccess();
        } catch (error) {
            console.error('Erreur lors du traitement:', error);
            alert('Erreur technique');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-4 border border-indigo-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Traitement Enseignant</h3>

            <div className="mb-4 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                <div>
                    <span className="text-sm font-medium text-gray-700">Note actuelle:</span>
                    <span className="ml-2 text-lg font-semibold text-gray-900">{reclamation.note_actuelle}/20</span>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-700">Note souhaitée:</span>
                    <span className="ml-2 text-lg font-semibold text-indigo-600">{reclamation.note_souhaitee}/20</span>
                </div>
            </div>

            <div className="mb-6">
                <JustificatifViewer piece_jointe={reclamation.piece_jointe} reclamationId={reclamation.id} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Décision</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                {...register('valide', { required: 'La décision est requise' })}
                                value="true"
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Valider la réclamation (Correction note)</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                {...register('valide', { required: 'La décision est requise' })}
                                value="false"
                                className="form-radio text-red-600"
                            />
                            <span className="ml-2">Invalider (Rejeter)</span>
                        </label>
                    </div>
                </div>

                {valideValue === 'true' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nouvelle Note / 20</label>
                        <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="20"
                            {...register('note_corrigee', { required: 'La note corrigée est requise si validé' })}
                            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Justification / Commentaire</label>
                    <textarea
                        {...register('commentaire', { required: 'Le commentaire est requis' })}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Expliquez la correction apportée ou le motif du rejet..."
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onSuccess} // Or onCancel provided via prop? Assuming onSuccess acts as close or reload
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        {isSubmitting ? 'Envoi...' : 'Envoyer le traitement'}
                    </button>
                </div>
            </form>
        </div>
    );
}
