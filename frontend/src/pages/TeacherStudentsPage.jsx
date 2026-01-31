import TeacherStudentsList from '../components/enseignant/TeacherStudentsList';

export default function TeacherStudentsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Mes Étudiants</h1>
            <TeacherStudentsList />
        </div>
    );
}
