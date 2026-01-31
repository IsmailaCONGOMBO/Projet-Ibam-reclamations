import { useState, useEffect } from 'react';
import api from '../../services/api';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';

export default function FiliereManagement() {
    const [filieres, setFilieres] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const fetchFilieres = async () => {
        try {
            const res = await api.get('/filieres');
            setFilieres(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFilieres();
    }, []);

    const onSubmit = async (data) => {
        try {
            await api.post('/filieres', data);
            reset();
            setShowCreate(false);
            fetchFilieres();
        } catch (error) {
            alert('Erreur création');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des Filières</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nouvelle Filière
                </button>
            </div>

            {showCreate && (
                <div className="bg-gray-50 p-6 rounded shadow mb-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Nom</label>
                                <input {...register('nom', { required: true })} className="mt-1 block w-full rounded border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Code</label>
                                <input {...register('code', { required: true })} className="mt-1 block w-full rounded border-gray-300" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowCreate(false)} className="text-gray-600">Annuler</button>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Enregistrer</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Département</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filieres.map(f => (
                            <tr key={f.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.nom}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.departement || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
