<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscussionClasse extends Model
{
    use HasFactory;

    protected $fillable = [
        'classe_id',
        'professeur_id',
    ];

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function membres()
    {
        return $this->hasMany(DiscussionClasseMembre::class);
    }

    public function professeur()
    {
        return $this->belongsTo(User::class);
        // return $this->belongsTo(Professeur::class);
    }

    public function messages()
    {
        return $this->hasMany(MessageClasse::class);
    }
}
