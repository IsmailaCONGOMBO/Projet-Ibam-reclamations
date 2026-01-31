<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReclamationController;
use App\Http\Controllers\Api\MatiereController;
use App\Http\Controllers\Api\FiliereController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\JustificatifController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Utilisateurs (DA seulement)
    Route::middleware('role:DA')->group(function () {
        Route::apiResource('users', UserController::class);
    });
    
    // Route spécifique pour la scolarité - accès aux étudiants
    Route::middleware('role:SCOLARITE|DA')->group(function () {
        Route::get('/etudiants', [UserController::class, 'getEtudiants']);
    });
    
    // Routes spécifiques pour l'enseignant
    Route::middleware('role:ENSEIGNANT')->group(function () {
        Route::get('/enseignant/{enseignant}/matieres', [UserController::class, 'getMatieres']);
        Route::get('/matiere/{matiere}/etudiants', [UserController::class, 'getEtudiantsByMatiere']);
    });
    
    // Filières
    Route::get('/filieres', [FiliereController::class, 'index']);
    Route::post('/filieres', [FiliereController::class, 'store'])->middleware('role:DA');
    Route::get('/filieres/{filiere}/matieres', [FiliereController::class, 'getMatieres']);
    Route::get('/filieres/{filiere}/enseignants', [FiliereController::class, 'getEnseignants']);
    
    // Matières
    Route::get('/matieres', [MatiereController::class, 'index']);
    Route::post('/matieres', [MatiereController::class, 'store'])->middleware('role:DA');
    Route::get('/matieres/{matiere}', [MatiereController::class, 'show']);
    
    // Réclamations
    Route::apiResource('reclamations', ReclamationController::class);
    Route::post('reclamations/{reclamation}', [ReclamationController::class, 'update']); // Support FormData
    Route::post('reclamations/{reclamation}/soumettre', [ReclamationController::class, 'soumettre']);
    Route::put('reclamations/{reclamation}/verifier', [ReclamationController::class, 'verifier']);
    Route::put('reclamations/{reclamation}/imputer', [ReclamationController::class, 'imputer']);
    Route::put('reclamations/{reclamation}/traiter', [ReclamationController::class, 'traiter']);
    Route::put('reclamations/{reclamation}/transmettre-scolarite', [ReclamationController::class, 'transmettreScolarite']);
    Route::put('reclamations/{reclamation}/finaliser', [ReclamationController::class, 'finaliser']);
    
    // Justificatifs
    Route::post('reclamations/{reclamation}/justificatifs', [JustificatifController::class, 'store']);
    Route::get('justificatifs/{justificatif}/download', [JustificatifController::class, 'download']);
    Route::delete('justificatifs/{justificatif}', [JustificatifController::class, 'destroy']);
});
