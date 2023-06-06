<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Eleve extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'classe_id',
        'tuteur_id',
    ];

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function tuteur()
    {
        // return $this->belongsTo(Tuteur::class);
        return $this->belongsTo(User::class);
    }
}
