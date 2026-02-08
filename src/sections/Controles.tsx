import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Thermometer } from 'lucide-react';
import type { Controle, TypeControle, StatutControle } from '@/types/haccp';

interface ControlesProps {
  controles: Controle[];
  onAdd: (controle: Omit<Controle, 'id'>) => void;
  onDelete: (id: string) => void;
}

const typesControle: { value: TypeControle; label: string }[] = [
  { value: 'temperature', label: 'Température' },
  { value: 'proprete', label: 'Propreté' },
  { value: 'livraison', label: 'Livraison' },
  { value: 'stockage', label: 'Stockage' },
  { value: 'allergenes', label: 'Allergènes' },
];

export function Controles({ controles, onAdd, onDelete }: ControlesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newControle, setNewControle] = useState<Partial<Controle>>({
    date: new Date().toISOString().split('T')[0],
    type: 'temperature',
    statut: 'conforme',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newControle.date && newControle.type && newControle.valeur && newControle.statut) {
      onAdd(newControle as Omit<Controle, 'id'>);
      setIsOpen(false);
      setNewControle({
        date: new Date().toISOString().split('T')[0],
        type: 'temperature',
        statut: 'conforme',
      });
    }
  };

  const getTypeLabel = (type: TypeControle) => {
    return typesControle.find(t => t.value === type)?.label || type;
  };

  const getStatutBadge = (statut: StatutControle) => {
    return statut === 'conforme' 
      ? <Badge className="bg-green-500">Conforme</Badge>
      : <Badge className="bg-red-500">Non conforme</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Thermometer className="h-6 w-6" />
          Contrôles HACCP
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau contrôle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un contrôle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newControle.date}
                  onChange={(e) => setNewControle({ ...newControle, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Type de contrôle</Label>
                <Select
                  value={newControle.type}
                  onValueChange={(value) => setNewControle({ ...newControle, type: value as TypeControle })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typesControle.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valeur / Résultat</Label>
                <Input
                  placeholder={newControle.type === 'temperature' ? 'Ex: 4°C' : 'Ex: Conforme'}
                  value={newControle.valeur || ''}
                  onChange={(e) => setNewControle({ ...newControle, valeur: e.target.value })}
                />
              </div>
              <div>
                <Label>Statut</Label>
                <Select
                  value={newControle.statut}
                  onValueChange={(value) => setNewControle({ ...newControle, statut: value as StatutControle })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conforme">Conforme</SelectItem>
                    <SelectItem value="non_conforme">Non conforme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newControle.statut === 'non_conforme' && (
                <div>
                  <Label>Action corrective</Label>
                  <Input
                    placeholder="Décrire l'action prise"
                    value={newControle.action || ''}
                    onChange={(e) => setNewControle({ ...newControle, action: e.target.value })}
                  />
                </div>
              )}
              <div>
                <Label>Commentaire (optionnel)</Label>
                <Input
                  value={newControle.commentaire || ''}
                  onChange={(e) => setNewControle({ ...newControle, commentaire: e.target.value })}
                />
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
          <CardTitle>Historique des contrôles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Action</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Aucun contrôle enregistré
                  </TableCell>
                </TableRow>
              ) : (
                controles.map((controle) => (
                  <TableRow key={controle.id}>
                    <TableCell>{new Date(controle.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{getTypeLabel(controle.type)}</TableCell>
                    <TableCell>{controle.valeur}</TableCell>
                    <TableCell>{getStatutBadge(controle.statut)}</TableCell>
                    <TableCell>{controle.action || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(controle.id)}
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
