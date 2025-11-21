"use client";

import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useColaboradoresData } from "./hooks/useColaboradoresData";
import { ColaboradoresStats } from "./components/ColaboradoresStats";
import { ColaboradoresFilters } from "./components/ColaboradoresFilters";
import { ColaboradoresTable } from "./components/ColaboradoresTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const ColaboradoresPage = () => {
  const { colaboradores, departamentos, loading, error, refetch } = useColaboradoresData();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [funcaoFilter, setFuncaoFilter] = useState("all");
  const [departamentoFilter, setDepartamentoFilter] = useState("all");
  const [subdepartamentoFilter, setSubdepartamentoFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [colaboradorToDelete, setColaboradorToDelete] = useState<string | null>(null);

  // Reset subdepartamento filter when departamento changes
  const handleDepartamentoChange = (value: string) => {
    setDepartamentoFilter(value);
    if (value === "all") {
      setSubdepartamentoFilter("all");
    }
  };

  // Get unique funcoes for filters
  const funcoes = useMemo(() => {
    const uniqueFuncoes = new Set(colaboradores.map((c) => c.funcao));
    return Array.from(uniqueFuncoes).sort();
  }, [colaboradores]);

  // Get departamentos principais (sem pai)
  const departamentosPrincipais = useMemo(() => {
    return departamentos
      .filter((d) => !d.departamento_pai_id && d.ativo)
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [departamentos]);

  // Get subdepartamentos based on selected departamento
  const subdepartamentosDisponiveis = useMemo(() => {
    if (departamentoFilter === "all") return [];
    return departamentos
      .filter((d) => d.departamento_pai_id === departamentoFilter && d.ativo)
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [departamentos, departamentoFilter]);

  // Filter colaboradores
  const filteredColaboradores = useMemo(() => {
    return colaboradores.filter((colaborador) => {
      const matchesSearch =
        searchTerm === "" ||
        colaborador.profiles.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colaborador.profiles.cpf?.includes(searchTerm) ||
        colaborador.profiles.telefone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        colaborador.status_colaborador?.toLowerCase() === statusFilter.toLowerCase();

      const matchesFuncao = funcaoFilter === "all" || colaborador.funcao === funcaoFilter;

      const matchesDepartamento =
        departamentoFilter === "all" ||
        colaborador.departamentos?.some((d) => d.departamento.id === departamentoFilter);

      const matchesSubdepartamento =
        subdepartamentoFilter === "all" ||
        colaborador.departamentos?.some((d) => d.departamento.id === subdepartamentoFilter);

      return matchesSearch && matchesStatus && matchesFuncao && matchesDepartamento && matchesSubdepartamento;
    });
  }, [colaboradores, searchTerm, statusFilter, funcaoFilter, departamentoFilter, subdepartamentoFilter]);

  const handleAddNew = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de novos colaboradores será implementada em breve.",
    });
  };

  const handleEdit = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de colaboradores será implementada em breve.",
    });
  };

  const handleDelete = (id: string) => {
    setColaboradorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (colaboradorToDelete) {
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A exclusão de colaboradores será implementada em breve.",
      });
      setDeleteDialogOpen(false);
      setColaboradorToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Erro ao carregar colaboradores: {error}</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Colaboradores</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie sua equipe com hierarquia organizacional completa
        </p>
      </div>

      <ColaboradoresStats colaboradores={colaboradores} />

      <ColaboradoresFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        funcaoFilter={funcaoFilter}
        onFuncaoFilterChange={setFuncaoFilter}
        departamentoFilter={departamentoFilter}
        onDepartamentoFilterChange={handleDepartamentoChange}
        subdepartamentoFilter={subdepartamentoFilter}
        onSubdepartamentoFilterChange={setSubdepartamentoFilter}
        onAddNew={handleAddNew}
        funcoes={funcoes}
        departamentos={departamentosPrincipais}
        subdepartamentos={subdepartamentosDisponiveis}
      />

      <ColaboradoresTable
        colaboradores={filteredColaboradores}
        onEdit={() => handleEdit()}
        onDelete={handleDelete}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ColaboradoresPage;
