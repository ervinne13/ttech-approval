<?php

namespace Stargate;

use App\Models\ApprovableModuleModel;
use App\Models\DocumentTracking;
use App\Models\User;
use DateTime;
use Exception;
use Illuminate\Support\Facades\DB;

/**
 * Description of DocumentApprovalService
 *
 * @author ervinne
 */
class DocumentApprovalService {

    public function approve(User $approver, ApprovableModuleModel $modelObj) {
        $currentApprovalTrack = $this->getCurrentApprovalEntry($modelObj->getKey(), $approver->U_FK_Position_id);
        $this->validateEligibility($currentApprovalTrack);

        try {
            DB::beginTransaction();

            DocumentTracking::where("DT_EntryNo", $currentApprovalTrack->DT_EntryNo)
                    ->update([
                        "DT_Status"       => 'Approved',
                        "DT_ApprovedBy"   => $approver->U_User_id,
                        "DT_DateApproved" => new DateTime()
            ]);

            //  set document status to approved if there are no more approvals left
            if (!$this->hasMoreApprovers($currentApprovalTrack)) {
                $modelObj->updateStatus("Approved");
            }

            if ($currentApprovalTrack->DT_Unlimited == 1) {
                $this->skipLowerPendingApprovals($currentApprovalTrack, $approver);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $currentApprovalTrack;
    }

    public function reject(User $approver, ApprovableModuleModel $modelObj, $remarks) {
        $currentApprovalTrack = $this->getCurrentApprovalEntry($modelObj->getKey(), $approver->U_FK_Position_id);
        $this->validateEligibility($currentApprovalTrack);

        try {
            DB::beginTransaction();

            $currentApprovalTrack->DT_Status       = "Rejected";
            $currentApprovalTrack->DT_Remarks      = $remarks;
            $currentApprovalTrack->DT_ApprovedBy   = $approver->U_User_id;
            $currentApprovalTrack->DT_DateApproved = new DateTime();
            $currentApprovalTrack->save();

            $modelObj->updateStatus("Rejected");

            $this->skipOtherPendingApprovals($currentApprovalTrack, $approver);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $currentApprovalTrack;
    }

    //
    /*     * ******************************************************************* */
    // <editor-fold defaultstate="collapsed" desc="Validators">

    protected function validateEligibility(DocumentTracking $currentApprovalTrack) {
        if (!$currentApprovalTrack) {
            throw new Exception("Current approval entry for approver {$approver->U_Username} not found. You may not be the current approver of this document anymore. Perhaps someone else with unlimited approval access approved already, if not please contact your administrator.");
        }

        //  also check if the user is not yet the approver if this is not an unlimited approval
        if ($currentApprovalTrack->DT_Unlimited == 0 && $this->hasApprovedPreviousApprovals($currentApprovalTrack)) {
            throw new Exception("Unable to approve, there are still pending approvals that this document needs to go through.");
        }
    }

    // </editor-fold>

    /*     * ******************************************************************* */
    // <editor-fold defaultstate="collapsed" desc="Skipper Functions">

    protected function skipLowerPendingApprovals(DocumentTracking $currentDocumentTrack, User $approver) {
        DocumentTracking::where("DT_DocNo", $currentDocumentTrack->DT_DocNo)
                ->where("DT_EntryNo", "<", $currentDocumentTrack->DT_EntryNo)
                ->where("DT_Status", "Pending")
                ->where("DT_Required", "0") //  do not skip required approvers
                ->update([
                    "DT_Status"       => "Skipped",
                    "DT_ApprovedBy"   => $approver->U_User_id,
                    "DT_DateApproved" => new DateTime()
        ]);
    }

    protected function skipOtherPendingApprovals(DocumentTracking $currentDocumentTrack, User $approver) {
        DocumentTracking::where("DT_DocNo", $currentDocumentTrack->DT_DocNo)
                ->where("DT_Status", "Pending")
                ->update([
                    "DT_Status"       => "Skipped",
                    "DT_ApprovedBy"   => $approver->U_User_id,
                    "DT_DateApproved" => new DateTime()
        ]);
    }

    // </editor-fold>


    /*     * ******************************************************************* */
    // <editor-fold defaultstate="collapsed" desc="Utility Query Functions">

    protected function getCurrentApprovalEntry($documentNumber, $approverPosition) {

        $documentTrack = DocumentTracking::where("DT_DocNo", $documentNumber)
                ->where("DT_Approver", $approverPosition)
                ->where("DT_Status", "Pending")
                ->first()
        ;

        return $documentTrack;
    }

    // </editor-fold>

    /*     * ******************************************************************* */
    // <editor-fold defaultstate="collapsed" desc="Approval State Query Functions">

    protected function hasApprovedPreviousApprovals(DocumentTracking $currentDocumentTrack) {

        $pendingRequiredApprovalCount = DocumentTracking::where("DT_DocNo", $currentDocumentTrack->DT_DocNo)
                ->where("DT_EntryNo", "<", $currentDocumentTrack->DT_EntryNo)
                ->where("DT_Status", "Pending")
                ->count()
        ;

        return $pendingRequiredApprovalCount > 0;
    }

    protected function hasMoreApprovers(DocumentTracking $currentDocumentTrack) {
        $pendingRequiredApprovalCount = DocumentTracking::where("DT_DocNo", $currentDocumentTrack->DT_DocNo)
                ->where("DT_Status", "Pending")
                ->count()
        ;

        return $pendingRequiredApprovalCount > 0;
    }

    // </editor-fold>
}
