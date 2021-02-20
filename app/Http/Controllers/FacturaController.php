<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Factura;

use App\Models\Client;

use App\Models\Article;

use App\Models\LiniaFactura;

class FacturaController extends Controller
{
    /**
     * Vistes
     */
    public function showFactures()
    {
        return view('factures');
    }

    public function showFactura()
    {
        return view('factura');
    }

    /**
     * Retorna una factura
     */
    public function getFactura(Request $request)
    {
        $facturaId = $request->get('facturaId');
        $factura = Factura::findOrFail($facturaId);

        $linies = $factura->linies;
        foreach ($linies as $linia) {
            $linia['article'] = $linia->article;
        }
        $factura['linies'] = $linies;
        $factura['client'] = $factura->client;

        return response($factura);
    }

    /**
     * Retorna totes les factures
     */
    public function getFactures()
    {
        $factures = Factura::all();

        foreach ($factures as $factura) { // Per cada factura
            $linies = $factura->linies;
            foreach ($linies as $linia) { // Per cada línia
                $linia['article'] = $linia->article; // Afageix l'article corresponent
            }
            $factura['linies'] = $factura->linies; // Afageix les línies corresponent a la factura
            $factura['client'] = $factura->client; // Afageix el client corresponent a la factura
        }

        // Retorna les factures
        return response($factures);
    }

    /**
     * Actualitza o afageix una factura
     */
    public function upsertFactura(Request $request)
    {
        // Validació factura
        $request->validate([
            'id' => 'required|integer',
            'data' => 'required|date',
            'descompte' => 'required|integer',
            'iva' => 'required|integer',
            'pagada' => 'required|boolean',

            'client.*' => 'required',
            'client.nif' => 'size:9',

            'linies' => 'required|array',
            'linies.*.unitats' => 'required|integer',
            'linies.*.article.article' => 'required|string',
            'linies.*.article.id' => 'required|integer',
            'linies.*.article.preu' => 'required|numeric',

        ]);

        $facturaRequest = $request->all();
        $clientRequest = $facturaRequest['client'];
        $liniesRequest = $facturaRequest['linies'];

        // Upsert client
        $client = Client::updateOrCreate(
            [
                'nif' => $clientRequest['nif'],
            ],
            [
                'nif' => $clientRequest['nif'],
                'nom' => $clientRequest['nom'],
                'adreca' => $clientRequest['adreca'],
                'poblacio' => $clientRequest['poblacio'],
            ]
        );

        // Upsert factura
        $factura = Factura::updateOrCreate(
            [
                'id' => $facturaRequest['id'],
            ],
            [
                'id' => $facturaRequest['id'],
                'data' => $facturaRequest['data'],
                'pagada' => $facturaRequest['pagada'],
                'descompte' => $facturaRequest['descompte'],
                'iva' => $facturaRequest['iva'],
                'client_id' => $client->id
            ]
        );

        /**
         * Per cada línia
         */
        foreach ($liniesRequest as $linia) {
            $article = Article::updateOrCreate( // actualitza o crea un article
                [
                    'id' => $linia['article']['id'],
                ],
                [
                    'id' => $linia['article']['id'],
                    'article' => $linia['article']['article'],
                    'preu' => $linia['article']['preu'],
                ]
            );

            // Upsert línia
            LiniaFactura::updateOrCreate(
                [
                    'article_id' => $article->id,
                    'factura_id' => $factura->id
                ],
                [
                    'article_id' => $linia['article']['id'],
                    'factura_id' => $factura->id,
                    'unitats' => $linia['unitats'],
                ]
            );
        }

        // Retorna la factura
        return json_encode($factura);
    }

    /**
     * Elimina una factura
     */
    public function deleteFactura(Request $request)
    {
        $facturaId = $request->get('facturaId');
        $factura = Factura::findOrFail($facturaId);
        $factura->delete();
        return json_encode('Factura eliminada correctament');
    }
}
