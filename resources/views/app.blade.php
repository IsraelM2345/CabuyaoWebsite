<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cabuyao Web Portal</title>


    {{-- Needed for fetch CSRF headers --}}
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    {{-- Favicon / tab icon --}}
    <link rel="icon" type="image/jpeg" href="/images/city-cab.png" sizes="16x16" />
    <link rel="icon" type="image/jpeg" href="/images/city-cab.png" sizes="32x32" />
    <link rel="apple-touch-icon" href="/images/city-cab.png" />

    @viteReactRefresh

    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
  </head>
  <body>
    @inertia
  </body>
</html>
