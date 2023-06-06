<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class sendClasseMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message ;
    public $user ;
    public $idDiscussion ;
    public $msgType ;

    /**
     * Create a new event instance.
     */
    public function __construct($user , $message , $idDiscussion , $msgType)
    {
        $this->user = User::find($user);
        $this->message = $message ;
        $this->idDiscussion = $idDiscussion ;
        $this->msgType = $msgType ;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new PrivateChannel('classe_discussion_'.$this->idDiscussion) ;
    }
}
