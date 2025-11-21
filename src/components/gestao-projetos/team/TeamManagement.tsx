'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Users,
  UserPlus,
  Settings,
  MoreHorizontal,
  Clock,
  CheckCircle
} from 'lucide-react'

interface Colaborador {
  id: string
  funcao: string
  especializacao?: string
  ativo: boolean
  nivel_acesso_projetos: string
  pode_criar_projetos: boolean
  pode_gerenciar_tarefas: boolean
  created_at: string
  updated_at: string
}

interface TeamStats {
  totalColaboradores: number
  totalEquipes: number
  activeColaboradores: number
  averageWorkload: number
}

interface TeamManagementProps {
  colaboradores: Colaborador[]
  teamStats: TeamStats
  onCreateColaborador?: () => void
  onEditColaborador?: (colaborador: Colaborador) => void
}

export function TeamManagement({ colaboradores = [], teamStats, onCreateColaborador, onEditColaborador }: TeamManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredColaboradores = colaboradores.filter(colaborador =>
    colaborador.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (colaborador.especializacao && colaborador.especializacao.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getRoleColor = (funcao: string) => {
    switch (funcao) {
      case 'coordenador_geral': return 'bg-purple-100 text-purple-800'
      case 'coordenador_area': return 'bg-blue-100 text-blue-800'
      case 'assessor': return 'bg-green-100 text-green-800'
      case 'supervisor': return 'bg-yellow-100 text-yellow-800'
      case 'cabo_eleitoral': return 'bg-orange-100 text-orange-800'
      case 'voluntario': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccessLevelColor = (nivel: string) => {
    switch (nivel) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'avancado': return 'bg-blue-100 text-blue-800'
      case 'intermediario': return 'bg-yellow-100 text-yellow-800'
      case 'basico': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Equipe</h2>
          <p className="text-muted-foreground">
            Gerencie colaboradores e suas atribuições
          </p>
        </div>
        <Button onClick={onCreateColaborador}>
          <UserPlus className="mr-2 h-4 w-4" />
          Convidar Membro
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats?.totalColaboradores || 0}</div>
            <p className="text-xs text-muted-foreground">
              {teamStats?.activeColaboradores || 0} ativos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Atribuídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              30 concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carga Média</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52%</div>
            <p className="text-xs text-muted-foreground">
              Capacidade da equipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">71%</div>
            <p className="text-xs text-muted-foreground">
              Das tarefas atribuídas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome, email ou habilidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Team Members Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredColaboradores.length > 0 ? (
          filteredColaboradores.map((colaborador) => (
            <Card key={colaborador.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-sm font-medium">
                        {colaborador.funcao.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{colaborador.funcao.replace('_', ' ')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {colaborador.especializacao || 'Especialização não informada'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEditColaborador?.(colaborador)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getRoleColor(colaborador.funcao)}>
                    {colaborador.funcao.replace('_', ' ')}
                  </Badge>
                  <Badge className={getAccessLevelColor(colaborador.nivel_acesso_projetos)}>
                    {colaborador.nivel_acesso_projetos}
                  </Badge>
                  {colaborador.ativo && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Ativo
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pode criar projetos:</span>
                    <span>{colaborador.pode_criar_projetos ? 'Sim' : 'Não'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gerenciar tarefas:</span>
                    <span>{colaborador.pode_gerenciar_tarefas ? 'Sim' : 'Não'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membro desde:</span>
                    <span>{new Date(colaborador.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum colaborador encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando colaboradores à equipe.'}
            </p>
            <Button onClick={onCreateColaborador}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Colaborador
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
