<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SGEnableAccess extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sgaccess:enable';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Adds API password to a specified user to enable web access';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct() {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle() {
        $username = $this->ask('Username');
        $user     = User::find($username);

        if ($user) {
            $user->U_APIPassword = Hash::make("password");
            $user->save();

            $this->info("Added a new password to user {$username}. You may now login using this username. Please change your password in the Approval Utility Web Application.");
        } else {
            $this->error("User {$username} not found.");
        }
    }

}
