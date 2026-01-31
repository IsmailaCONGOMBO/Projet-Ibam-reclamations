import { useState, useEffect } from 'react';
import api from '../../services/api';
import CreateUserForm from './CreateUserForm';
import UserDetails from './UserDetails';
import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <UserPlusIcon className="h-5 w-5" />
                    Nouvel Utilisateur
                </button>
            </div>

            {showCreate && (
                <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Créer un utilisateur</h2>
                        <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-700">
                            Fermer
                        </button>
                    </div>
                    <CreateUserForm onSuccess={() => {
                        setShowCreate(false);
                        fetchUsers();
                    }} />
                </div>
            )}

            {editingUser && (
                <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Modifier l'utilisateur</h2>
                        <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:text-gray-700">
                            Fermer
                        </button>
                    </div>
                    {/* Reuse CreateUserForm for edit with initial data if supported, or a separate component */}
                    {/* For simplicity assuming CreateUserForm handles update or passing props */}
                    <UserDetails user={editingUser} onClose={() => setEditingUser(null)} onUpdate={fetchUsers} />
                </div>
            )}

            <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <li key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {user.roles?.[0]?.name || 'Aucun rôle'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingUser(user)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
