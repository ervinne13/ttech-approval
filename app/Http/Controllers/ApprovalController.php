<?php

namespace App\Http\Controllers;

use App\Models\Purchasing\PurchaseOrder;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stargate\DocumentApprovalService;

class ApprovalController extends Controller {

    public function action(Request $request, $moduleId, $action) {

        try {
            $documentNumber = $request->documentNumber;
            $remarks        = $request->remarks;

            $service = new DocumentApprovalService();

            switch ($moduleId) {
                case "PO":
                    $modelObj = PurchaseOrder::find($documentNumber);
                    break;
                default:
                    throw new Exception("Unsupported module: {$moduleId}");
            }

            switch ($action) {
                case "approve":
                    return $service->approve(Auth::user(), $modelObj);
                case "reject":
                    return $service->reject(Auth::user(), $modelObj, $remarks);
                default:
                    throw new Exception("Unsupported action: {$action}");
            }
        } catch (Exception $e) {
//            throw $e;
            return response($e->getMessage(), 500);
        }
    }

}
