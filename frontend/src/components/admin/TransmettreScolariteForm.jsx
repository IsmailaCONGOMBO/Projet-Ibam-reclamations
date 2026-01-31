import { useState } from 'react';
import { reclamationService } from '../../services/reclamationService';

export default function TransmettreScolariteForm({ reclamation, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const handleTransmettre = async () => {
        if (!window.confirm('Confirmer la transmission à la scolarité pour validation finale ?')) return;

        setLoading(true);
        try {
            await reclamationService.transmettreScolarite(reclamation.id, "Transmis par DA pour validation");
            onSuccess();
        } catch (error) {
            console.error('Erreur', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 bg-purple-50 rounded border border-purple-200">
            <h4 className="font-medium text-purple-900">Actions Administratives</h4>
            <p className="text-sm text-purple-700 mb-3">Cette réclamation est traitée. Vous pouvez la transmettre à la scolarité pour clôture.</p>
            <button
                onClick={handleTransmettre}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 disabled:opacity-50"
            >
                {loading ? 'Transmission...' : 'Transmettre à la Scolarité'}
            </button>
        </div>
    );
}
