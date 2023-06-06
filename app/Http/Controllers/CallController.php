<?php

namespace App\Http\Controllers;

use Vonage\Voice\NCCO\NCCO;


class CallController extends Controller
{
    public function call()
    {
        try{
            $keypair = new \Vonage\Client\Credentials\Keypair(
                file_get_contents(storage_path('app/private/private.key')),
                "46099153-a62b-4e63-be63-89903c5e8358"
            );
            $client = new \Vonage\Client($keypair);
    
            $outboundCall = new \Vonage\Voice\OutboundCall(
                new \Vonage\Voice\Endpoint\Phone("212649917065"),
                new \Vonage\Voice\Endpoint\Phone("212649917065")
            );
            $ncco = new NCCO();
            $ncco->addAction(new \Vonage\Voice\NCCO\Action\Talk("My name is what My name is who . Mohamed Hakim was here"));
            $outboundCall->setNCCO($ncco);
            
            $response = $client->voice()->createOutboundCall($outboundCall);
            
            var_dump($response);
    }catch (\Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
    }
        
    }
}
