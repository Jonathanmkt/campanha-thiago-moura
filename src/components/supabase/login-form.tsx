'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'

type FormError = {
  field: 'email' | 'password' | 'general';
  message: string;
};

function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
    'Email not confirmed': 'Seu email ainda não foi confirmado. Verifique sua caixa de entrada.',
    'Invalid email': 'O email informado não é válido.',
    'User not found': 'Não encontramos uma conta com esse email.',
    'Too many requests': 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.',
    'Network error': 'Erro de conexão. Verifique sua internet e tente novamente.',
  };
  
  return errorMessages[errorCode] || 'Ocorreu um erro ao fazer login. Tente novamente.';
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<FormError | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const supabase = createClient()

  const clearMessages = () => {
    setFormError(null)
    setSuccessMessage(null)
  }

  const validateForm = (): boolean => {
    clearMessages()
    
    if (!email.trim()) {
      setFormError({ field: 'email', message: 'Por favor, informe seu email.' })
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setFormError({ field: 'email', message: 'Por favor, informe um email válido.' })
      return false
    }
    
    if (!password) {
      setFormError({ field: 'password', message: 'Por favor, informe sua senha.' })
      return false
    }
    
    return true
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    clearMessages()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        setFormError({ 
          field: 'general', 
          message: getErrorMessage(error.message) 
        })
      } else {
        setSuccessMessage('Login realizado com sucesso! Redirecionando...')
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      }
    } catch {
      setFormError({ 
        field: 'general', 
        message: 'Erro de conexão. Verifique sua internet e tente novamente.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    clearMessages()

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth`,
        },
      })

      if (error) {
        setFormError({ 
          field: 'general', 
          message: 'Não foi possível conectar com o Google. Tente novamente.' 
        })
        setIsLoading(false)
      }
    } catch {
      setFormError({ 
        field: 'general', 
        message: 'Erro de conexão. Verifique sua internet e tente novamente.' 
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>
          Digite seu email abaixo para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Mensagem de sucesso */}
          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Mensagem de erro geral */}
          {formError?.field === 'general' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {formError.message}
              </AlertDescription>
            </Alert>
          )}

          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continuar com Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (formError?.field === 'email') clearMessages()
                }}
                className={formError?.field === 'email' ? 'border-red-500 focus-visible:ring-red-500' : ''}
                disabled={isLoading}
                aria-invalid={formError?.field === 'email'}
                aria-describedby={formError?.field === 'email' ? 'email-error' : undefined}
              />
              {formError?.field === 'email' && (
                <p id="email-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formError.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <a
                  href="/auth/recover"
                  className="ml-auto inline-block text-sm underline hover:text-primary"
                >
                  Esqueceu sua senha?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (formError?.field === 'password') clearMessages()
                  }}
                  className={formError?.field === 'password' ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                  disabled={isLoading}
                  aria-invalid={formError?.field === 'password'}
                  aria-describedby={formError?.field === 'password' ? 'password-error' : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {formError?.field === 'password' && (
                <p id="password-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formError.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <a href="/auth/signup" className="underline hover:text-primary">
              Cadastre-se
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
