<?php

namespace App\Http\Controllers;

use App\Models\DiscussionPrive;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class DiscussionPriveController extends Controller
{
    public function store($idProfesseur , $idTuteur)
    {
        try{
            $discussion = new DiscussionPrive;
            $discussion->professeur_id = $idProfesseur ;
            $discussion->tuteur_id = $idTuteur ;
            $discussion->save();
    
            return response()->json(['message' => 'Discussion Privé Crée avec succés']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

}
