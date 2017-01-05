<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTerms extends Model {

    protected $table      = "tblACC_PaymentTerms";
    protected $primaryKey = "PT_id";
    public $incrementing  = false;
    public $timetamps     = false;

}
