<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Http\Request;

class FacturaController extends Controller
{
    public function showFactures(){
        return view('factures');
    }

    public function showFactura(){
        return view('factura');
    }

    public function getFactura($id){
        $factura = Factura::find($id);

        $linies = $factura->linies;
        foreach($linies as $linia){
            $linies['article'] = $linia->article;
        }
        $factura['linies'] = $linies;
        $factura['client'] = $factura->client;

        return response($factura);
    }
    
    public function getFactures(){
        $factures = Factura::all();

        foreach($factures as $factura){
            $linies = $factura->linies;
            foreach($linies as $linia){
                $linia['article'] = $linia->article;
            }
            $factura['linies'] = $linies;
            $factura['client'] = $factura->client;
        }

        //return dd($factures);
        return response($factures);
    }

    public function deleteFactura(Request $request){
        $factura_id = $request->get('factura_id');
        //dd($bodyContent);
        if(Factura::find($factura_id)->exists()){
            Factura::find($factura_id) -> delete();
            
            return response('ok');
        }
        return response('no');
    }
}
