import AdminStudentsList from '../components/admin/AdminStudentsList';

export default function AdminStudentsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Administration des Étudiants</h1>
            <AdminStudentsList />
        </div>
    );
}
