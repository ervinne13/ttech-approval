<?php

namespace App\Models\Purchasing;

use App\Models\ApprovableModuleModel;
use App\Models\StoreProfile;

class PurchaseRequest extends ApprovableModuleModel {

    protected $table      = "tblINV_PR";
    protected $primaryKey = "PR_DocNo";
    protected $statusKey  = "PR_Status";

    public function details() {
        return $this->hasMany(PurchaseRequestDetail::class, 'PRD_PR_DocNo');
    }

    public function location() {
        return $this->belongsTo(StoreProfile::class, "PR_Location");
    }

}
