import { useState } from 'react';
import api from '../services/api';

const JustificatifViewer = ({ justificatifs, piece_jointe }) => {
  // If piece_jointe string path is provided, use it.
  // Assuming API_URL/storage/...
  // We need the BASE URL. Since we don't have it easily here, let's assume valid relative or absolute URL modification.
  // Actually, Laravel public storage links usually are served under /storage/ path.
  // We can construct the URL if we know the backend URL.
  // Let's rely on a helper or env.

  const BACKEND_URL = 'http://localhost:8000'; // Should come from env in real app

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}/storage/${path}`;
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
      const response = await fetch(url);
      const blob = await response.blob();
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
      // Fallback: open in new tab if blob fetch fails
      window.open(url, '_blank');
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
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700"
            >
              Voir
            </a>
            <button
              onClick={() => handleDownload(url, name)}
              className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
            >
              Télécharger
            </button>
          </div>
        </div>

        {isImage && (
          <div className="mt-2 text-center">
            <img src={url} alt="Aperçu" className="max-h-64 rounded shadow mx-auto" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2 mt-2">
      <h4 className="font-medium text-gray-900 text-sm">Pièce(s) jointe(s) :</h4>
      {piece_jointe && renderFileItem(piece_jointe.split('/').pop(), getFileUrl(piece_jointe))}

      {/* Legacy support for array */}
      {justificatifs && justificatifs.map(j => renderFileItem(j.nom_fichier, `${BACKEND_URL}/justificatifs/${j.id}/download`))}
    </div>
  );
};

export default JustificatifViewer;