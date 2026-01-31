import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminStudentsList() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        api.get('/etudiants').then(res => setStudents(res.data)).catch(console.error);
    }, []);

    return (
        <div className="bg-white shadow overflow-hidden rounded-md">
            <ul className="divide-y divide-gray-200">
                {students.map(student => (
                    <li key={student.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">{student.nom} {student.prenom}</h3>
                                <p className="text-sm text-gray-500">Matricule: {student.matricule || 'N/A'}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {student.filiere?.code || 'Sans filière'}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
