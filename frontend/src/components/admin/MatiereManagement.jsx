import { useState, useEffect } from 'react';
import { matiereService } from '../../services/matiereService';
import { filiereService } from '../../services/filiereService';
import { userService } from '../../services/userService'; // To list teachers
import { TrashIcon, PencilIcon, PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';

export default function MatiereManagement() {
    const [matieres, setMatieres] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showCreate, setShowCreate] = useState(false);

    // Form for Creation
    const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate } = useForm();

    // Edit Form State
    const [editForm, setEditForm] = useState({
        code_matiere: '',
        nom_matiere: '',
        credit: '',
        filiere_id: '',
        enseignant_id: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [matieresData, filieresData, enseignantsData] = await Promise.all([
                matiereService.getAll(),
                filiereService.getAll(),
                userService.getEnseignants()
            ]);
            setMatieres(matieresData);
            setFilieres(filieresData);
            setEnseignants(enseignantsData);
        } catch (error) {
            console.error('Erreur chargement données:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onCreate = async (data) => {
        try {
            await matiereService.create({
                ...data,
                enseignant_id: data.enseignant_id || null // Send null if empty
            });
            resetCreate();
            setShowCreate(false);
            loadData(); // Reload to get populated data
        } catch (error) {
            alert('Erreur lors de la création');
            console.error(error);
        }
    };

    const startEdit = (matiere) => {
        setEditingId(matiere.id);
        setEditForm({
            code_matiere: matiere.code_matiere,
            nom_matiere: matiere.nom_matiere,
            credit: matiere.credit,
            filiere_id: matiere.filiere_id,
            enseignant_id: matiere.enseignant_id || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ code_matiere: '', nom_matiere: '', credit: '', filiere_id: '', enseignant_id: '' });
    };

    const saveEdit = async (id) => {
        try {
            await matiereService.update(id, {
                ...editForm,
                enseignant_id: editForm.enseignant_id || null
            });
            setEditingId(null);
            loadData();
        } catch (error) {
            alert('Erreur lors de la modification');
            console.error(error);
        }
    };

    const onDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
            try {
                await matiereService.delete(id);
                loadData();
            } catch (error) {
                alert('Erreur lors de la suppression');
                console.error(error);
            }
        }
    };

    if (loading && matieres.length === 0) return <div>Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Matières</h1>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {showCreate ? <XMarkIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                    {showCreate ? 'Fermer' : 'Nouvelle Matière'}
                </button>
            </div>

            {showCreate && (
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 animate-fade-in-down">
                    <h3 className="text-lg font-semibold mb-4">Ajouter une matière</h3>
                    <form onSubmit={handleSubmitCreate(onCreate)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Code</label>
                            <input {...registerCreate('code_matiere', { required: true })} className="input-field mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="PROG1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input {...registerCreate('nom_matiere', { required: true })} className="input-field mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="Programmation" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Crédits</label>
                            <input type="number" {...registerCreate('credit', { required: true, min: 1 })} className="input-field mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="4" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Filière</label>
                            <select {...registerCreate('filiere_id', { required: true })} className="input-field mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="">Choisir...</option>
                                {filieres.map(f => <option key={f.id} value={f.id}>{f.code_filiere}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enseignant</label>
                            <select {...registerCreate('enseignant_id')} className="input-field mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="">Aucun</option>
                                {enseignants.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2 lg:col-span-5 flex justify-end">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">Enregistrer</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crédits</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filière</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {matieres.map(matiere => (
                            <tr key={matiere.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {editingId === matiere.id ? (
                                        <input value={editForm.code_matiere} onChange={e => setEditForm({ ...editForm, code_matiere: e.target.value })} className="border rounded px-2 py-1 w-full" />
                                    ) : matiere.code_matiere}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingId === matiere.id ? (
                                        <input value={editForm.nom_matiere} onChange={e => setEditForm({ ...editForm, nom_matiere: e.target.value })} className="border rounded px-2 py-1 w-full" />
                                    ) : matiere.nom_matiere}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingId === matiere.id ? (
                                        <input type="number" value={editForm.credit} onChange={e => setEditForm({ ...editForm, credit: e.target.value })} className="border rounded px-2 py-1 w-20" />
                                    ) : matiere.credit}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingId === matiere.id ? (
                                        <select value={editForm.filiere_id} onChange={e => setEditForm({ ...editForm, filiere_id: e.target.value })} className="border rounded px-2 py-1 w-full">
                                            {filieres.map(f => <option key={f.id} value={f.id}>{f.code_filiere}</option>)}
                                        </select>
                                    ) : matiere.filiere?.code_filiere}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingId === matiere.id ? (
                                        <select value={editForm.enseignant_id} onChange={e => setEditForm({ ...editForm, enseignant_id: e.target.value })} className="border rounded px-2 py-1 w-full">
                                            <option value="">Aucun</option>
                                            {enseignants.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
                                        </select>
                                    ) : (matiere.enseignant ? `${matiere.enseignant.prenom} ${matiere.enseignant.nom}` : '-')}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {editingId === matiere.id ? (
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => saveEdit(matiere.id)} className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded"><CheckIcon className="h-5 w-5" /></button>
                                            <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-900 bg-gray-50 p-1 rounded"><XMarkIcon className="h-5 w-5" /></button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end space-x-3">
                                            <button onClick={() => startEdit(matiere)} className="text-blue-600 hover:text-blue-900"><PencilIcon className="h-5 w-5" /></button>
                                            <button onClick={() => onDelete(matiere.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
