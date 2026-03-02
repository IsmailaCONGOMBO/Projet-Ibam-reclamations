<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reclamation extends Model
{
    protected static function booted()
    {
        static::creating(function ($reclamation) {
            if (empty($reclamation->numero_demande)) {
                $nextId = (Reclamation::max('id') ?? 0) + 1;
                $reclamation->numero_demande = 'REC-' . date('Y') . '-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
            }
        });
    }
    protected $fillable = [
        'numero_demande',
        'etudiant_id',
        'matiere_id', 
        'enseignant_id',
        'objet',
        'message',
        'type',
        'piece_jointe',
        'status',
        'note_actuelle',
        'note_souhaitee',
        'note_corrigee',
        'commentaire_scolarite',
        'decision_enseignant',
        'date_soumission',
        'date_traitement'
    ];

    protected $casts = [
        'date_creation' => 'datetime',
        'date_soumission' => 'datetime', 
        'date_traitement' => 'datetime',
        'note_actuelle' => 'decimal:2',
        'note_souhaitee' => 'decimal:2',
        'note_corrigee' => 'decimal:2'
    ];

    const STATUTS = [
        'BROUILLON', 
        'SOUMIS', 
        'RECEVABLE', 
        'REJETE', 
        'EN_TRAITEMENT', 
        'VALIDE_ENSEIGNANT', 
        'INVALIDE_ENSEIGNANT', 
        'TRANSMIS_SCOLARITE',
        'TRAITE'
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'etudiant_id');
    }

    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
    }

    public function enseignant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }

    public function justificatifs(): HasMany
    {
        return $this->hasMany(Justificatif::class);
    }

    public function historique(): HasMany
    {
        return $this->hasMany(HistoriqueTraitement::class);
    }
}
