<?php

namespace App\Models\Purchasing;

use Illuminate\Database\Eloquent\Model;

class PurchaseRequestDetail extends Model {

    protected $table      = "tblINV_PRDetail";
    protected $primaryKey = ["PRD_PR_DocNo", "PRD_LineNo"];
    public $timestamps    = false;
    public $incrementing  = false;

    // <editor-fold defaultstate="collapsed" desc="Relationships">

    public function UOMAttribute() {
        return $this->belongsTo(\App\Models\AttributeDetail::class, 'PRD_UOM');
    }

// </editor-fold>
}
