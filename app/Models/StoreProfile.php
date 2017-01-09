<?php

namespace App\Models;

use App\Models\Company;
use Illuminate\Database\Eloquent\Model;

class StoreProfile extends Model {

    protected $table      = "tblINV_StoreProfile";
    protected $primaryKey = "SP_StoreID";
    public $incrementing  = false;
    public $timestamps    = false;

    public function company() {
        return $this->belongsTo(Company::class, "SP_FK_CompanyID");
    }

}
