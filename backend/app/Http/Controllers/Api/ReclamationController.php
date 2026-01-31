<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reclamation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ReclamationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('DA')) {
            return Reclamation::with(['etudiant', 'matiere', 'enseignant'])->latest()->get();
        }

        if ($user->hasRole('SCOLARITE')) {
            // Scolarité voit les réclamations validées par les enseignants ou finalisées
            return Reclamation::with(['etudiant', 'matiere', 'enseignant'])
                ->whereIn('status', ['TRAITE', 'VALIDE_SCOLARITE', 'FINALISE'])
                ->latest()
                ->get();
        }

        if ($user->hasRole('ENSEIGNANT')) {
            return Reclamation::with(['etudiant', 'matiere', 'enseignant'])
                ->where('enseignant_id', $user->id)
                ->where('status', '!=', 'BROUILLON')
                ->latest()
                ->get();
        }

        // Etudiant
        return Reclamation::with(['etudiant', 'matiere', 'enseignant'])
            ->where('etudiant_id', $user->id)
            ->latest()
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'objet' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|string',
            'matiere_id' => 'required|exists:matieres,id',
        ]);

        $reclamation = Reclamation::create([
            'objet' => $request->objet,
            'message' => $request->message,
            'type' => $request->type,
            'status' => 'BROUILLON', // Par défaut
            'etudiant_id' => Auth::id(),
            'matiere_id' => $request->matiere_id,
        ]);

        return response()->json($reclamation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reclamation $reclamation)
    {
        $this->authorize('view', $reclamation);
        return $reclamation->load(['etudiant', 'matiere', 'enseignant', 'justificatifs']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reclamation $reclamation)
    {
        $this->authorize('update', $reclamation);

        $reclamation->update($request->only(['objet', 'message', 'type', 'matiere_id']));

        return response()->json($reclamation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reclamation $reclamation)
    {
        $this->authorize('delete', $reclamation);
        $reclamation->delete();
        return response()->json(null, 204);
    }

    // --- Actions spécifiques du Workflow ---

    public function soumettre(Reclamation $reclamation)
    {
        $this->authorize('soumettre', $reclamation);
        
        $reclamation->update([
            'status' => 'SOUMIS',
            'date_soumission' => now(),
        ]);

        return response()->json($reclamation);
    }

    // Etape 2: Scolarité vérifie la recevabilité
    public function verifier(Request $request, Reclamation $reclamation)
    {
        $this->authorize('verifier', $reclamation); // Policy check: User is SCOLARITE

        $status = $request->recevable ? 'RECEVABLE' : 'REJETE';
        
        $reclamation->update([
            'status' => $status,
            // 'commentaire_scolarite' => $request->commentaire // Optional
        ]);

        return response()->json($reclamation);
    }

    // Etape 3: DA impute à l'enseignant
    public function imputer(Request $request, Reclamation $reclamation)
    {
        $this->authorize('imputer', $reclamation); // Policy check: User is DA
        
        $reclamation->update([
            'status' => 'EN_TRAITEMENT',
            'enseignant_id' => $request->enseignant_id,
        ]);

        return response()->json($reclamation);
    }

    // Etape 4: Enseignant traite (Valide ou Invalide)
    public function traiter(Request $request, Reclamation $reclamation)
    {
        $this->authorize('traiter', $reclamation); // Policy check: User is ENSEIGNANT

        $decision = $request->valide ? 'VALIDE_ENSEIGNANT' : 'INVALIDE_ENSEIGNANT';

        $reclamation->update([
            'status' => $decision,
            'commentaire_enseignant' => $request->commentaire,
            'date_traitement' => now(),
            'note_corrigee' => $request->valide ? $request->note_corrigee : null, // Si valide, on peut proposer la nouvelle note
        ]);

        return response()->json($reclamation);
    }
    
    // Etape 5: DA transmet la décision à la scolarité
    public function transmettreScolarite(Request $request, Reclamation $reclamation)
    {
         // Cette action est faite par le DA après retour de l'enseignant
         // $this->authorize('transmettre', $reclamation); // To be added to policy
         if (!$request->user()->hasRole('DA')) {
             abort(403, 'Seul le DA peut transmettre à la scolarité.');
         }

         $reclamation->update([
            'status' => 'TRANSMIS_SCOLARITE', 
         ]);
         return response()->json($reclamation);
    }

    // Etape 6: Scolarité finalise (Corrige la note ou clôture)
    public function finaliser(Request $request, Reclamation $reclamation)
    {
        $this->authorize('finaliser', $reclamation); // Policy check: User is SCOLARITE

        $reclamation->update([
            'status' => 'TRAITE',
            'commentaire_scolarite' => $request->commentaire,
            'date_validation' => now(),
        ]);

        return response()->json($reclamation);
    }
}
