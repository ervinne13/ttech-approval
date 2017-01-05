<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SGGenerateHash extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sggenerate:hash';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates a hash of a given string';

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
        $rawString = $this->ask('String to hash');
        $this->info(Hash::make($rawString));
    }

}
