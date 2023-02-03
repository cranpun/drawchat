<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $passchangeme = '$2y$10$Sbjg0oCnsavSp71.IJvtEuiiFAc9S6vgBpX.3AwanJkzJk88rCG.C';

        $base = [
            'remember_token' => null,
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s"),

            'email_verified_at' => date("Y-m-d H:i:s"),
        ];

        \DB::table('users')->insert([
            [
                'name' => 'drawchat_bdd_admin',
                'display_name' => '開発者用管理者',
                'role' => \App\L\Role::ID_ADMIN,
                'email' => 'mizuno_k+drawchat_bdd_admin@cranpun.sub.jp',
                'password' => $passchangeme,
            ] + $base,
        ]);
    }
}
