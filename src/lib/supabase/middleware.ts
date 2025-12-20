import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type UserRole = 'coordenador' | 'lideranca' | 'colaborador' | null;

function getPrimaryRole(roles: string[] | null): UserRole {
  if (!roles || roles.length === 0) return null;
  
  if (roles.includes('coordenador')) return 'coordenador';
  if (roles.includes('lideranca')) return 'lideranca';
  if (roles.includes('colaborador')) return 'colaborador';
  
  return null;
}

function getRouteForRole(role: UserRole): string {
  switch (role) {
    case 'coordenador':
      return '/mobile/coordenador';
    case 'lideranca':
      return '/mobile/lideranca';
    case 'colaborador':
      return '/dashboard';
    default:
      return '/sem-acesso';
  }
}

function isAllowedRoute(pathname: string, role: UserRole): boolean {
  if (role === 'coordenador') {
    return pathname.startsWith('/mobile/coordenador');
  }
  if (role === 'lideranca') {
    return pathname.startsWith('/mobile/lideranca');
  }
  if (role === 'colaborador') {
    return pathname.startsWith('/dashboard');
  }
  return pathname === '/sem-acesso';
}

const PUBLIC_ROUTES = ['/auth', '/sem-acesso', '/_next', '/api', '/favicon.ico'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname;

  // Rotas públicas não precisam de verificação
  if (isPublicRoute(pathname)) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Usuário não autenticado: redireciona para login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Buscar roles do perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('roles')
    .eq('id', user.id)
    .single();

  const primaryRole = getPrimaryRole(profile?.roles ?? null);
  const allowedRoute = getRouteForRole(primaryRole);

  // Rota raiz: redireciona para a rota permitida
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = allowedRoute
    return NextResponse.redirect(url)
  }

  // Verifica se o usuário pode acessar a rota atual
  if (!isAllowedRoute(pathname, primaryRole)) {
    const url = request.nextUrl.clone()
    url.pathname = allowedRoute
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
