<?php

namespace App\Http\Controllers;

use App\Models\DiscussionClasse;
use App\Models\DiscussionClasseMembre;
use Illuminate\Routing\Controller;

class DiscussionClasseMembreController extends Controller
{
    public function store($idClasse, $idTuteur)
    {
        $classeDiscussion = DiscussionClasse::where('classe_id', $idClasse)->first();

        $idDiscussionClasse = $classeDiscussion->id;

        $discussionClasseMembre = new DiscussionClasseMembre;
        $discussionClasseMembre->tuteur_id = $idTuteur;
        $discussionClasseMembre->discussion_classe_id = $idDiscussionClasse;
        $discussionClasseMembre->save();

        return response()->json(['message' => 'Classe Disccusion Membre est ajouté !']);
    }

    public function update($idClasse, $oldIdClasse, $idTuteur)
    {
        $oldClasseDiscussion = DiscussionClasse::where('classe_id', $oldIdClasse)->first();
        $oldIdDiscussionClasse = $oldClasseDiscussion->id;

        $classeDiscussion = DiscussionClasse::where('classe_id', $idClasse)->first();
        $idDiscussionClasse = $classeDiscussion->id;

        DiscussionClasseMembre::query()
            ->where('discussion_classe_id', $oldIdDiscussionClasse)
            ->where('tuteur_id', $idTuteur)
            ->update(['discussion_classe_id' => $idDiscussionClasse]);

        return response()->json(['message' => 'Classe Discussion Membre Modifié !']);
    }
}
