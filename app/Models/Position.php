<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model {

    protected $table      = "tblCOM_Position";
    protected $primaryKey = "P_Position_id";
    public $incrementing  = false;
    public $timestamps    = false;

}
