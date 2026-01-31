<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.']
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'name' => $user->prenom . ' ' . $user->nom, // Compatibility
                'email' => $user->email,
                'roles' => $user->roles->map(fn($role) => ['name' => $role->name]),
                // 'role' => $user->roles->first()?->name, // Deprecated single role
                'matricule' => $user->matricule,
                'filiere_id' => $user->filiere_id
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'nom' => $user->nom,
            'prenom' => $user->prenom,
            'name' => $user->prenom . ' ' . $user->nom,
            'email' => $user->email,
            'roles' => $user->roles->map(fn($role) => ['name' => $role->name]),
            'matricule' => $user->matricule,
            'filiere_id' => $user->filiere_id
        ]);
    }
}
