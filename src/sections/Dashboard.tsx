import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Package, Sparkles, GraduationCap, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  stats: {
    controlesJour: number;
    produitsRecus: number;
    nettoyages: number;
    formations: number;
    nonConformites: number;
  };
}

export function Dashboard({ stats }: DashboardProps) {
  const cards = [
    {
      title: 'Contrôles Température',
      value: stats.controlesJour,
      icon: Thermometer,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Produits Reçus',
      value: stats.produitsRecus,
      icon: Package,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Nettoyages',
      value: stats.nettoyages,
      icon: Sparkles,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Formations',
      value: stats.formations,
      icon: GraduationCap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.nonConformites > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-4 pt-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-700">
                {stats.nonConformites} non-conformité(s) à traiter
              </h3>
              <p className="text-sm text-red-600">
                Vérifiez les actions correctives nécessaires
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {stats.nonConformites === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-4 pt-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold text-green-700">
                Tous les contrôles sont conformes
              </h3>
              <p className="text-sm text-green-600">
                Continuez comme ça !
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rappels du jour</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Thermometer className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">Contrôle température frigo</p>
                <p className="text-sm text-gray-500">À faire toutes les 4h</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Nettoyage zone de préparation</p>
                <p className="text-sm text-gray-500">En fin de service</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Vérifier les DLC</p>
                <p className="text-sm text-gray-500">Premier entré, premier sorti</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allergènes - Menu du jour</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Burger Classique</p>
              <p className="text-sm text-gray-500">Gluten, Lait, Moutarde</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Burger Poulet</p>
              <p className="text-sm text-gray-500">Gluten, Lait</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Frites</p>
              <p className="text-sm text-gray-500">Aucun allergène majeur</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
