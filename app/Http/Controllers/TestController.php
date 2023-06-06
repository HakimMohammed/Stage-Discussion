<?php

namespace App\Http\Controllers;

use App\Events\TestEvent;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function test(Request $request)
    {
        // $user = $request->user ;

        // return response()->json(['data'=>$request->message]) ;

        broadcast(new TestEvent($request->message));
    }

    public function send(Request $request)
    {
        try{
        $audio = $request->audioSrc ;
        $audio->store('audio', 'public');
        return response()->json(['message' => 'Audio succefuly stored']);
        }catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
