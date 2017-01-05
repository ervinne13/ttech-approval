<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller {

    public function changePassword() {

        return view('pages.users.change-password');
    }

    public function updatePassword(Request $request) {

        $currentUser = Auth::user();
        $username    = $currentUser->U_Username;

        if (Auth::attempt(['U_Username' => $username, 'password' => $request->password])) {
            $currentUser->U_APIPassword = \Hash::make($request->newPassword);
            $currentUser->save();
        } else {
            return response("Incorrect password", 403);
        }
    }

}
