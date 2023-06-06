<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Classe;
use Illuminate\Http\Request;
use App\Models\DiscussionPrive;
use App\Models\DiscussionClasse;
use Illuminate\Routing\Controller;
use App\Models\DiscussionClasseMembre;
use App\Http\Controllers\DiscussionClasseController;

class ClasseController extends Controller
{

    public function index()
    {
        $classes = Classe::all();
        return response()->json(['classes' => $classes]);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nom' => 'required|string|max:255',
            ]);

            // Create a new classe
            $classe = new Classe;
            $classe->nom = $validatedData['nom'];
            $classe->save();

            // Create that classe discussion
            $discussion = new DiscussionClasseController;
            $discussion->store($classe->id);

            return response()->json(['message' => 'Classe ajouté avec succés']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function find($id)
    {
        $classe = Classe::find($id);
        return response()->json(['classe' => $classe]);
    }

    public function assignProfesseur($idClasse, $idProfesseur)
    {
        try {

            // Get the classe
            $classe = Classe::find($idClasse);
            $classe->professeur_id = $idProfesseur;
            $classe->save();

            // Assign the teacher to that classe's discussion
            $discussion = new DiscussionClasseController;
            $discussion->update($idClasse, $idProfesseur);

            // Get that classe's discussion
            $discussionClasse = DiscussionClasse::query()
                ->where('classe_id',$idClasse)
                ->first();
            
            // Get all the Tuteurs that are in that classe's discussion
            $discussionMembres = DiscussionClasseMembre::query()
                ->where('discussion_classe_id',$discussionClasse->id)
                ->get();

            // For every tuteur we create a private chat between him and the professeur
            foreach( $discussionMembres as $discussionMembre )
            {
                $discussionPrive = new DiscussionPriveController;
                $discussionPrive->store($idProfesseur , $discussionMembre->tuteur_id);
            }

            return response()->json(['message' => 'Professeur assigné avec succés']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function assignEleve($idClasse, $idEleve)
    {
        // Get the Eleve
        $eleve = Eleve::find($idEleve);
        $oldClasseId = $eleve->classe_id;
        $eleve->classe_id = $idClasse;
        $eleve->save();
        $idTuteur = $eleve->tuteur_id;

        if ($idTuteur !== 0) {
            // Check if the eleve is new
            if ($oldClasseId == 0) {
                // We add his tuteur to a new chat
                $discussionMembre = new DiscussionClasseMembreController;
                $discussionMembre->store($idClasse, $idTuteur);
            } else {
                // We transfer the tuteur from the old chat to the new one
                $discussionMembre = new DiscussionClasseMembreController;
                $discussionMembre->update($idClasse, $oldClasseId, $idTuteur);
            }

            // We get the classes's professeur
            $classe = Classe::find($idClasse);
            $idProfesseur = $classe->professeur_id ;

            // Check if the classe has a professeur
            if ($idProfesseur !== 0) {
                // We create a private discussion between the tuteur and the professeur
                $discussionPrive = new DiscussionPriveController;
                $discussionPrive->store($idProfesseur, $idTuteur);
            }
        }


        return response()->json(['message' => 'Eleve assigné avec succés']);
    }
}
