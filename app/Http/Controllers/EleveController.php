<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class EleveController extends Controller
{

    public function index()
    {
        $eleves = Eleve::all();
        return response()->json(['eleves' => $eleves]);
    }

    public function find($id)
    {
        $eleve = Eleve::find($id);
        return response()->json(['eleve' => $eleve]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
        ]);


        $eleve = new Eleve();
        $eleve->nom = $validatedData['nom'];
        $eleve->prenom = $validatedData['prenom'];
        $eleve->save();

        return response()->json(['message' => 'Eleve ajouté avec succés']);
    }

    public function assignTuteur($idEleve, $idTuteur)
    {
        try {
            $eleve = Eleve::find($idEleve);
            $idClasse = $eleve->classe_id;
            $eleve->tuteur_id = $idTuteur;
            $eleve->save();

            // Check if the eleve is assigned to a classe
            if ($idClasse !== 0) {
                // We add his tuteur to a the classe's chat
                $discussionMembre = new DiscussionClasseMembreController;
                $discussionMembre->store($idClasse, $idTuteur);

                // We get the classes's professeur
                $classe = Classe::find($idClasse);
                $idProfesseur = $classe->professeur_id;

                // Check if the classe has a professeur
                if ($idProfesseur !== 0) {

                    // We create a private discussion between the tuteur and the professeur
                    $discussionPrive = new DiscussionPriveController;
                    $discussionPrive->store($idProfesseur, $idTuteur);
                }
            }
            return response()->json(['message' => 'Tuteur assigné avec succés']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function assignClasse($idEleve, $idClasse)
    {
        try {

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
                $idProfesseur = $classe->professeur_id;

                // Check if the classe has a professeur
                if ($idProfesseur !== 0) {
                    // We create a private discussion between the tuteur and the professeur
                    $discussionPrive = new DiscussionPriveController;
                    $discussionPrive->store($idProfesseur, $idTuteur);
                }
            }

            return response()->json([
                'message' => "Classe assigné avec success !",
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
