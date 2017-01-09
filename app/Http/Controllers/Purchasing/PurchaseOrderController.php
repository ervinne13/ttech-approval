<?php

namespace App\Http\Controllers\Purchasing;

use App\Http\Controllers\Controller;
use App\Models\DocumentTracking;
use App\Models\Purchasing\PurchaseOrder;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class PurchaseOrderController extends Controller {

    //  TODO: check if this needs be changed to actual module id
    const MODULE_ID = "PO";

    /**
     * Display the specified resource.
     *
     * @param  int  $docNo
     * @return Response
     */
    public function show($docNo) {

        $currentUser = Auth::user();

        $PO = PurchaseOrder::find($docNo);
        $PO->setViewed($currentUser->U_FK_Position_id);

        $documentTrackList = DocumentTracking::Document($PO->getKey())
                ->with('approverPosition')
                ->with('approvedBy')
                ->with('currentDocumentTrack')
                ->get();

        $viewData = [
            "moduleId"          => static::MODULE_ID,
            "PO"                => $PO,
            "documentTrackList" => $documentTrackList
        ];

        return view('pages.purchasing.purchase-order.view', $viewData);
    }

}
