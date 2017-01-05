<?php

namespace App\Http\Controllers;

use App\Models\DocumentTracking;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TestController extends Controller {

    public function testConnectivity() {

        DB::enableQueryLog();

        $currentUserPositionId = Auth::user()->U_FK_Position_id;
        $docTrackList          = DocumentTracking::ForApproval($currentUserPositionId);

        dd(DB::getQueryLog());

        return $docTrackList;
    }

    public function testAuth() {

        $userId   = "abilaro";
//        $password = \Hash::make("password");
        $password = "password";

        if (Auth::attempt(['U_User_id' => $userId, 'password' => $password])) {
            return "OK";
        } else {
            return "not ok";
        }
    }

}
