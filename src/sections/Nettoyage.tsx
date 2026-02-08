import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import type { Nettoyage } from '@/types/haccp';

interface NettoyageProps {
  nettoyages: Nettoyage[];
  onAdd: (nettoyage: Omit<Nettoyage, 'id'>) => void;
  onDelete: (id: string) => void;
}

const zones = [
  'Zone de préparation froide',
  'Zone de préparation chaude',
  'Plonge',
  'Stockage sec',
  'Chambre froide',
  'Zone de livraison',
  'Sol général',
];

const produitsNettoyage = [
  'Détergent alimentaire',
  'Désinfectant',
  'Nettoyant multi-usage',
  'Dégraissant',
  'Eau de javel (diluée)',
];

export function NettoyageSection({ nettoyages, onAdd, onDelete }: NettoyageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newNettoyage, setNewNettoyage] = useState<Partial<Nettoyage>>({
    date: new Date().toISOString().split('T')[0],
    realise: true,
    controleVisuel: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNettoyage.date && newNettoyage.zone && newNettoyage.produitUtilise) {
      onAdd(newNettoyage as Omit<Nettoyage, 'id'>);
      setIsOpen(false);
      setNewNettoyage({
        date: new Date().toISOString().split('T')[0],
        realise: true,
        controleVisuel: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          Plan de Nettoyage
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau nettoyage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enregistrer un nettoyage</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newNettoyage.date}
                  onChange={(e) => setNewNettoyage({ ...newNettoyage, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Zone</Label>
                <Select
                  value={newNettoyage.zone}
                  onValueChange={(value) => setNewNettoyage({ ...newNettoyage, zone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Produit utilisé</Label>
                <Select
                  value={newNettoyage.produitUtilise}
                  onValueChange={(value) => setNewNettoyage({ ...newNettoyage, produitUtilise: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {produitsNettoyage.map((produit) => (
                      <SelectItem key={produit} value={produit}>
                        {produit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={newNettoyage.realise}
                    onCheckedChange={(checked) => setNewNettoyage({ ...newNettoyage, realise: checked as boolean })}
                  />
                  <Label>Nettoyage effectué</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={newNettoyage.controleVisuel}
                    onCheckedChange={(checked) => setNewNettoyage({ ...newNettoyage, controleVisuel: checked as boolean })}
                  />
                  <Label>Contrôle visuel OK</Label>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historique des nettoyages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nettoyages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Aucun nettoyage enregistré
                    </TableCell>
                  </TableRow>
                ) : (
                  nettoyages.map((nettoyage) => (
                    <TableRow key={nettoyage.id}>
                      <TableCell>{new Date(nettoyage.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{nettoyage.zone}</TableCell>
                      <TableCell>{nettoyage.produitUtilise}</TableCell>
                      <TableCell>
                        {nettoyage.realise && nettoyage.controleVisuel ? (
                          <Badge className="bg-green-500">OK</Badge>
                        ) : (
                          <Badge className="bg-red-500">À refaire</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(nettoyage.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan de nettoyage quotidien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800">Avant service</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Désinfection plan de travail</li>
                <li>• Vérification propreté équipements</li>
                <li>• Contrôle température frigo</li>
              </ul>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">Pendant service</p>
              <ul className="text-sm text-green-700 mt-1 space-y-1">
                <li>• Nettoyage continu postes</li>
                <li>• Changement gants régulier</li>
                <li>• Rangement au fur et à mesure</li>
              </ul>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-800">Après service</p>
              <ul className="text-sm text-purple-700 mt-1 space-y-1">
                <li>• Nettoyage complet zone</li>
                <li>• Désinfection surfaces</li>
                <li>• Vidange et nettoyage plonge</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
