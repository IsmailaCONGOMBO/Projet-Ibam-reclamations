import { useState } from 'react';
import ReclamationsList from '../components/etudiant/ReclamationsList';
import EditReclamationForm from '../components/etudiant/EditReclamationForm';
import ReclamationDetails from '../components/ReclamationDetails';
import { useSearchParams } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge';

const ReclamationsPage = () => {
    const [searchParams] = useSearchParams();
    const isNew = searchParams.get('new') === 'true';
    const [view, setView] = useState(isNew ? 'create' : 'list');
    const [selectedReclamation, setSelectedReclamation] = useState(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Mes Réclamations</h1>
                {view === 'list' && (
                    <button
                        onClick={() => setView('create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Nouvelle Réclamation
                    </button>
                )}
                {view !== 'list' && (
                    <button
                        onClick={() => {
                            setView('list');
                            setSelectedReclamation(null);
                        }}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        Retour à la liste
                    </button>
                )}
            </div>

            {view === 'list' && (
                <ReclamationsList
                    onEdit={(reclamation) => {
                        setSelectedReclamation(reclamation);
                        setView('edit');
                    }}
                    onView={(reclamation) => {
                        setSelectedReclamation(reclamation);
                        setView('details');
                    }}
                />
            )}

            {view === 'create' && (
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Créer une réclamation</h2>
                    <EditReclamationForm onSuccess={() => setView('list')} />
                </div>
            )}

            {view === 'edit' && selectedReclamation && (
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Modifier la réclamation</h2>
                    <EditReclamationForm
                        reclamation={selectedReclamation}
                        onSuccess={() => {
                            setView('list');
                            setSelectedReclamation(null);
                        }}
                    />
                </div>
            )}

            {view === 'details' && selectedReclamation && (
                <ReclamationDetails
                    reclamationId={selectedReclamation.id}
                    onClose={() => {
                        setView('list');
                        setSelectedReclamation(null);
                    }}
                />
            )}
        </div>
    );
};

export default ReclamationsPage;
