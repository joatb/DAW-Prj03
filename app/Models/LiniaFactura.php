<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiniaFactura extends Model
{
    use HasFactory;

    protected $table = 'liniesFactures';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'factura_id',
        'article_id',
        'unitats',
    ];

    public function factura(){
        return $this->belongsTo(Factura::class);
    }

    public function article(){
        return $this->belongsTo(Article::class);
    }

}
