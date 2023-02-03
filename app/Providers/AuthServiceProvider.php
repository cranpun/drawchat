<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // for this system
        \Illuminate\Support\Facades\Gate::define(\App\L\Role::ID_ADMIN, function($user) {
            // now do not have role
            // return in_array($user->role, [\App\L\Role::ID_ADMIN]);
            return (\Illuminate\Support\Facades\Auth::user() != null);
        });

        \Illuminate\Auth\Notifications\VerifyEmail::toMailUsing(function ($notifiable, $url) {
            // return (new \Illuminate\Notifications\Messages\MailMessage)
            //     ->subject('本登録のご案内')
            //     ->line('Click the button below to verify your email address.')
            //     ->action('Verify Email Address', $url);

            return (new \Illuminate\Notifications\Messages\MailMessage)
                ->subject("本登録のご案内")
                ->view("emails.verifyemail", compact(["url"]));
        });
    }
}
