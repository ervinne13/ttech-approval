<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable {

    use Notifiable;

    protected $table      = "tblCOM_User";
    protected $primaryKey = 'U_User_id';
    public $incrementing  = false;
    public $timestamps    = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'U_User_id', 'U_APIPassword'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'U_APIPassword', 'U_APIToken', 'remember_token',
    ];

    public function getAuthPassword() {
        return $this->U_APIPassword;
    }

}
