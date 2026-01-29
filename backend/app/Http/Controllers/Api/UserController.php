<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'role' => 'required|in:ETUDIANT,ENSEIGNANT',
                'filiere_id' => 'required|exists:filieres,id',
                'telephone' => 'nullable|string',
                'niveau' => 'nullable|string',
                'matiere_ids' => 'nullable|array',
                'matiere_ids.*' => 'exists:matieres,id'
            ]);

            // Génération automatique des matricules
            if ($validated['role'] === 'ETUDIANT') {
                $ine = 'INE' . date('Y') . str_pad(User::where('role', 'ETUDIANT')->count() + 1, 6, '0', STR_PAD_LEFT);
                $matricule = $ine;
            } else {
                $matricule = 'ENS' . date('Y') . str_pad(User::where('role', 'ENSEIGNANT')->count() + 1, 6, '0', STR_PAD_LEFT);
                $ine = null;
            }

            $user = User::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'password' => Hash::make('password123'),
                'role' => $validated['role'],
                'matricule' => $matricule,
                'filiere_id' => $validated['filiere_id'],
                'telephone' => $validated['telephone'] ?? null,
                'ine' => $ine,
                'niveau' => $validated['niveau'] ?? null
            ]);

            // Si c'est un enseignant, attribuer les matières sélectionnées
            if ($validated['role'] === 'ENSEIGNANT' && isset($validated['matiere_ids'])) {
                Matiere::whereIn('id', $validated['matiere_ids'])
                    ->update(['enseignant_id' => $user->id]);
            }

            return response()->json($user->load('filiere'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur création utilisateur: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la création de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $query = User::with('filiere');
        
        // Filtre par rôle
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }
        
        // Filtre par filière
        if ($request->has('filiere_id') && $request->filiere_id) {
            $query->where('filiere_id', $request->filiere_id);
        }
        
        // Filtre par niveau
        if ($request->has('niveau') && $request->niveau) {
            $query->where('niveau', $request->niveau);
        }
        
        // Recherche par nom, prénom, email ou matricule
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'LIKE', "%{$search}%")
                  ->orWhere('prenom', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('matricule', 'LIKE', "%{$search}%")
                  ->orWhere('ine', 'LIKE', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    public function show(User $user)
    {
        return response()->json($user->load('filiere'));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'matricule' => 'sometimes|string|unique:users,matricule,' . $user->id,
            'filiere_id' => 'sometimes|exists:filieres,id',
            'telephone' => 'nullable|string',
            'ine' => 'sometimes|string|unique:users,ine,' . $user->id,
            'niveau' => 'sometimes|string'
        ]);

        $user->update($request->only([
            'nom', 'prenom', 'email', 'matricule', 'filiere_id', 
            'telephone', 'ine', 'niveau'
        ]));

        return response()->json($user->load('filiere'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    public function getEtudiants(Request $request)
    {
        $query = User::with('filiere')
            ->where('role', 'ETUDIANT');
        
        // Filtrer par filière si spécifié
        if ($request->has('filiere_id') && $request->filiere_id) {
            $query->where('filiere_id', $request->filiere_id);
        }
        
        // Filtrer par niveau si spécifié
        if ($request->has('niveau') && $request->niveau) {
            $query->where('niveau', $request->niveau);
        }
        
        // Recherche par nom, prénom, matricule ou INE
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'LIKE', "%{$search}%")
                  ->orWhere('prenom', 'LIKE', "%{$search}%")
                  ->orWhere('matricule', 'LIKE', "%{$search}%")
                  ->orWhere('ine', 'LIKE', "%{$search}%");
            });
        }
        
        return response()->json($query->get());
    }

    public function getMatieres(User $enseignant)
    {
        $matieres = Matiere::where('enseignant_id', $enseignant->id)
            ->with('filiere')
            ->get();
        
        return response()->json($matieres);
    }

    public function getEtudiantsByMatiere(Matiere $matiere)
    {
        // Vérifier que l'utilisateur connecté est l'enseignant de cette matière
        if (auth()->user()->id !== $matiere->enseignant_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        // Récupérer les étudiants de la filière de cette matière
        $etudiants = User::with('filiere')
            ->where('role', 'ETUDIANT')
            ->where('filiere_id', $matiere->filiere_id)
            ->get();
        
        return response()->json($etudiants);
    }
}