<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReclamationRequest;
use App\Models\Reclamation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReclamationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Reclamation::with(['etudiant', 'matiere', 'enseignant', 'justificatifs']);

        // Filtrage par rôle
        switch ($user->role) {
            case 'ETUDIANT':
                $query->where('etudiant_id', $user->id);
                break;
            case 'ENSEIGNANT':
                $query->where('enseignant_id', $user->id);
                break;
            case 'SCOLARITE':
                // Voir toutes les réclamations (historique complet)
                break;
            case 'DA':
                // Voir toutes les réclamations
                break;
        }
        
        // Filtre par statut
        if ($request->has('statut') && $request->statut) {
            $query->where('statut', $request->statut);
        }
        
        // Filtre par filière
        if ($request->has('filiere_id') && $request->filiere_id) {
            $query->whereHas('etudiant', function($q) use ($request) {
                $q->where('filiere_id', $request->filiere_id);
            });
        }
        
        // Filtre par matière
        if ($request->has('matiere_id') && $request->matiere_id) {
            $query->where('matiere_id', $request->matiere_id);
        }
        
        // Recherche par numéro de demande, nom d'étudiant ou matière
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('numero_demande', 'LIKE', "%{$search}%")
                  ->orWhereHas('etudiant', function($subQ) use ($search) {
                      $subQ->where('nom', 'LIKE', "%{$search}%")
                           ->orWhere('prenom', 'LIKE', "%{$search}%")
                           ->orWhere('matricule', 'LIKE', "%{$search}%");
                  })
                  ->orWhereHas('matiere', function($subQ) use ($search) {
                      $subQ->where('nom_matiere', 'LIKE', "%{$search}%");
                  });
            });
        }

        return response()->json($query->latest()->get());
    }

    public function store(StoreReclamationRequest $request)
    {
        try {
            // Récupérer la matière pour obtenir la filière
            $matiere = \App\Models\Matiere::with('filiere')->find($request->matiere_id);
            
            if (!$matiere) {
                return response()->json(['message' => 'Matière non trouvée'], 422);
            }

            $reclamation = Reclamation::create([
                'numero_demande' => 'REC-' . date('Y') . '-' . str_pad(Reclamation::count() + 1, 4, '0', STR_PAD_LEFT),
                'etudiant_id' => $request->user()->id,
                'matiere_id' => $request->matiere_id,
                'enseignant_id' => $matiere->enseignant_id ?? null,
                'objet_demande' => $request->objet_demande,
                'motif' => $request->motif,
                'statut' => 'BROUILLON'
            ]);

            // Gérer l'upload du justificatif
            if ($request->hasFile('justificatif')) {
                $file = $request->file('justificatif');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('justificatifs', $fileName, 'public');
                
                \App\Models\Justificatif::create([
                    'reclamation_id' => $reclamation->id,
                    'nom_fichier' => $file->getClientOriginalName(),
                    'chemin_fichier' => $filePath,
                    'type_fichier' => $file->getMimeType(),
                    'taille' => $file->getSize()
                ]);
            }

            return response()->json($reclamation->load(['matiere', 'etudiant', 'justificatifs']), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Erreur validation réclamation: ' . json_encode($e->errors()));
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur création réclamation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la création de la réclamation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Reclamation $reclamation)
    {
        return response()->json($reclamation->load(['etudiant', 'matiere', 'enseignant', 'justificatifs', 'historique']));
    }

    public function update(Request $request, Reclamation $reclamation)
    {
        if ($reclamation->statut !== 'BROUILLON') {
            return response()->json(['message' => 'Impossible de modifier une réclamation soumise'], 403);
        }

        // Gérer _method pour FormData
        if ($request->has('_method') && $request->_method === 'PUT') {
            // C'est une requête FormData avec _method=PUT
        }

        // Validation simple
        if (!$request->matiere_id || !$request->objet_demande || !$request->motif) {
            return response()->json(['message' => 'Tous les champs obligatoires doivent être remplis'], 422);
        }

        // Mettre à jour l'enseignant_id basé sur la matière
        $matiere = \App\Models\Matiere::find($request->matiere_id);
        if (!$matiere) {
            return response()->json(['message' => 'Matière non trouvée'], 422);
        }
        
        $reclamation->update([
            'matiere_id' => $request->matiere_id,
            'enseignant_id' => $matiere->enseignant_id,
            'objet_demande' => $request->objet_demande,
            'motif' => $request->motif
        ]);

        // Gérer le nouveau justificatif si fourni
        if ($request->hasFile('justificatif')) {
            // Supprimer l'ancien justificatif
            $ancienJustificatif = $reclamation->justificatifs()->first();
            if ($ancienJustificatif) {
                \Storage::disk('public')->delete($ancienJustificatif->chemin_fichier);
                $ancienJustificatif->delete();
            }

            // Ajouter le nouveau
            $file = $request->file('justificatif');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('justificatifs', $fileName, 'public');
            
            \App\Models\Justificatif::create([
                'reclamation_id' => $reclamation->id,
                'nom_fichier' => $file->getClientOriginalName(),
                'chemin_fichier' => $filePath,
                'type_fichier' => $file->getMimeType(),
                'taille' => $file->getSize()
            ]);
        }

        return response()->json($reclamation->load(['matiere', 'etudiant', 'justificatifs']));
    }

    public function destroy(Reclamation $reclamation)
    {
        if ($reclamation->statut !== 'BROUILLON') {
            return response()->json(['message' => 'Impossible de supprimer une réclamation soumise'], 403);
        }

        $reclamation->delete();
        return response()->json(['message' => 'Réclamation supprimée']);
    }

    public function soumettre(Reclamation $reclamation)
    {
        if ($reclamation->statut !== 'BROUILLON') {
            return response()->json(['message' => 'Réclamation déjà soumise'], 400);
        }

        // Vérifier que tous les champs obligatoires sont remplis
        if (!$reclamation->matiere_id || !$reclamation->objet_demande || !$reclamation->motif) {
            return response()->json(['message' => 'Tous les champs obligatoires doivent être remplis'], 422);
        }

        // Vérifier qu'un justificatif est attaché (optionnel pour le brouillon)
        // if (!$reclamation->justificatifs()->exists()) {
        //     return response()->json(['message' => 'Un justificatif est obligatoire pour soumettre la réclamation'], 422);
        // }

        $reclamation->update([
            'statut' => 'SOUMISE',
            'date_soumission' => now()
        ]);

        return response()->json(['message' => 'Réclamation soumise avec succès']);
    }

    public function verifier(Request $request, Reclamation $reclamation)
    {
        $request->validate([
            'decision' => 'required|in:RECEVABLE,REJETEE',
            'commentaire' => 'nullable|string'
        ]);

        $reclamation->update([
            'statut' => $request->decision,
            'commentaire_scolarite' => $request->commentaire
        ]);

        return response()->json(['message' => 'Réclamation vérifiée']);
    }

    public function imputer(Request $request, Reclamation $reclamation)
    {
        $reclamation->update([
            'statut' => 'IMPUTEE_ENSEIGNANT',
            'enseignant_id' => $reclamation->matiere->enseignant_id
        ]);

        return response()->json(['message' => 'Réclamation imputée à l\'enseignant']);
    }

    public function traiter(Request $request, Reclamation $reclamation)
    {
        $request->validate([
            'decision' => 'required|in:VALIDEE,INVALIDEE',
            'note_corrigee' => 'required_if:decision,VALIDEE|numeric|min:0|max:20',
            'commentaire' => 'nullable|string'
        ]);

        $updateData = [
            'statut' => $request->decision === 'VALIDEE' ? 'VALIDEE_ENSEIGNANT' : 'INVALIDEE_ENSEIGNANT',
            'decision_enseignant' => $request->commentaire,
            'date_traitement' => now()
        ];

        // Ajouter la note corrigée seulement si la décision est VALIDEE
        if ($request->decision === 'VALIDEE') {
            $updateData['note_corrigee'] = $request->note_corrigee;
        }

        $reclamation->update($updateData);

        return response()->json(['message' => 'Réclamation traitée et transmise à l\'administration']);
    }

    public function transmettreScolarite(Reclamation $reclamation)
    {
        if (!in_array($reclamation->statut, ['VALIDEE_ENSEIGNANT', 'INVALIDEE_ENSEIGNANT'])) {
            return response()->json(['message' => 'Réclamation non traitée par l\'enseignant'], 400);
        }

        $reclamation->update([
            'statut' => $reclamation->statut === 'VALIDEE_ENSEIGNANT' ? 'TRANSMISE_SCOLARITE' : 'REJETEE'
        ]);

        $message = $reclamation->statut === 'REJETEE' 
            ? 'Réclamation rejetée définitivement' 
            : 'Réclamation transmise à la scolarité';

        return response()->json(['message' => $message]);
    }

    public function finaliser(Request $request, Reclamation $reclamation)
    {
        $request->validate([
            'note_finale' => 'required|numeric|min:0|max:20',
            'commentaire_final' => 'nullable|string'
        ]);

        $reclamation->update([
            'statut' => 'FINALISEE',
            'note_finale' => $request->note_finale,
            'commentaire_final' => $request->commentaire_final,
            'date_finalisation' => now()
        ]);

        return response()->json(['message' => 'Réclamation finalisée et étudiant notifié']);
    }
}
