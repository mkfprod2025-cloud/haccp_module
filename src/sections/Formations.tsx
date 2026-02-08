import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, GraduationCap, BookOpen } from 'lucide-react';
import type { Formation } from '@/types/haccp';

interface FormationsProps {
  formations: Formation[];
  onAdd: (formation: Omit<Formation, 'id'>) => void;
  onDelete: (id: string) => void;
}

const sujetsFormation = [
  'Hygiène et sécurité sanitaire',
  'Manipulation des denrées alimentaires',
  'Gestion des allergènes',
  'Contrôle des températures',
  'Produits dangereux et nettoyage',
  'Gestion des stocks et DLC',
  'Procédures HACCP',
];

export function Formations({ formations, onAdd, onDelete }: FormationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newFormation, setNewFormation] = useState<Partial<Formation>>({
    date: new Date().toISOString().split('T')[0],
    duree: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFormation.date && newFormation.sujet && newFormation.personneFormee) {
      onAdd(newFormation as Omit<Formation, 'id'>);
      setIsOpen(false);
      setNewFormation({
        date: new Date().toISOString().split('T')[0],
        duree: 1,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          Formations
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle formation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enregistrer une formation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newFormation.date}
                  onChange={(e) => setNewFormation({ ...newFormation, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Sujet</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newFormation.sujet}
                  onChange={(e) => setNewFormation({ ...newFormation, sujet: e.target.value })}
                >
                  <option value="">Sélectionner un sujet</option>
                  {sujetsFormation.map((sujet) => (
                    <option key={sujet} value={sujet}>
                      {sujet}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Personne formée</Label>
                <Input
                  placeholder="Nom et prénom"
                  value={newFormation.personneFormee || ''}
                  onChange={(e) => setNewFormation({ ...newFormation, personneFormee: e.target.value })}
                />
              </div>
              <div>
                <Label>Durée (heures)</Label>
                <Input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newFormation.duree}
                  onChange={(e) => setNewFormation({ ...newFormation, duree: parseFloat(e.target.value) })}
                />
              </div>
              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historique des formations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Personne</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Aucune formation enregistrée
                    </TableCell>
                  </TableRow>
                ) : (
                  formations.map((formation) => (
                    <TableRow key={formation.id}>
                      <TableCell>{new Date(formation.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{formation.sujet}</TableCell>
                      <TableCell>{formation.personneFormee}</TableCell>
                      <TableCell>{formation.duree}h</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(formation.id)}
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
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Formations obligatoires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="font-medium text-green-800">Formation initiale</p>
              <p className="text-sm text-green-700 mt-1">
                Obligatoire avant prise de poste pour tout nouveau salarié
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-800">Recyclage</p>
              <p className="text-sm text-blue-700 mt-1">
                Tous les 3 ans minimum, ou en cas de changement de poste
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="font-medium text-yellow-800">Formation spécifique</p>
              <p className="text-sm text-yellow-700 mt-1">
                En cas de nouvelle procédure ou nouveau produit
              </p>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                <strong>À retenir :</strong> Gardez une trace écrite de toutes les formations 
                (dates, contenu, participants) pour le contrôle sanitaire.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
