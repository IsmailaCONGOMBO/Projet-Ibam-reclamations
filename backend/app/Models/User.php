<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
        'matricule',
        'filiere_id',
        'telephone',
        'ine',
        'niveau'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    public function reclamations(): HasMany
    {
        return $this->hasMany(Reclamation::class, 'etudiant_id');
    }

    public function reclamationsTraitees(): HasMany
    {
        return $this->hasMany(Reclamation::class, 'enseignant_id');
    }
}
