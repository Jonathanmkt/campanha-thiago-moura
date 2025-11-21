import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter, Building2, FolderTree } from "lucide-react";
import { Departamento } from "../hooks/useColaboradoresData";

interface ColaboradoresFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  funcaoFilter: string;
  onFuncaoFilterChange: (value: string) => void;
  departamentoFilter: string;
  onDepartamentoFilterChange: (value: string) => void;
  subdepartamentoFilter: string;
  onSubdepartamentoFilterChange: (value: string) => void;
  onAddNew: () => void;
  funcoes: string[];
  departamentos: Departamento[];
  subdepartamentos: Departamento[];
}

export const ColaboradoresFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  funcaoFilter,
  onFuncaoFilterChange,
  departamentoFilter,
  onDepartamentoFilterChange,
  subdepartamentoFilter,
  onSubdepartamentoFilterChange,
  onAddNew,
  funcoes,
  departamentos,
  subdepartamentos,
}: ColaboradoresFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-4 flex-col md:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="licenca">Licença</SelectItem>
            <SelectItem value="desligado">Desligado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={funcaoFilter} onValueChange={onFuncaoFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as funções</SelectItem>
            {funcoes.map((funcao) => (
              <SelectItem key={funcao} value={funcao}>
                {funcao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={departamentoFilter} onValueChange={onDepartamentoFilterChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            {departamentos.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={subdepartamentoFilter} 
          onValueChange={onSubdepartamentoFilterChange}
          disabled={departamentoFilter === "all" || subdepartamentos.length === 0}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <FolderTree className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Subdepartamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os subdepartamentos</SelectItem>
            {subdepartamentos.map((subdept) => (
              <SelectItem key={subdept.id} value={subdept.id}>
                {subdept.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onAddNew} className="bg-primary hover:bg-primary/90">
        <Plus className="h-4 w-4 mr-2" />
        Novo Colaborador
      </Button>
    </div>
  );
};
