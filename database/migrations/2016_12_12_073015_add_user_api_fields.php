<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class AddUserApiFields extends Migration {

    static $DEFAULT_PASSWORD = "password";

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('tblCOM_User', function ($table) {
            $table->string('U_APIToken', 120)->nullable();
            $table->string('U_APIPassword', 120)->nullable();
            $table->string('remember_token', 120)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('tblCOM_User', function ($table) {
            if (Schema::hasColumn('tblCOM_User', 'U_APIToken')) {
                $table->dropColumn('U_APIToken');
            }

            if (Schema::hasColumn('tblCOM_User', 'U_APIPassword')) {                
                $table->dropColumn('U_APIPassword');
            }

            if (Schema::hasColumn('tblCOM_User', 'remember_token')) {
                $table->dropColumn('remember_token');
            }
        });
    }

}
