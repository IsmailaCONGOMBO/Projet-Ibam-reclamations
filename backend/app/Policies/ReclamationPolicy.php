<?php

namespace App\Policies;

use App\Models\Reclamation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReclamationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasRole(['ETUDIANT', 'SCOLARITE', 'ENSEIGNANT', 'DA']);
    }

    public function view(User $user, Reclamation $reclamation)
    {
        if ($user->hasRole(['DA', 'SCOLARITE'])) {
            return true;
        }

        if ($user->hasRole('ENSEIGNANT')) {
            // L'enseignant voit si on lui a imputé ou si c'est sa matière (simplifié)
            return $reclamation->enseignant_id === $user->id || $reclamation->matiere->enseignants()->where('users.id', $user->id)->exists();
        }

        return $reclamation->etudiant_id === $user->id;
    }

    public function create(User $user)
    {
        return $user->hasRole('ETUDIANT');
    }

    public function update(User $user, Reclamation $reclamation)
    {
        // Seul l'étudiant modifie le CONTENU, et seulement en brouillon
        return $user->hasRole('ETUDIANT') 
            && $reclamation->etudiant_id === $user->id 
            && $reclamation->status === 'BROUILLON';
    }

    public function delete(User $user, Reclamation $reclamation)
    {
        if ($user->hasRole('DA')) {
            return true;
        }

        return $user->hasRole('ETUDIANT') 
            && $reclamation->etudiant_id === $user->id 
            && $reclamation->status === 'BROUILLON';
    }

    // Actions Workflow

    public function soumettre(User $user, Reclamation $reclamation)
    {
        return $user->hasRole('ETUDIANT') 
            && $reclamation->etudiant_id === $user->id 
            && $reclamation->status === 'BROUILLON';
    }

    public function imputer(User $user, Reclamation $reclamation)
    {
        return $user->hasRole(['DA', 'SCOLARITE']);
    }

    public function traiter(User $user, Reclamation $reclamation)
    {
        // Enseignant assigné ou DA
        if ($user->hasRole('DA')) return true;

        return $user->hasRole('ENSEIGNANT') 
            && ($reclamation->enseignant_id === $user->id);
    }

    public function transmettreScolarite(User $user, Reclamation $reclamation)
    {
        return $this->traiter($user, $reclamation);
    }

    public function finaliser(User $user, Reclamation $reclamation)
    {
        return $user->hasRole(['DA', 'SCOLARITE']);
    }
}
