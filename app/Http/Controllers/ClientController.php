<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Client;

class ClientController extends Controller
{
    /**
     * Retorna un Client
     */
    public function getClient(Request $request){
        $nif = $request->get('nif');
        $client = Client::where('nif', $nif)->get();
        return json_encode($client[0]);
    }
}
