<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    public function index()
    {
        return response()->json(Filiere::with('matieres.enseignant')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'code_filiere' => 'required|string|unique:filieres',
            'nom_filiere' => 'required|string'
        ]);

        $filiere = Filiere::create($request->all());
        return response()->json($filiere, 201);
    }

    public function getMatieres(Filiere $filiere)
    {
        return response()->json($filiere->matieres()->with('enseignant')->get());
    }

    public function getEnseignants(Filiere $filiere)
    {
        return response()->json($filiere->enseignants()->get());
    }

    public function update(Request $request, Filiere $filiere)
    {
        $request->validate([
            'code_filiere' => 'required|string|unique:filieres,code_filiere,' . $filiere->id,
            'nom_filiere' => 'required|string'
        ]);

        $filiere->update($request->all());
        return response()->json($filiere);
    }

    public function destroy(Filiere $filiere)
    {
        $filiere->delete();
        return response()->json(['message' => 'Filière supprimée']);
    }
}