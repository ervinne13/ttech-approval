<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;

class ApprovableModuleModel extends Model {

    public $timestamps   = false;
    public $incrementing = false;

    public function updateStatus($status) {

        if (!$this->statusKey) {
            throw new Exception("statusKey not set in the model of this document. Due to this, the system is unable to set the document's status. Please contact your administrator.");
        }

        $this->{$this->statusKey} = $status;
        $this->save();
    }

    public function setViewed($positionId) {
      
        $currentTrack = DocumentTracking::ForApprovalBy($positionId)
                ->document($this->getKey())
                ->pending()
                ->orderBy('DT_EntryNo', 'ASC')
                ->first();

        if ($currentTrack) {
        
        $currentTrack->DT_Viewed = 1;
        $currentTrack->save();

        return $currentTrack;
        } else {
            throw new Exception("Document Track Not Found. Perhaps you are not the approver of this document anymore.");
        }
    }

    //  TODO move this relationship to another trait or model
    public function createdByUser() {
        return $this->belongsTo(User::class, "CreatedBy");
    }

}
