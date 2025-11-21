# Script de teste para endpoints da Gestão de Projetos
# Execute: .\test-endpoints.ps1

$baseUrl = "http://localhost:3001/api"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "🚀 Iniciando testes dos endpoints da Gestão de Projetos..." -ForegroundColor Green
Write-Host ""

# Função para fazer requisições HTTP
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params
        return @{
            Success = $true
            Data = $response
            StatusCode = 200
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
            StatusCode = $_.Exception.Response.StatusCode.value__
        }
    }
}

# Função para exibir resultado do teste
function Show-TestResult {
    param(
        [string]$TestName,
        [hashtable]$Result
    )
    
    if ($Result.Success) {
        Write-Host "✅ $TestName" -ForegroundColor Green
        if ($Result.Data) {
            Write-Host "   Dados: $($Result.Data | ConvertTo-Json -Depth 2 -Compress)" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ $TestName" -ForegroundColor Red
        Write-Host "   Erro: $($Result.Error)" -ForegroundColor Red
        Write-Host "   Status: $($Result.StatusCode)" -ForegroundColor Red
    }
    Write-Host ""
}

# 1. TESTE DE PROJETOS
Write-Host "📋 TESTANDO ENDPOINTS DE PROJETOS" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# GET /api/projects
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/projects" -Headers $headers
Show-TestResult -TestName "GET /api/projects - Listar projetos" -Result $result

# POST /api/projects
$projectData = @{
    name = "Projeto Teste $(Get-Date -Format 'yyyyMMdd-HHmmss')"
    slug = "projeto-teste-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    description = "Projeto criado via teste automatizado"
    status = "ACTIVE"
    priority = "MEDIUM"
    visibility = "PRIVATE"
} | ConvertTo-Json

$result = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/projects" -Headers $headers -Body $projectData
Show-TestResult -TestName "POST /api/projects - Criar projeto" -Result $result
$createdProjectId = if ($result.Success) { $result.Data.id } else { $null }

# GET /api/projects/[id] (se projeto foi criado)
if ($createdProjectId) {
    $result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/projects/$createdProjectId" -Headers $headers
    Show-TestResult -TestName "GET /api/projects/[id] - Buscar projeto por ID" -Result $result
}

# 2. TESTE DE TAREFAS
Write-Host "📝 TESTANDO ENDPOINTS DE TAREFAS" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow

# GET /api/tasks
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/tasks" -Headers $headers
Show-TestResult -TestName "GET /api/tasks - Listar tarefas" -Result $result

# POST /api/tasks (se temos um projeto)
if ($createdProjectId) {
    $taskData = @{
        title = "Tarefa Teste $(Get-Date -Format 'yyyyMMdd-HHmmss')"
        slug = "tarefa-teste-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        description = "Tarefa criada via teste automatizado"
        project_id = $createdProjectId
        priority = "HIGH"
        type = "TASK"
    } | ConvertTo-Json

    $result = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/tasks" -Headers $headers -Body $taskData
    Show-TestResult -TestName "POST /api/tasks - Criar tarefa" -Result $result
    $createdTaskId = if ($result.Success) { $result.Data.id } else { $null }
}

# 3. TESTE DE MEMBROS DO PROJETO
Write-Host "👥 TESTANDO ENDPOINTS DE MEMBROS" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow

# GET /api/project-members
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/project-members" -Headers $headers
Show-TestResult -TestName "GET /api/project-members - Listar membros" -Result $result

# 4. TESTE DE SPRINTS
Write-Host "🏃 TESTANDO ENDPOINTS DE SPRINTS" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow

# GET /api/sprints
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/sprints" -Headers $headers
Show-TestResult -TestName "GET /api/sprints - Listar sprints" -Result $result

# POST /api/sprints (se temos um projeto)
if ($createdProjectId) {
    $sprintData = @{
        name = "Sprint Teste $(Get-Date -Format 'yyyyMMdd-HHmmss')"
        project_id = $createdProjectId
        status = "PLANNING"
        start_date = (Get-Date).ToString("yyyy-MM-dd")
        end_date = (Get-Date).AddDays(14).ToString("yyyy-MM-dd")
        goal = "Sprint criada via teste automatizado"
    } | ConvertTo-Json

    $result = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/sprints" -Headers $headers -Body $sprintData
    Show-TestResult -TestName "POST /api/sprints - Criar sprint" -Result $result
}

# 5. TESTE DE COMENTÁRIOS
Write-Host "💬 TESTANDO ENDPOINTS DE COMENTÁRIOS" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow

# GET /api/task-comments
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/task-comments" -Headers $headers
Show-TestResult -TestName "GET /api/task-comments - Listar comentários" -Result $result

# 6. TESTE DE WORKFLOWS
Write-Host "🔄 TESTANDO ENDPOINTS DE WORKFLOWS" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow

# GET /api/workflows
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/workflows" -Headers $headers
Show-TestResult -TestName "GET /api/workflows - Listar workflows" -Result $result

# POST /api/workflows
$workflowData = @{
    name = "Workflow Teste $(Get-Date -Format 'yyyyMMdd-HHmmss')"
    description = "Workflow criado via teste automatizado"
    is_default = $false
} | ConvertTo-Json

$result = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/workflows" -Headers $headers -Body $workflowData
Show-TestResult -TestName "POST /api/workflows - Criar workflow" -Result $result
$createdWorkflowId = if ($result.Success) { $result.Data.id } else { $null }

# 7. TESTE DE STATUS DE TAREFAS
Write-Host "📊 TESTANDO ENDPOINTS DE STATUS" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow

# GET /api/task-statuses
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/task-statuses" -Headers $headers
Show-TestResult -TestName "GET /api/task-statuses - Listar status" -Result $result

# POST /api/task-statuses (se temos um workflow)
if ($createdWorkflowId) {
    $statusData = @{
        name = "Status Teste $(Get-Date -Format 'yyyyMMdd-HHmmss')"
        workflow_id = $createdWorkflowId
        category = "TODO"
        color = "#3b82f6"
        position = 1
    } | ConvertTo-Json

    $result = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/task-statuses" -Headers $headers -Body $statusData
    Show-TestResult -TestName "POST /api/task-statuses - Criar status" -Result $result
}

Write-Host "🎉 Testes concluídos!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 RESUMO DOS ENDPOINTS CRIADOS:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ GET/POST /api/projects" -ForegroundColor White
Write-Host "✅ GET/PUT/DELETE /api/projects/[id]" -ForegroundColor White
Write-Host "✅ GET/POST /api/tasks" -ForegroundColor White
Write-Host "✅ GET/PUT/DELETE /api/tasks/[id]" -ForegroundColor White
Write-Host "✅ GET/POST /api/project-members" -ForegroundColor White
Write-Host "✅ GET/PUT/DELETE /api/project-members/[id]" -ForegroundColor White
Write-Host "✅ GET/POST /api/sprints" -ForegroundColor White
Write-Host "✅ GET/POST /api/task-comments" -ForegroundColor White
Write-Host "✅ GET/POST /api/workflows" -ForegroundColor White
Write-Host "✅ GET/POST /api/task-statuses" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Para executar o servidor de desenvolvimento:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Endpoints disponíveis em:" -ForegroundColor Yellow
Write-Host "   http://localhost:3001/api/*" -ForegroundColor White
