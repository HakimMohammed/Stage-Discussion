<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscussionPrive extends Model
{
    use HasFactory;

    protected $fillable = [
        'tuteur_id',
        'professeur_id',
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

    public function messages()
    {
        return $this->hasMany(MessagePrive::class);
    }
}
