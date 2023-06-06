<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Classe;
use Illuminate\Http\Request;
use App\Models\DiscussionPrive;
use App\Models\DiscussionClasse;
use App\Models\DiscussionClasseMembre;

class UsersController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json(['users' => $users]);
    }

    public function getDiscussionsTuteur($id)
    {
        try {
            $discussionClasseMembre = DiscussionClasseMembre::query()
                ->where('tuteur_id', $id)
                ->get();

            $ClasseDiscussions = [];

            foreach ($discussionClasseMembre as $item) {
                $discussionClasse = DiscussionClasse::find($item->discussion_classe_id);

                $classe = Classe::find($discussionClasse->classe_id);

                $res = new \stdClass();
                $res->idDiscussionClasse = $discussionClasse->id;
                $res->classe = $classe;

                array_push($ClasseDiscussions, $res);
            }

            $discussionPrive = DiscussionPrive::query()
                ->where('tuteur_id', $id)
                ->get();

            $PrivateDiscussions = [];

            foreach ($discussionPrive as $item) {

                // $professeur = Professeur::find($item->professeur_id);
                $professeur = User::query()
                    ->where('user_type', 'Professeur')
                    ->where('id', $item->professeur_id)
                    ->first();

                $res = new \stdClass();
                $res->idDiscussionPrive = $item->id;
                $res->professeur = $professeur;

                array_push($PrivateDiscussions, $res);
            }

            // return response()->json(['idDiscussionClasse' => $idDiscussionClasse, 'classe' => $classe]);
            return response()->json(['discussionClasses' => $ClasseDiscussions, 'discussionsPrives' => $PrivateDiscussions]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function getDiscussions($userType, $id)
    {
        if ($userType == 'Tuteur') {
            try {

                $discussionClasseMembre = DiscussionClasseMembre::query()
                    ->where('tuteur_id', $id)
                    ->get();

                $ClasseDiscussions = [];

                foreach ($discussionClasseMembre as $item) {
                    $discussionClasse = DiscussionClasse::find($item->discussion_classe_id);

                    $classe = Classe::find($discussionClasse->classe_id);

                    $res = new \stdClass();
                    $res->idDiscussionClasse = $discussionClasse->id;
                    $res->classe = $classe;

                    $professeur = User::query()->where('id' , $classe->professeur_id)->first();
                    $res->professeur = $professeur ;

                    array_push($ClasseDiscussions, $res);
                }

                $discussionPrive = DiscussionPrive::query()
                    ->where('tuteur_id', $id)
                    ->get();

                $PrivateDiscussions = [];

                foreach ($discussionPrive as $item) {

                    $professeur = User::query()
                        ->where('user_type', 'Professeur')
                        ->where('id', $item->professeur_id)
                        ->first();

                    $res = new \stdClass();
                    $res->idDiscussionPrive = $item->id;
                    $res->professeur = $professeur;

                    array_push($PrivateDiscussions, $res);
                }
                return response()->json(['discussionClasses' => $ClasseDiscussions, 'discussionsPrives' => $PrivateDiscussions]);
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        }
        if ($userType == 'Professeur') {
            try {
                $discussionClasse = DiscussionClasse::query()
                    ->where('professeur_id',$id)
                    ->get();
                $ClasseDiscussions = [];

                foreach ($discussionClasse as $item) {

                    $classe = Classe::find($item->classe_id);

                    $res = new \stdClass();
                    $res->idDiscussionClasse = $item->id;
                    $res->classe = $classe;

                    $professeur = User::query()->where('id' , $classe->professeur_id)->first();
                    $res->professeur = $professeur ;

                    array_push($ClasseDiscussions, $res);
                }

                $discussionPrive = DiscussionPrive::query()
                    ->where('professeur_id', $id)
                    ->get();

                $PrivateDiscussions = [];

                foreach ($discussionPrive as $item) {

                    $tuteur = User::query()
                        ->where('user_type', 'Tuteur')
                        ->where('id', $item->tuteur_id)
                        ->first();

                    $res = new \stdClass();
                    $res->idDiscussionPrive = $item->id;
                    $res->tuteur = $tuteur;

                    array_push($PrivateDiscussions, $res);
                }

                return response()->json(['discussionClasses' => $ClasseDiscussions, 'discussionsPrives' => $PrivateDiscussions]);


            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        }
    }

    public function getDiscussionsProfesseur($id)
    {
        try {
            $discussionClasse = DiscussionClasse::query()
                ->where('professeur_id', $id)
                ->get();

            foreach ($discussionClasse as $item) {

                $classe = Classe::find($item->id);

                $professeur = User::query()
                ->where('id' , $id)
                ->first();

                $res = new \stdClass();
                $res->idDiscussionClasse = $discussionClasse->id;
                $res->classe = $classe;
                $res->professeur = $professeur ;

                array_push($ClasseDiscussions, $res);
            }

            $discussionPrive = DiscussionPrive::query()
                ->where('professeur_id', $id)
                ->get();

            $PrivateDiscussions = [];

            foreach ($discussionPrive as $item) {

                $tuteurs = User::query()
                    ->where('user_type', 'Tuteur')
                    ->where('id', $item->tuteur_id)
                    ->first();

                $res = new \stdClass();
                $res->idDiscussionPrive = $item->id;
                $res->professeur = $tuteurs;

                array_push($PrivateDiscussions, $res);
            }

            return response()->json(['discussionClasses' => $ClasseDiscussions, 'discussionsPrives' => $PrivateDiscussions]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
