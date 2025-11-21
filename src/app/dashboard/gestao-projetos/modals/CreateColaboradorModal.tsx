'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { UserPlus, Loader2 } from 'lucide-react'

interface CreateColaboradorData {
  funcao: string
  especializacao?: string
  nivel_acesso_projetos: string
  pode_criar_projetos: boolean
  pode_gerenciar_tarefas: boolean
  ativo: boolean
}

interface CreateColaboradorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateColaborador: (colaboradorData: CreateColaboradorData) => Promise<void>
}

const funcaoOptions = [
  { value: 'coordenador_geral', label: 'Coordenador Geral' },
  { value: 'coordenador_area', label: 'Coordenador de Área' },
  { value: 'assessor', label: 'Assessor' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'cabo_eleitoral', label: 'Cabo Eleitoral' },
  { value: 'voluntario', label: 'Voluntário' }
]

const nivelAcessoOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'avancado', label: 'Avançado' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'basico', label: 'Básico' }
]

const especializacaoOptions = [
  'Marketing Digital',
  'Comunicação',
  'Eventos',
  'Logística',
  'Jurídico',
  'Financeiro',
  'Recursos Humanos',
  'Tecnologia',
  'Design',
  'Fotografia',
  'Vídeo',
  'Redes Sociais',
  'Pesquisa',
  'Análise de Dados',
  'Mobilização',
  'Articulação Política',
  'Relações Públicas'
]

export function CreateColaboradorModal({ open, onOpenChange, onCreateColaborador }: CreateColaboradorModalProps) {
  const [formData, setFormData] = useState<CreateColaboradorData>({
    funcao: '',
    especializacao: '',
    nivel_acesso_projetos: 'basico',
    pode_criar_projetos: false,
    pode_gerenciar_tarefas: false,
    ativo: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.funcao) {
      alert('Por favor, selecione uma função.')
      return
    }

    setIsSubmitting(true)
    try {
      await onCreateColaborador(formData)
      // Reset form
      setFormData({
        funcao: '',
        especializacao: '',
        nivel_acesso_projetos: 'basico',
        pode_criar_projetos: false,
        pode_gerenciar_tarefas: false,
        ativo: true
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar colaborador:', error)
      alert('Erro ao criar colaborador. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CreateColaboradorData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Novo Colaborador
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Função *</Label>
              <Select value={formData.funcao} onValueChange={(value) => handleInputChange('funcao', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {funcaoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Especialização</Label>
              <Select value={formData.especializacao} onValueChange={(value) => handleInputChange('especializacao', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma especialização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {especializacaoOptions.map((especializacao) => (
                    <SelectItem key={especializacao} value={especializacao}>
                      {especializacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nível de Acesso aos Projetos</Label>
            <Select 
              value={formData.nivel_acesso_projetos} 
              onValueChange={(value) => handleInputChange('nivel_acesso_projetos', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nivelAcessoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissões</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pode Criar Projetos</Label>
                <p className="text-sm text-muted-foreground">
                  Permite ao colaborador criar novos projetos
                </p>
              </div>
              <Switch
                checked={formData.pode_criar_projetos}
                onCheckedChange={(checked) => handleInputChange('pode_criar_projetos', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pode Gerenciar Tarefas</Label>
                <p className="text-sm text-muted-foreground">
                  Permite ao colaborador criar, editar e atribuir tarefas
                </p>
              </div>
              <Switch
                checked={formData.pode_gerenciar_tarefas}
                onCheckedChange={(checked) => handleInputChange('pode_gerenciar_tarefas', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Colaborador Ativo</Label>
                <p className="text-sm text-muted-foreground">
                  Define se o colaborador está ativo no sistema
                </p>
              </div>
              <Switch
                checked={formData.ativo}
                onCheckedChange={(checked) => handleInputChange('ativo', checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Adicionar Colaborador'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
