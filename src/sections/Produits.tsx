import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Package } from 'lucide-react';
import type { Produit } from '@/types/haccp';

interface ProduitsProps {
  produits: Produit[];
  onAdd: (produit: Omit<Produit, 'id'>) => void;
  onDelete: (id: string) => void;
}

const allergenesList = [
  'gluten',
  'crustaces',
  'oeuf',
  'poisson',
  'arachides',
  'soja',
  'lait',
  'fruits-a-coque',
  'celeri',
  'moutarde',
  'graines-de-sesame',
  'sulfites',
  'lupin',
  'mollusques',
];

export function Produits({ produits, onAdd, onDelete }: ProduitsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newProduit, setNewProduit] = useState<Partial<Produit>>({
    dateReception: new Date().toISOString().split('T')[0],
    conforme: true,
    allergenes: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduit.nom && newProduit.fournisseur && newProduit.dlc) {
      onAdd(newProduit as Omit<Produit, 'id'>);
      setIsOpen(false);
      setNewProduit({
        dateReception: new Date().toISOString().split('T')[0],
        conforme: true,
        allergenes: [],
      });
    }
  };

  const toggleAllergene = (allergene: string) => {
    const current = newProduit.allergenes || [];
    if (current.includes(allergene)) {
      setNewProduit({ ...newProduit, allergenes: current.filter(a => a !== allergene) });
    } else {
      setNewProduit({ ...newProduit, allergenes: [...current, allergene] });
    }
  };

  const isDlcProche = (dlc: string) => {
    const dlcDate = new Date(dlc);
    const today = new Date();
    const diffTime = dlcDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isDlcDepassee = (dlc: string) => {
    const dlcDate = new Date(dlc);
    const today = new Date();
    return dlcDate < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Réception & Traçabilité
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle réception
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Enregistrer une réception</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nom du produit</Label>
                <Input
                  placeholder="Ex: Steaks hachés"
                  value={newProduit.nom || ''}
                  onChange={(e) => setNewProduit({ ...newProduit, nom: e.target.value })}
                />
              </div>
              <div>
                <Label>Fournisseur</Label>
                <Input
                  placeholder="Ex: Boucherie Martin"
                  value={newProduit.fournisseur || ''}
                  onChange={(e) => setNewProduit({ ...newProduit, fournisseur: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de réception</Label>
                  <Input
                    type="date"
                    value={newProduit.dateReception}
                    onChange={(e) => setNewProduit({ ...newProduit, dateReception: e.target.value })}
                  />
                </div>
                <div>
                  <Label>DLC / DLUO</Label>
                  <Input
                    type="date"
                    value={newProduit.dlc || ''}
                    onChange={(e) => setNewProduit({ ...newProduit, dlc: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Température à réception (°C)</Label>
                <Input
                  placeholder="Ex: 2°C"
                  value={newProduit.temperatureReception || ''}
                  onChange={(e) => setNewProduit({ ...newProduit, temperatureReception: e.target.value })}
                />
              </div>
              <div>
                <Label>Allergènes présents</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-2">
                  {allergenesList.map((allergene) => (
                    <div key={allergene} className="flex items-center gap-2">
                      <Checkbox
                        checked={(newProduit.allergenes || []).includes(allergene)}
                        onCheckedChange={() => toggleAllergene(allergene)}
                      />
                      <span className="text-sm capitalize">{allergene.replace(/-/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={newProduit.conforme}
                  onCheckedChange={(checked) => setNewProduit({ ...newProduit, conforme: checked as boolean })}
                />
                <Label>Produit conforme</Label>
              </div>
              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produits en stock</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>DLC</TableHead>
                <TableHead>Allergènes</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Aucun produit enregistré
                  </TableCell>
                </TableRow>
              ) : (
                produits.map((produit) => (
                  <TableRow key={produit.id}>
                    <TableCell className="font-medium">{produit.nom}</TableCell>
                    <TableCell>{produit.fournisseur}</TableCell>
                    <TableCell>
                      <span className={`
                        ${isDlcDepassee(produit.dlc) ? 'text-red-600 font-bold' : ''}
                        ${isDlcProche(produit.dlc) ? 'text-orange-600 font-semibold' : ''}
                      `}>
                        {new Date(produit.dlc).toLocaleDateString('fr-FR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {produit.allergenes.slice(0, 3).map((a) => (
                          <Badge key={a} variant="outline" className="text-xs">
                            {a}
                          </Badge>
                        ))}
                        {produit.allergenes.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{produit.allergenes.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {produit.conforme ? (
                        <Badge className="bg-green-500">Conforme</Badge>
                      ) : (
                        <Badge className="bg-red-500">Non conforme</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(produit.id)}
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
    </div>
  );
}
