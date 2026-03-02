import { useState, useEffect } from 'react';
import api from '../services/api';

const ImagePreview = ({ url, name }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await api.get(url, { responseType: 'blob' });
        const blobUrl = window.URL.createObjectURL(response.data);
        setImageUrl(blobUrl);
      } catch (error) {
        console.error('Erreur chargement image:', error);
      }
    };
    loadImage();
    return () => {
      if (imageUrl) window.URL.revokeObjectURL(imageUrl);
    };
  }, [url]);

  if (!imageUrl) return <div className="text-gray-400 text-xs">Chargement...</div>;
  
  return (
    <div className="mt-2 text-center">
      <img src={imageUrl} alt={name} className="max-h-64 rounded shadow mx-auto" />
    </div>
  );
};

const JustificatifViewer = ({ justificatifs, piece_jointe }) => {
  // If piece_jointe string path is provided, use it.
  // Assuming API_URL/storage/...
  // We need the BASE URL. Since we don't have it easily here, let's assume valid relative or absolute URL modification.
  // Actually, Laravel public storage links usually are served under /storage/ path.
  // We can construct the URL if we know the backend URL.
  // Let's rely on a helper or env.

  const getFileUrl = (path) => {
    if (!path) return null;
    const filename = path.split('/').pop();
    return `reclamations/justificatifs/${filename}`;
  };

  const hasFile = piece_jointe || (justificatifs && justificatifs.length > 0);

  if (!hasFile) {
    return (
      <div className="text-gray-500 text-sm italic">
        Aucun justificatif joint
      </div>
    );
  }

  const handleDownload = async (url, name) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob'
      });
      
      const blob = response.data;
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  const handleView = async (url, name) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob'
      });
      
      const blob = response.data;
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (error) {
      console.error('Erreur d\'affichage:', error);
      alert('Erreur lors de l\'affichage du fichier');
    }
  };

  const renderFileItem = (name, url) => {
    const ext = name.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

    return (
      <div key={url} className="border rounded p-3 bg-gray-50 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>{isImage ? '🖼️' : '📄'}</span>
            <span className="text-sm font-medium truncate max-w-xs">{name}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(url, name)}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700"
            >
              Voir
            </button>
            <button
              onClick={() => handleDownload(url, name)}
              className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
            >
              Télécharger
            </button>
          </div>
        </div>

        {isImage && (
          <ImagePreview url={url} name={name} />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2 mt-2">
      <h4 className="font-medium text-gray-900 text-sm">Pièce(s) jointe(s) :</h4>
      {piece_jointe && renderFileItem(piece_jointe.split('/').pop(), getFileUrl(piece_jointe))}

      {/* Legacy support for array */}
      {justificatifs && justificatifs.map(j => renderFileItem(j.nom_fichier, `justificatifs/${j.id}/download`))}
    </div>
  );
};

export default JustificatifViewer;