<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MessageClasse;
use App\Models\DiscussionClasse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use App\Events\SendClasseMessageEvent;
use App\Models\Tuteur;
use App\Models\User;

class MessageClasseController extends Controller
{
    public function getClasseMessages($id)
    {
        try {
            $messages = MessageClasse::query()
                ->where('discussion_id', $id)
                ->get();

            $users = User::all();

            return response()->json(['messages' => $messages, 'users' => $users]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function sendMessage(Request $request)
    {
        try {

            if ($request->msgType == "text") {
                $message = new MessageClasse();
                $message->contenu = $request->contenu;
                if ($request->loggedType == 'Professeur') {
                    $message->professeur_id = $request->loggedIn;
                } elseif ($request->loggedType == 'Tuteur') {
                    $message->tuteur_id = $request->loggedIn;
                }
                $message->type = $request->msgType;
                $message->discussion_id = $request->idDiscussion;
                $message->save();

                broadcast(new SendClasseMessageEvent($request->loggedIn, $request->contenu, $request->idDiscussion, $request->msgType))->toOthers();

            }

            if ($request->input('msgType') == "audio") {
                // $audioFile = $request->file('audio');
                // $fileName = $audioFile->getClientOriginalName(); // Get the original file name
                // $audioFile->store('audio', 'public');

                $audioFile = $request->file('audio');
                // $extension = $audioFile->getClientOriginalExtension();
                $fileName = time().'.wav';
                // return response()->json(['message'=>$fileName]);
                $audioFile->move('records/',$fileName);

                $message = new MessageClasse();
                $message->contenu = $fileName;
                if ($request->loggedType == 'Professeur') {
                    $message->professeur_id = $request->input('loggedIn');
                } elseif ($request->loggedType == 'Tuteur') {
                    $message->tuteur_id = $request->input('loggedIn');
                }
                $message->type = $request->input('msgType');
                $message->discussion_id = $request->input('idDiscussion');
                $message->save();

                broadcast(new SendClasseMessageEvent($request->input('loggedIn'), $fileName , $request->input('idDiscussion'), $request->input('msgType')))->toOthers();

            }

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
