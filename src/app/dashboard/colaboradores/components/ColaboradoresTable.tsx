import { MoreHorizontal, Edit, Trash2, Users, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Colaborador } from "../hooks/useColaboradoresData";

interface ColaboradoresTableProps {
  colaboradores: Colaborador[];
  onEdit: (colaborador: Colaborador) => void;
  onDelete: (id: string) => void;
}

export const ColaboradoresTable = ({
  colaboradores,
  onEdit,
  onDelete,
}: ColaboradoresTableProps) => {
  const getStatusBadgeVariant = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "ativo":
        return "default";
      case "inativo":
        return "secondary";
      case "licenca":
        return "outline";
      case "desligado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-foreground">Colaborador</TableHead>
            <TableHead className="text-foreground">Função</TableHead>
            <TableHead className="text-foreground">Supervisor</TableHead>
            <TableHead className="text-foreground">Departamentos</TableHead>
            <TableHead className="text-foreground">Equipes</TableHead>
            <TableHead className="text-foreground">Salário</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-right text-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colaboradores.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhum colaborador encontrado.
              </TableCell>
            </TableRow>
          ) : (
            colaboradores.map((colaborador) => (
              <TableRow key={colaborador.id} className="border-border">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={colaborador.profiles.foto_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {colaborador.profiles.nome_completo
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">
                        {colaborador.profiles.nome_completo}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {colaborador.profiles.telefone || "-"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">
                  <span className="capitalize">
                    {colaborador.funcao?.replace(/_/g, ' ')}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {colaborador.supervisor?.profiles?.nome_completo || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {colaborador.departamentos && colaborador.departamentos.length > 0 ? (
                      colaborador.departamentos.map((dep) => (
                        <Badge
                          key={dep.id}
                          variant="outline"
                          className="text-xs"
                        >
                          <Briefcase className="h-3 w-3 mr-1" />
                          {dep.departamento.nome}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {colaborador.equipes && colaborador.equipes.length > 0 ? (
                      colaborador.equipes.map((eq) => (
                        <Badge
                          key={eq.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Users className="h-3 w-3 mr-1" />
                          {eq.equipe.nome}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-foreground">
                  {formatCurrency(colaborador.salario)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(colaborador.status_colaborador)}>
                    {colaborador.status_colaborador || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuLabel className="text-foreground">Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        onClick={() => onEdit(colaborador)}
                        className="cursor-pointer text-foreground hover:bg-accent"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(colaborador.id)}
                        className="cursor-pointer text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
