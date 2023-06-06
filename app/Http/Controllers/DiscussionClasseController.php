<?php

namespace App\Http\Controllers;

use App\Models\DiscussionClasse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class DiscussionClasseController extends Controller
{
    public function store($idClasse)
    {
        $discussion = new DiscussionClasse(
            [
                'classe_id' => $idClasse ,
            ]
        );

        $discussion->save();

        return response()->json(['message' => 'Classe Disccusion est crée !' ]);
    }

    public function update($idClasse , $idProfesseur)
    {
        DiscussionClasse::query()
            ->where('classe_id', $idClasse)
            ->update(['professeur_id' => $idProfesseur]);

        return response()->json(['message' => 'Professeur de Classe Disccusion changed !' ]);
    }
}
