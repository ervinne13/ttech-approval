<?php

namespace App\Models\Purchasing;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderDetail extends Model {

    protected $table      = "tblCOM_PODetail";
    protected $primaryKey = "POD_LineNo";
    public $timestamps    = false;
    public $incrementing  = false;

    // <editor-fold defaultstate="collapsed" desc="Relationships">

    public function UOMAttribute() {
        return $this->belongsTo(\App\Models\AttributeDetail::class, 'POD_UOM');
    }

// </editor-fold>
}
