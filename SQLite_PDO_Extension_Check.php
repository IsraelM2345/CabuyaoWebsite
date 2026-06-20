<?php

echo "Loaded PHP extensions:\n";
$mods = get_loaded_extensions();
sort($mods);
foreach ($mods as $m) {
    echo $m, "\n";
}

echo "\n\nRelevant checks:\n";
$need = ['pdo_sqlite','sqlite3','sqlite'];
foreach ($need as $n) {
    echo $n, ': ', (extension_loaded($n) ? 'YES' : 'NO'), "\n";
}

