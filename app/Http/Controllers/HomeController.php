<?php

namespace App\Http\Controllers;

use App\Models\DocumentTracking;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller {

    public function index() {
        if (Auth::check()) {
            $currentUserPositionId = Auth::user()->U_FK_Position_id;

            $docTrackList = DocumentTracking::ForApproval($currentUserPositionId);

//            return $docTrackList;
            
            return view('pages.tracking.index', ["docTrackList" => $docTrackList]);
        } else {
            return view('welcome');
        }
    }

}
