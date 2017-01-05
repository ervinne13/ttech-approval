<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DocumentTracking extends Model {

    protected $table      = "tblCOM_DocTracking";
    protected $primaryKey = "DT_DocNo";
    public $incrementing  = false;
    public $timestamps    = false;

    public static function ForApproval($positionId) {

        return DocumentTracking::ForApprovalBy($positionId)
                        ->pending()
                        ->with('sender')
                        ->with('currentDocumentTrack')
                        ->get();

        /*
          Sample Tester

          SELECT MainTrack.*,
          SenderPosition.P_Position AS DT_SenderPosition,
          LagTrack.DT_Approver AS DT_PreviousApprover,
          LagTrack.DT_Status AS DT_PreviousStatus
          FROM tblCOM_DocTracking AS MainTrack
          LEFT JOIN tblCOM_DocTracking LagTrack
          ON MainTrack.DT_EntryNo > LagTrack.DT_EntryNo
          AND MainTrack.DT_DocNo = LagTrack.DT_DocNo
          LEFT JOIN tblCOM_Position AS SenderPosition
          ON SenderPosition.P_Position_id = MainTrack.DT_Sender
          WHERE
          MainTrack.DT_Approver = '3009'
         */
    }

    //
    /*     * ******************************************************************* */
    // <editor-fold defaultstate="collapsed" desc="Scopes">

    public function scopeDocument($query, $documentNumber) {
        return $query->where("DT_DocNo", $documentNumber);
    }

    public function scopeForApprovalBy($query, $positionId) {
        return $query->where("DT_Approver", $positionId);
    }

    public function scopePending($query) {
        return $query->where("DT_Status", "Pending");
    }

    // </editor-fold>

    /*     * ******************************************************************* */
    // <editor-fold defaultstate="collapsed" desc="Relationships">

    public function location() {
        return $this->belongsTo(StoreProfile::class, 'DT_Location');
    }

    public function sender() {
        return $this->belongsTo(Position::class, 'DT_Sender');
    }

    public function approverPosition() {
        return $this->belongsTo(Position::class, 'DT_Approver');
    }

    public function approvedBy() {
        return $this->belongsTo(User::class, 'DT_ApprovedBy');
    }

    public function currentDocumentTrack() {
        return $this->belongsTo(DocumentTracking::class, 'DT_DocNo')
                        ->where("DT_Status", "Pending")
                        ->orderBy('DT_EntryNo', 'DESC');
    }

    // </editor-fold>
}
