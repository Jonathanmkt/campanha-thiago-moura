import { redirect } from 'next/navigation';

export default function MobilePage() {
  // Esta página agora apenas redireciona para a rota correta
  // O middleware cuida do redirecionamento baseado na role
  redirect('/');
}
