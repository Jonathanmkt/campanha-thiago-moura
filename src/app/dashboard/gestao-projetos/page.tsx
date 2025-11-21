'use client'

import { useState } from 'react'
import { Plus, FolderKanban, Calendar, Users, BarChart3, Settings, MoreHorizontal, Edit, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { SimpleKanbanBoard } from '@/components/gestao-projetos/kanban/SimpleKanbanBoard'
import { SimpleGanttChart } from '@/components/gestao-projetos/gantt/SimpleGanttChart'
import { TeamManagement } from '@/components/gestao-projetos/team/TeamManagement'
import { ProjectAnalytics } from '@/components/gestao-projetos/analytics/ProjectAnalytics'
import { useProjects, useTasks, useAnalytics, useTeam, useWorkflows, type Task, type Colaborador, type Project } from './hooks'
import { CreateProjectModal } from './modals/CreateProjectModal'
import { EditProjectModal } from './modals/EditProjectModal'
import { CreateTaskModal } from './modals/CreateTaskModal'
import { EditTaskModal } from './modals/EditTaskModal'
import { CreateColaboradorModal } from './modals/CreateColaboradorModal'
import { EditColaboradorModal } from './modals/EditColaboradorModal'

export default function GestaoProjetosPage() {
  const [activeView, setActiveView] = useState('overview')
  
  // Modal states
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [createColaboradorOpen, setCreateColaboradorOpen] = useState(false)
  const [editColaboradorOpen, setEditColaboradorOpen] = useState(false)
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null)
  
  // Hooks para dados reais do Supabase
  const { 
    projects, 
    loading: projectsLoading, 
    error: projectsError,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats
  } = useProjects()
  
  const { 
    tasks,
    loading: tasksLoading
  } = useTasks()
  
  const {
    analytics,
    loading: analyticsLoading,
    getOverviewStats
  } = useAnalytics()
  
  const {
    colaboradores,
    getTeamStats,
    createColaborador,
    updateColaborador
  } = useTeam()
  
  const {
    taskStatuses
  } = useWorkflows()

  // Estatísticas calculadas
  const projectStats = getProjectStats()
  const overviewStats = getOverviewStats()
  const teamStats = getTeamStats()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PLANNING': return 'bg-blue-100 text-blue-800'
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo'
      case 'PLANNING': return 'Planejamento'
      case 'ON_HOLD': return 'Em Pausa'
      case 'COMPLETED': return 'Concluído'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Alta'
      case 'MEDIUM': return 'Média'
      case 'LOW': return 'Baixa'
      default: return priority
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Main Content */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        {/* Header com Tabs */}
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="kanban">Tarefas</TabsTrigger>
            <TabsTrigger value="gantt">Timeline</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <Button onClick={() => setCreateProjectOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {projectStats.active} ativos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tarefas Ativas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewStats.totalTasks}
                </div>
                <p className="text-xs text-muted-foreground">
                  {overviewStats.completedTasks} concluídas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamStats.activeColaboradores}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ativos em projetos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewStats.completionRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Das tarefas totais
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Projetos Ativos</h2>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projectsLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Carregando projetos...</p>
                </div>
              ) : projectsError ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-red-600">Erro ao carregar projetos: {projectsError}</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Nenhum projeto encontrado</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setCreateProjectOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Projeto
                  </Button>
                </div>
              ) : (
                projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: project.color }}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedProject(project)
                                setEditProjectOpen(true)
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={async () => {
                                  if (confirm('Tem certeza que deseja arquivar este projeto?')) {
                                    await deleteProject(project.id)
                                  }
                                }}
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Arquivar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(project.priority)}>
                          {getPriorityLabel(project.priority)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso das Tarefas</span>
                          <span>
                            {project.estatisticas?.completed_tasks || 0}/
                            {project.estatisticas?.total_tasks || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${project.estatisticas?.progress_percentage || 0}%` 
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.estatisticas?.team_size || 0} membros
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {project.estatisticas?.total_tasks || 0} tarefas
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Quadro Kanban</h2>
            <Button onClick={() => setCreateTaskOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
          <SimpleKanbanBoard 
            tasks={tasks}
            loading={tasksLoading}
            onTaskUpdate={updateProject}
            onTaskEdit={(task: Task) => {
              setSelectedTask(task)
              setEditTaskOpen(true)
            }}
          />
        </TabsContent>

        <TabsContent value="gantt" className="space-y-4">
          <SimpleGanttChart 
            tasks={tasks}
            projects={projects}
            loading={tasksLoading || projectsLoading}
          />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <TeamManagement 
            colaboradores={colaboradores}
            teamStats={teamStats}
            onCreateColaborador={() => setCreateColaboradorOpen(true)}
            onEditColaborador={(colaborador: Colaborador) => {
              setSelectedColaborador(colaborador)
              setEditColaboradorOpen(true)
            }}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ProjectAnalytics 
            analytics={analytics}
            loading={analyticsLoading}
          />
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      <CreateProjectModal
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onCreateProject={createProject}
      />
      
      <EditProjectModal
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        project={selectedProject}
        onUpdateProject={updateProject}
      />
      
      <CreateTaskModal
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        onCreateTask={async (taskData) => {
          // TODO: Implementar createTask no hook
          console.log('Criar tarefa:', taskData)
        }}
        projects={projects}
        taskStatuses={taskStatuses || []}
        colaboradores={colaboradores}
      />
      
      <EditTaskModal
        open={editTaskOpen}
        onOpenChange={setEditTaskOpen}
        task={selectedTask}
        onUpdateTask={async (taskId, taskData) => {
          // TODO: Implementar updateTask no hook
          console.log('Atualizar tarefa:', taskId, taskData)
        }}
        projects={projects}
        taskStatuses={taskStatuses || []}
        colaboradores={colaboradores}
      />
      
      <CreateColaboradorModal
        open={createColaboradorOpen}
        onOpenChange={setCreateColaboradorOpen}
        onCreateColaborador={createColaborador}
      />
      
      <EditColaboradorModal
        open={editColaboradorOpen}
        onOpenChange={setEditColaboradorOpen}
        colaborador={selectedColaborador}
        onUpdateColaborador={updateColaborador}
      />
    </div>
  )
}
