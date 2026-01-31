export default function StatusBadge({ status }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'BROUILLON':
                return 'bg-gray-100 text-gray-800';
            case 'SOUMIS':
                return 'bg-blue-100 text-blue-800';
            case 'RECEVABLE':
                return 'bg-green-100 text-green-800';
            case 'REJETE':
                return 'bg-red-100 text-red-800';
            case 'EN_TRAITEMENT':
                return 'bg-orange-100 text-orange-800';
            case 'VALIDE_ENSEIGNANT':
                return 'bg-green-100 text-green-800';
            case 'INVALIDE_ENSEIGNANT':
                return 'bg-red-100 text-red-800';
            case 'TRANSMIS_SCOLARITE':
                return 'bg-purple-100 text-purple-800';
            case 'TRAITE':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'BROUILLON':
                return 'Brouillon';
            case 'SOUMIS':
                return 'Soumis';
            case 'RECEVABLE':
                return 'Recevable';
            case 'REJETE':
                return 'Rejeté';
            case 'EN_TRAITEMENT':
                return 'En traitement';
            case 'VALIDE_ENSEIGNANT':
                return 'Validée (Ens.)';
            case 'INVALIDE_ENSEIGNANT':
                return 'Invalidée (Ens.)';
            case 'TRANSMIS_SCOLARITE':
                return 'Transmis Scolarité';
            case 'TRAITE':
                return 'Traitée';
            default:
                return status;
        }
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
}
