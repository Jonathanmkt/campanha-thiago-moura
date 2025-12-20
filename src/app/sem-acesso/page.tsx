import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SemAcessoPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <ShieldAlert className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Acesso Pendente</CardTitle>
          <CardDescription className="text-base">
            Sua conta foi criada com sucesso, mas você ainda não possui permissão para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-blue-50 p-4 text-left">
            <h3 className="font-medium text-blue-900 mb-2">O que fazer agora?</h3>
            <p className="text-sm text-blue-800">
              Entre em contato com a coordenação da campanha para solicitar a liberação do seu acesso. 
              Informe seu nome e email cadastrado.
            </p>
          </div>

          <div className="pt-4 border-t">
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Voltar para o login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
