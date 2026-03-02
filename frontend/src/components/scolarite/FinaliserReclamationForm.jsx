import { useState } from 'react';
import { reclamationService } from '../../services/reclamationService';
import { useForm } from 'react-hook-form';

export default function FinaliserReclamationForm({ reclamation, onSuccess, onCancel }) {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await reclamationService.finaliser(reclamation.id, data.commentaire);
            onSuccess();
        } catch (error) {
            console.error('Erreur lors de la finalisation:', error);
            alert('Erreur technique');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-4 border border-orange-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Validation Finale (Scolarité)</h3>
            
            <div className="mb-4 bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-gray-700">Note actuelle:</span>
                        <span className="ml-2 font-semibold">{reclamation.note_actuelle}/20</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Note souhaitée:</span>
                        <span className="ml-2 font-semibold text-indigo-600">{reclamation.note_souhaitee}/20</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Note corrigée:</span>
                        <span className="ml-2 font-semibold text-green-600">{reclamation.note_corrigee}/20</span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
                Vous êtes sur le point de valider et clôturer cette réclamation.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Commentaire final (Facultatif)</label>
                    <textarea
                        {...register('commentaire')}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        placeholder="Observation finale..."
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                    >
                        {isSubmitting ? 'Validation...' : 'Valider et Clôturer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
