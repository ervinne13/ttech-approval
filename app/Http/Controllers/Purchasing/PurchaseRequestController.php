<?php

namespace App\Http\Controllers\Purchasing;

use App\Http\Controllers\Controller;
use App\Models\DocumentTracking;
use App\Models\Purchasing\PurchaseRequest;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PurchaseRequestController extends Controller {

    //  TODO: check if this needs be changed to actual module id
    const MODULE_ID = "PR";

    /**
     * Display the specified resource.
     *
     * @param  int  $docNo
     * @return Response
     */
    public function show($docNo) {

        $currentUser = Auth::user();

        $PR = PurchaseRequest::with("details")->find($docNo);
        $PR->setViewed($currentUser->U_FK_Position_id);

        $documentTrackList = DocumentTracking::Document($PR->getKey())
                ->with('approverPosition')
                ->with('approvedBy')
                ->with('currentDocumentTrack')
                ->get();

        $PR->amount = 0;
        $details    = $PR->details;
        foreach ($details AS $detail) {
            $PR->PR_Amount += $detail->PRD_Amount;
        }

        $viewData = [
            "moduleId"          => static::MODULE_ID,
            "PR"                => $PR,
            "documentTrackList" => $documentTrackList
        ];

        return view('pages.purchasing.purchase-request.view', $viewData);
    }

}
