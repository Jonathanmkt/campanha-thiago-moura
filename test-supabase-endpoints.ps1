# Script de teste para endpoints integrados da Gestão de Projetos
# Execute: .\test-supabase-endpoints.ps1

$baseUrl = "http://localhost:3001/api/supabase"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "🚀 Testando endpoints integrados da Gestão de Projetos..." -ForegroundColor Green
Write-Host "🔗 Usando tabelas: colaborador, equipe, colaborador_equipe" -ForegroundColor Cyan
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
        if ($Result.Data -and $Result.Data.data) {
            $count = if ($Result.Data.data -is [array]) { $Result.Data.data.Count } else { 1 }
            Write-Host "   📊 Registros encontrados: $count" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ $TestName" -ForegroundColor Red
        Write-Host "   Erro: $($Result.Error)" -ForegroundColor Red
        if ($Result.StatusCode) {
            Write-Host "   Status: $($Result.StatusCode)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

# 1. TESTE DE COLABORADORES PARA PROJETOS
Write-Host "👥 TESTANDO COLABORADORES PARA PROJETOS" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow

# GET /api/supabase/colaboradores-projetos
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/colaboradores-projetos" -Headers $headers
Show-TestResult -TestName "GET /colaboradores-projetos - Listar colaboradores" -Result $result

# GET com filtros
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/colaboradores-projetos?nivel_acesso=basico&pode_gerenciar_tarefas=true" -Headers $headers
Show-TestResult -TestName "GET /colaboradores-projetos - Com filtros" -Result $result

# 2. TESTE DE PROJETOS INTEGRADOS
Write-Host "📋 TESTANDO PROJETOS INTEGRADOS" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow

# GET /api/supabase/projetos
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/projetos" -Headers $headers
Show-TestResult -TestName "GET /projetos - Listar projetos" -Result $result

# POST /api/supabase/projetos
$projectData = @{
    name = "Projeto Integrado $(Get-Date -Format 'yyyyMMdd-HHmmss')"
    slug = "projeto-integrado-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    description = "Projeto criado via teste automatizado com integração"
    status = "ACTIVE"
    priority = "HIGH"
    visibility = "INTERNAL"
    start_date = (Get-Date).ToString("yyyy-MM-dd")
    end_date = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
} | ConvertTo-Json

$result = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/projetos" -Headers $headers -Body $projectData
Show-TestResult -TestName "POST /projetos - Criar projeto" -Result $result
$createdProjectId = if ($result.Success) { $result.Data.id } else { $null }

# 3. TESTE DE PROJETO-EQUIPES
Write-Host "🤝 TESTANDO PROJETO-EQUIPES" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

# GET /api/supabase/projeto-equipes
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/projeto-equipes" -Headers $headers
Show-TestResult -TestName "GET /projeto-equipes - Listar relacionamentos" -Result $result

# Se temos um projeto criado, tentar vincular uma equipe (se existir)
if ($createdProjectId) {
    # Primeiro, vamos buscar uma equipe existente
    $equipesResult = Invoke-ApiRequest -Method "GET" -Url "http://localhost:3001/api/supabase/equipes" -Headers $headers
    
    if ($equipesResult.Success -and $equipesResult.Data.data -and $equipesResult.Data.data.Count -gt 0) {
        $equipeId = $equipesResult.Data.data[0].id
        
        $projetoEquipeData = @{
            projeto_id = $createdProjectId
            equipe_id = $equipeId
            papel = "responsavel"
            data_inicio = (Get-Date).ToString("yyyy-MM-dd")
            observacoes = "Vinculação criada via teste automatizado"
        } | ConvertTo-Json

        $result = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/projeto-equipes" -Headers $headers -Body $projetoEquipeData
        Show-TestResult -TestName "POST /projeto-equipes - Vincular equipe" -Result $result
    } else {
        Write-Host "⚠️  Nenhuma equipe encontrada para vincular ao projeto" -ForegroundColor Yellow
        Write-Host ""
    }
}

# 4. TESTE DE TAREFAS INTEGRADAS
Write-Host "📝 TESTANDO TAREFAS INTEGRADAS" -ForegroundColor Yellow
Write-Host "==============================" -ForegroundColor Yellow

# GET /api/supabase/tarefas
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/tarefas" -Headers $headers
Show-TestResult -TestName "GET /tarefas - Listar tarefas" -Result $result

# POST /api/supabase/tarefas (se temos um projeto)
if ($createdProjectId) {
    $taskData = @{
        title = "Tarefa Integrada $(Get-Date -Format 'yyyyMMdd-HHmmss')"
        slug = "tarefa-integrada-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        description = "Tarefa criada via teste automatizado com integração"
        project_id = $createdProjectId
        priority = "HIGH"
        type = "TASK"
        start_date = (Get-Date).ToString("yyyy-MM-dd")
        due_date = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
    } | ConvertTo-Json

    $result = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/tarefas" -Headers $headers -Body $taskData
    Show-TestResult -TestName "POST /tarefas - Criar tarefa" -Result $result
}

# 5. TESTES DE FILTROS AVANÇADOS
Write-Host "🔍 TESTANDO FILTROS AVANÇADOS" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow

# Buscar projetos por status
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/projetos?status=ACTIVE&limit=5" -Headers $headers
Show-TestResult -TestName "GET /projetos - Filtro por status" -Result $result

# Buscar tarefas por prioridade
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/tarefas?priority=HIGH&limit=5" -Headers $headers
Show-TestResult -TestName "GET /tarefas - Filtro por prioridade" -Result $result

# Buscar colaboradores com busca textual
$result = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/colaboradores-projetos?search=coordenador&limit=5" -Headers $headers
Show-TestResult -TestName "GET /colaboradores-projetos - Busca textual" -Result $result

Write-Host "🎉 Testes dos endpoints integrados concluídos!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 RESUMO DOS NOVOS ENDPOINTS:" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "✅ GET/POST /api/supabase/projetos" -ForegroundColor White
Write-Host "✅ GET/POST /api/supabase/tarefas" -ForegroundColor White
Write-Host "✅ GET/POST /api/supabase/projeto-equipes" -ForegroundColor White
Write-Host "✅ GET/PUT /api/supabase/colaboradores-projetos" -ForegroundColor White
Write-Host ""
Write-Host "🔗 INTEGRAÇÃO REALIZADA:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "✅ Projetos vinculados às equipes existentes" -ForegroundColor White
Write-Host "✅ Tarefas atribuídas aos colaboradores" -ForegroundColor White
Write-Host "✅ Uso das tabelas: colaborador, equipe, colaborador_equipe" -ForegroundColor White
Write-Host "✅ Remoção da dependência de auth.users" -ForegroundColor White
Write-Host "✅ Campos adicionais para gestão de projetos" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Endpoints disponíveis em:" -ForegroundColor Yellow
Write-Host "   http://localhost:3001/api/supabase/*" -ForegroundColor White
