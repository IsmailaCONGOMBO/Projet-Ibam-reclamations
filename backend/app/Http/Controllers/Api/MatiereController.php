<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use Illuminate\Http\Request;

class MatiereController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Matiere::with(['filiere', 'enseignant']);

        // Filtrer par filière pour les étudiants
        if ($user->role === 'ETUDIANT' && $user->filiere_id) {
            $query->where('filiere_id', $user->filiere_id);
        }

        return response()->json($query->get());
    }

    public function show(Matiere $matiere)
    {
        return response()->json($matiere->load(['filiere', 'enseignant']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'code_matiere' => 'required|string|unique:matieres',
            'nom_matiere' => 'required|string',
            'credit' => 'required|integer|min:1',
            'filiere_id' => 'required|exists:filieres,id',
            'enseignant_id' => 'nullable|exists:users,id'
        ]);

        $matiere = Matiere::create($request->only(['code_matiere', 'nom_matiere', 'credit', 'filiere_id', 'enseignant_id']));
        return response()->json($matiere->load(['filiere', 'enseignant']), 201);
    }

    public function update(Request $request, Matiere $matiere)
    {
        $request->validate([
            'code_matiere' => 'required|string|unique:matieres,code_matiere,' . $matiere->id,
            'nom_matiere' => 'required|string',
            'credit' => 'required|integer|min:1',
            'filiere_id' => 'required|exists:filieres,id',
            'enseignant_id' => 'nullable|exists:users,id'
        ]);

        $matiere->update($request->only(['code_matiere', 'nom_matiere', 'credit', 'filiere_id', 'enseignant_id']));
        return response()->json($matiere->load(['filiere', 'enseignant']));
    }

    public function destroy(Matiere $matiere)
    {
        $matiere->delete();
        return response()->json(['message' => 'Matière supprimée']);
    }
}
