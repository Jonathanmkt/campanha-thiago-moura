import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { Colaborador } from "../hooks/useColaboradoresData";

interface ColaboradoresStatsProps {
  colaboradores: Colaborador[];
}

export const ColaboradoresStats = ({ colaboradores }: ColaboradoresStatsProps) => {
  const totalColaboradores = colaboradores.length;
  const ativos = colaboradores.filter(
    (c) => c.status_colaborador?.toLowerCase() === "ativo"
  ).length;
  const inativos = totalColaboradores - ativos;
  const metaTotal = colaboradores.reduce(
    (acc, c) => acc + (c.meta_mensal_eleitores || 0),
    0
  );

  const stats = [
    {
      title: "Total de Colaboradores",
      value: totalColaboradores,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Colaboradores Ativos",
      value: ativos,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Colaboradores Inativos",
      value: inativos,
      icon: UserX,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      title: "Meta Total Mensal",
      value: metaTotal,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
