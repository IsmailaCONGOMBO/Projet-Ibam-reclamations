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

    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->matricule)) {
                // Generates MAT-YYYY-XXXX (e.g. MAT-2026-0005)
                // Use max ID + 1. Note: This is not concurrency safe but standard for simple apps.
                $nextId = (User::max('id') ?? 0) + 1;
                $user->matricule = 'MAT-' . date('Y') . '-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
            }
        });
    }

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
