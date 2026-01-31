import { useState, useEffect } from 'react';
import api from '../services/api';

export default function StudentsListPage() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        api.get('/etudiants').then(res => setStudents(res.data)).catch(console.error);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Liste des Étudiants</h1>
            <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                    {students.map(student => (
                        <li key={student.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">{student.nom} {student.prenom}</h3>
                                    <p className="text-sm text-gray-500">{student.matricule} - {student.email}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {student.filiere?.nom}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
