import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Middleware irá redirecionar para a rota correta baseado na role
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return redirect(`https://${forwardedHost}${next}`)
      } else {
        return redirect(`${origin}${next}`)
      }
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
    }
  }

  // return the user to an error page with instructions
  redirect('/auth/error?error=Código%20de%20autorização%20não%20encontrado')
}
