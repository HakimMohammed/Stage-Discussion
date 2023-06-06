<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscussionClasseMembre extends Model
{
    use HasFactory;

    protected $fillable = [
        'discussion_classe_id',
        'tuteur_id',
    ];
    
    public function tuteur()
    {
        return $this->hasMany(User::class);
        // return $this->hasMany(Tuteur::class);
    }

    public function discussion()
    {
        return $this->belongsTo(DiscussionClasse::class);
    }
}
