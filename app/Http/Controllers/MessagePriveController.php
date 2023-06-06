<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MessagePrive;
use Illuminate\Http\Request;
use App\Models\DiscussionPrive;
use Illuminate\Routing\Controller;
use App\Events\sendPrivateMessageEvent;

class MessagePriveController extends Controller
{
    public function tuteurSendMessage(Request $request)
    {
        $message = new MessagePrive();
        $message->tuteur_id = $request->tuteur;
        $message->contenu = $request->message;
        $message->disscusion_prive_id = $request->discussion;
        $message->save();
    }

    public function sendMessage(Request $request)
    {
        try{
        if ($request->msgType == "text") {
            $message = new MessagePrive();
            $message->contenu = $request->contenu;
            if ($request->loggedType == 'Professeur') {
                $message->professeur_id = $request->loggedIn;
            } elseif ($request->loggedType == 'Tuteur') {
                $message->tuteur_id = $request->loggedIn;
            }
            $message->type = $request->msgType;
            $message->discussion_prive_id = $request->idDiscussion;
            $message->save();

            broadcast(new sendPrivateMessageEvent($request->loggedIn, $request->contenu, $request->idDiscussion, $request->msgType))->toOthers();


        }

        if($request->input('msgType') == 'audio')
        {
            $audioFile = $request->file('audio');
                // $extension = $audioFile->getClientOriginalExtension();
                $fileName = time().'.wav';
                // return response()->json(['message'=>$fileName]);
                $audioFile->move('records/',$fileName);

                $message = new MessagePrive();
                $message->contenu = $fileName;
                if ($request->loggedType == 'Professeur') {
                    $message->professeur_id = $request->input('loggedIn');
                } elseif ($request->loggedType == 'Tuteur') {
                    $message->tuteur_id = $request->input('loggedIn');
                }
                $message->type = $request->input('msgType');
                $message->discussion_prive_id = $request->input('idDiscussion');
                $message->save();

                broadcast(new sendPrivateMessageEvent($request->input('loggedIn'), $fileName , $request->input('idDiscussion'), $request->input('msgType')))->toOthers();

        }
    } catch (\Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
    }

    }

    public function professeurSendMessage(Request $request)
    {
        $message = new MessagePrive();
        $message->professeur_id = $request->professeur;
        $message->contenu = $request->message;
        $message->disscusion_prive_id = $request->discussion;
        $message->save();
    }

    public function getPrivateMessages($id)
    {
        $messages = MessagePrive::query()
            ->where('discussion_prive_id', $id)
            ->get();

        $users = User::all();


        return response()->json(['messages' => $messages, 'users' => $users]);
    }
}
