<?php

namespace App\Models\Purchasing;

use App\Models\ApprovableModuleModel;
use App\Models\PaymentTerms;

class PurchaseOrder extends ApprovableModuleModel {

    protected $table      = "tblCOM_PO";
    protected $primaryKey = "PO_DocNo";
    protected $statusKey  = "PO_Status";

    public function details() {
        return $this->hasMany(PurchaseOrderDetail::class, 'POD_PO_DocNo');
    }

    public function paymentTerm() {
        return $this->belongsTo(PaymentTerms::class, 'PO_Terms');
    }

}
