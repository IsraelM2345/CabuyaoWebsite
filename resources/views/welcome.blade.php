{{--
  NOTE:
  This placeholder is intentionally simple.
  It exists so that requests that accidentally render the Laravel/Inertia "welcome" view do not crash.

  The app intermittently threw: "Undefined variable $page".
  To prevent that fatal error, we safely define $page with a null default.
--}}

@php
  $page = $page ?? null;
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>This placeholder view was added to prevent runtime errors when the application attempts to render <code>welcome</code>.</p>
</body>
</html>

