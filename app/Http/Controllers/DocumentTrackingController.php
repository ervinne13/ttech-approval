<?php

namespace App\Http\Controllers;

use App\Models\DocumentTracking;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class DocumentTrackingController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {

        $currentUserPositionId = Auth::user()->U_FK_Position_id;

        $docTrackList = DocumentTracking::ForApproval($currentUserPositionId);

        return view('pages.tracking.index', ["docTrackList" => $docTrackList]);
    }

    public function datatable() {
        
    }

}
