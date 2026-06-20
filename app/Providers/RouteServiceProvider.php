<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Routing\Router;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define the routes for the application.
     */
    public function boot(): void
    {
        parent::boot();

        $router = $this->app->make(Router::class);

        $this->routes(function () use ($router) {
            require base_path('routes/web.php');
            require base_path('routes/api.php');
        });
    }
}


