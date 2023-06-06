<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessagePrive extends Model
{
    use HasFactory;

    protected $fillable = [
        'contenu',
        'professeur_id',
        'tuteur_id',
        'discussion_prive_id',
        'type'
    ];

    public function tuteur()
    {
        return $this->belongsTo(User::class);
        // return $this->belongsTo(Tuteur::class);
    }

    public function professeur()
    {
        return $this->belongsTo(User::class);
        // return $this->belongsTo(Professeur::class);
    }

    public function discussion()
    {
        return $this->belongsTo(DiscussionPrive::class);
    }
}
