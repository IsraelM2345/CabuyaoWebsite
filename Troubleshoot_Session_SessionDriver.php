<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';

$config = $app->make('config');
$sessionDriver = $config->get('session.driver');
$dbDefault = $config->get('database.default');


echo 'SESSION_DRIVER=' . $sessionDriver . PHP_EOL;
echo 'DB_CONNECTION=' . $dbDefault . PHP_EOL;


