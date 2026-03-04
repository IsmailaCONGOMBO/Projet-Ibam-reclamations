import { Link } from 'react-router-dom';
import { DocumentTextIcon, ClipboardDocumentCheckIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-indigo-600">IBAM</h1>
                        </div>
                        <Link
                            to="/login"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            Se connecter
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                        Plateforme de Réclamations de Notes
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Système de dématérialisation des demandes de réclamation de notes pour l'Institut Burkinabè des Arts et Métiers
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg"
                    >
                        Commencer →
                    </Link>
                </div>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Soumettre une réclamation</h3>
                        <p className="text-gray-600 text-sm">
                            Les étudiants peuvent soumettre leurs réclamations de notes en ligne avec justificatifs
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <ClipboardDocumentCheckIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Vérification scolarité</h3>
                        <p className="text-gray-600 text-sm">
                            La scolarité vérifie la recevabilité des demandes avant traitement
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <AcademicCapIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Traitement enseignant</h3>
                        <p className="text-gray-600 text-sm">
                            Les enseignants examinent et valident ou rejettent les réclamations
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                            <UserGroupIcon className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Suivi en temps réel</h3>
                        <p className="text-gray-600 text-sm">
                            Suivez l'état de vos réclamations à chaque étape du processus
                        </p>
                    </div>
                </div>

                {/* Workflow */}
                <div className="mt-20 bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Cycle de vie d'une réclamation</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
                            <h4 className="font-semibold text-gray-900 text-sm">BROUILLON</h4>
                            <p className="text-xs text-gray-600 mt-1">Réclamation en cours de rédaction</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
                            <h4 className="font-semibold text-gray-900 text-sm">SOUMIS</h4>
                            <p className="text-xs text-gray-600 mt-1">En attente de vérification scolarité</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
                            <h4 className="font-semibold text-gray-900 text-sm">RECEVABLE</h4>
                            <p className="text-xs text-gray-600 mt-1">Validée par la scolarité</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">4</div>
                            <h4 className="font-semibold text-gray-900 text-sm">EN_TRAITEMENT</h4>
                            <p className="text-xs text-gray-600 mt-1">Assignée à l'enseignant</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">5</div>
                            <h4 className="font-semibold text-gray-900 text-sm">VALIDE_ENSEIGNANT</h4>
                            <p className="text-xs text-gray-600 mt-1">Validée par l'enseignant</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">6</div>
                            <h4 className="font-semibold text-gray-900 text-sm">TRANSMIS_SCOLARITE</h4>
                            <p className="text-xs text-gray-600 mt-1">Retournée à la scolarité</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">7</div>
                            <h4 className="font-semibold text-gray-900 text-sm">TRAITE</h4>
                            <p className="text-xs text-gray-600 mt-1">Réclamation finalisée</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white mt-20 py-8 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
                    <p>© 2026 Institut Burkinabè des Arts et Métiers - Tous droits réservés</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
