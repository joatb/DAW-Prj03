<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Article;

class ArticleController extends Controller
{
    /**
     * Retorna un Article
     */
    public function getArticle(Request $request){
        $articleId = $request->get('articleId');
        $article = Article::where('id', $articleId)->get();
        return json_encode($article[0]);
    }
}
