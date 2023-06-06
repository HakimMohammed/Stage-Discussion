<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'professeur_id',
    ];

    public function professeur()
    {
        return $this->belongsTo(User::class);
        // return $this->belongsTo(Professeur::class);
    }

    public function eleves()
    {
        return $this->hasMany(Eleve::class);
    }

    public function discussions()
    {
        return $this->hasMany(DiscussionClasse::class);
    }
}
