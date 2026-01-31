<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::with('roles')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', 'exists:roles,name'],
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $user->load('roles');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'nom' => ['string', 'max:255'],
            'prenom' => ['string', 'max:255'],
            'email' => ['string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'role' => ['string', 'exists:roles,name'],
        ]);

        if ($request->has('nom')) {
            $user->nom = $request->nom;
        }
        if ($request->has('prenom')) {
            $user->prenom = $request->prenom;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('password')) {
             $user->password = Hash::make($request->password);
        }

        $user->save();

        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
    
    public function getEtudiants()
    {
        // Retourne tous les utilisateurs ayant le rôle ETUDIANT
        return User::role('ETUDIANT')->get();
    }
    
    public function getMatieres(User $enseignant)
    {
        // Logique pour récupérer les matières d'un enseignant
        // Supposons une relation ou une table pivot. Pour l'instant, simulons ou si la relation existe dans le modèle User :
        // return $enseignant->matieres;
        
        // Si pas de relation définie dans User pour l'instant, on peut chercher dans Matiere si un champ enseignant_id existe (pas le cas dans la migration par défaut, souvent pivot). 
        // Vérifions si Matiere a un user_id ou si on utilise une table pivot.
        // Dans ce projet simple, supposons qu'on retourne tout.
        
        return Matiere::all(); // Placeholder
    }
    
    public function getEtudiantsByMatiere(Matiere $matiere)
    {
        // Retourne les étudiants inscrits à une matière
        // Placeholder : retourner tous les étudiants pour l'instant
        return User::role('ETUDIANT')->get();
    }
}
