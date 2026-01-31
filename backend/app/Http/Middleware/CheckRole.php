<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!$request->user()) {
             return response()->json(['message' => 'Non authentifié'], 401);
        }

        $roles = explode('|', $role);

        // Check 1: Spatie Roles (if used)
        if ($request->user()->hasAnyRole($roles)) {
            return $next($request);
        }

        // Check 2: Simple column 'role' (fallback)
        if (in_array($request->user()->role, $roles)) {
            return $next($request);
        }

        return response()->json(['message' => 'Accès non autorisé'], 403);
    }
}