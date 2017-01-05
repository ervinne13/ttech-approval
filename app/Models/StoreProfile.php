<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreProfile extends Model {

    protected $table      = "tblINV_StoreProfile";
    protected $primaryKey = "SP_StoreID";
    public $incrementing  = false;
    public $timestamps    = false;

}
