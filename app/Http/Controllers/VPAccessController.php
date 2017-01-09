<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class VPAccessController extends Controller {

    public function instantAccess() {

        if (Auth::attempt(['U_User_id' => 'acatuira', 'password' => 'password'])) {
            // Authentication passed...
            return redirect()->intended('/');
        } else {
            return "Failed to do automatic authentication";
        }
    }

}
