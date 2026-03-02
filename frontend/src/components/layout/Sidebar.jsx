import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    HomeIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BookOpenIcon,
    DocumentTextIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getNavItems = () => {
        const role = user?.roles?.[0]?.name || user?.role;

        const common = [
            { name: 'Tableau de bord', path: '/dashboard', icon: HomeIcon },
        ];

        switch (role) {
            case 'DA':
                return [
                    ...common,
                    { name: 'Réclamations', path: '/da', icon: DocumentTextIcon },
                    { name: 'Utilisateurs', path: '/users', icon: UserGroupIcon },
                    { name: 'Filières', path: '/filieres', icon: AcademicCapIcon },
                    { name: 'Matières', path: '/matieres', icon: BookOpenIcon },
                ];
            case 'SCOLARITE':
                return [
                    ...common,
                    { name: 'Réclamations', path: '/scolarite', icon: DocumentTextIcon },
                    { name: 'Étudiants', path: '/students-list', icon: UserGroupIcon },
                ];
            case 'ENSEIGNANT':
                return [
                    ...common,
                    { name: 'Réclamations', path: '/enseignant', icon: DocumentTextIcon },
                ];
            case 'ETUDIANT':
                return [
                    ...common,
                    { name: 'Mes Réclamations', path: '/reclamations', icon: DocumentTextIcon },
                ];
            default:
                return common;
        }
    };

    const navItems = getNavItems();

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 bg-blue-600">
                        <h1 className="text-xl font-bold text-white">IBAM</h1>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">{user?.prenom} {user?.nom}</p>
                        <p className="text-xs text-gray-500">{user?.roles?.[0]?.name || user?.role}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
