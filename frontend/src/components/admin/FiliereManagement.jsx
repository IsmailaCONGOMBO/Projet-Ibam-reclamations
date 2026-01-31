import { useState, useEffect } from 'react';
import { filiereService } from '../../services/filiereService';
import { TrashIcon, PencilIcon, PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';

export default function FiliereManagement() {
    const [filieres, setFilieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showCreate, setShowCreate] = useState(false);

    // Form for Creation
    const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, formState: { errors: errorsCreate } } = useForm();

    // Form for Editing (we'll manually handle edit state or use a separate form, but inline is easier for just 2 fields)
    const [editForm, setEditForm] = useState({ code_filiere: '', nom_filiere: '' });

    const fetchFilieres = async () => {
        setLoading(true);
        try {
            const data = await filiereService.getAll();
            setFilieres(data);
        } catch (error) {
            console.error('Erreur chargement filières:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilieres();
    }, []);

    const onCreate = async (data) => {
        try {
            await filiereService.create(data);
            resetCreate();
            setShowCreate(false);
            fetchFilieres();
        } catch (error) {
            alert('Erreur lors de la création');
            console.error(error);
        }
    };

    const startEdit = (filiere) => {
        setEditingId(filiere.id);
        setEditForm({ code_filiere: filiere.code_filiere, nom_filiere: filiere.nom_filiere });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ code_filiere: '', nom_filiere: '' });
    };

    const saveEdit = async (id) => {
        try {
            await filiereService.update(id, editForm);
            setEditingId(null);
            fetchFilieres();
        } catch (error) {
            alert('Erreur lors de la modification');
            console.error(error);
        }
    };

    const onDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
            try {
                await filiereService.delete(id);
                fetchFilieres();
            } catch (error) {
                alert('Erreur lors de la suppression');
                console.error(error);
            }
        }
    };

    if (loading && filieres.length === 0) return <div>Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Filières</h1>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {showCreate ? <XMarkIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                    {showCreate ? 'Fermer' : 'Nouvelle Filière'}
                </button>
            </div>

            {showCreate && (
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 animate-fade-in-down">
                    <h3 className="text-lg font-semibold mb-4">Ajouter une filière</h3>
                    <form onSubmit={handleSubmitCreate(onCreate)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Code</label>
                            <input
                                {...registerCreate('code_filiere', { required: true })}
                                placeholder="ex: L3-INFO"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                {...registerCreate('nom_filiere', { required: true })}
                                placeholder="ex: Licence 3 Informatique"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filieres.map(filiere => (
                            <tr key={filiere.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {editingId === filiere.id ? (
                                        <input
                                            value={editForm.code_filiere}
                                            onChange={e => setEditForm({ ...editForm, code_filiere: e.target.value })}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : filiere.code_filiere}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingId === filiere.id ? (
                                        <input
                                            value={editForm.nom_filiere}
                                            onChange={e => setEditForm({ ...editForm, nom_filiere: e.target.value })}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : filiere.nom_filiere}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {editingId === filiere.id ? (
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => saveEdit(filiere.id)} className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded">
                                                <CheckIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-900 bg-gray-50 p-1 rounded">
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end space-x-3">
                                            <button onClick={() => startEdit(filiere)} className="text-blue-600 hover:text-blue-900">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => onDelete(filiere.id)} className="text-red-600 hover:text-red-900">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filieres.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-10 text-center text-gray-500">Aucune filière trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
