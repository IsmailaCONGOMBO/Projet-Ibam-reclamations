import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
    UserGroupIcon,
    AcademicCapIcon,
    DocumentTextIcon,
    ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
    const { user } = useAuth();

    const getRoleLabel = (role) => {
        switch (role) {
            case "DA":
                return "Directeur Académique";
            case "SCOLARITE":
                return "Scolarité";
            case "ENSEIGNANT":
                return "Enseignant";
            case "ETUDIANT":
                return "Étudiant";
            default:
                return "Rôle inconnu";
        }
    };

    const menuItems = {
        DA: [
            {
                title: "Gestion Utilisateurs",
                icon: UserGroupIcon,
                path: "/users",
                color: "bg-blue-500",
            },
            {
                title: "Gestion Filières",
                icon: AcademicCapIcon,
                path: "/filieres",
                color: "bg-green-500",
            },
            {
                title: "Toutes les Réclamations",
                icon: DocumentTextIcon,
                path: "/da",
                color: "bg-purple-500",
            },
        ],
        SCOLARITE: [
            {
                title: "Réclamations à Finaliser",
                icon: ClipboardDocumentCheckIcon,
                path: "/scolarite",
                color: "bg-orange-500",
            },
            {
                title: "Liste des Étudiants",
                icon: UserGroupIcon,
                path: "/students-list",
                color: "bg-teal-500",
            },
        ],
        ENSEIGNANT: [
            {
                title: "Réclamations à Traiter",
                icon: DocumentTextIcon,
                path: "/enseignant",
                color: "bg-indigo-500",
            },
            {
                title: "Mes Étudiants",
                icon: UserGroupIcon,
                path: "/teacher-students",
                color: "bg-cyan-500",
            },
        ],
        ETUDIANT: [
            {
                title: "Mes Réclamations",
                icon: DocumentTextIcon,
                path: "/reclamations",
                color: "bg-pink-500",
            },
            {
                title: "Nouvelle Réclamation",
                icon: ClipboardDocumentCheckIcon,
                path: "/reclamations?new=true",
                color: "bg-red-500",
            },
        ],
    };

    const userRoles = user?.roles?.map((r) => r.name) || [];
    // On prend le premier rôle pour simplifier l'affichage du menu, ou on agrège
    const currentRole = userRoles[0]; // Simplification

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-gray-800">IBAM Réclamations</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">
                                {user?.name || `${user.prenom} ${user.nom}`} ({getRoleLabel(currentRole)})
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">
                            Tableau de Bord
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="px-4 py-8 sm:px-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {menuItems[currentRole]?.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-full ${item.color} text-white`}>
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div className="ml-4">
                                                <h2 className="text-lg font-semibold text-gray-900">
                                                    {item.title}
                                                </h2>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
