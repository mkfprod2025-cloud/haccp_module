import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, AlertTriangle, Utensils } from 'lucide-react';
import type { MenuItem } from '@/types/haccp';

interface AllergenesProps {
  menu: MenuItem[];
  onAdd: (item: Omit<MenuItem, 'id'>) => void;
  onDelete: (id: string) => void;
}

const allergenesList = [
  { id: 'gluten', nom: 'Gluten', icon: '🌾' },
  { id: 'crustaces', nom: 'Crustacés', icon: '🦐' },
  { id: 'oeuf', nom: 'Oeufs', icon: '🥚' },
  { id: 'poisson', nom: 'Poisson', icon: '🐟' },
  { id: 'arachides', nom: 'Arachides', icon: '🥜' },
  { id: 'soja', nom: 'Soja', icon: '🫘' },
  { id: 'lait', nom: 'Lait', icon: '🥛' },
  { id: 'fruits-a-coque', nom: 'Fruits à coque', icon: '🌰' },
  { id: 'celeri', nom: 'Céleri', icon: '🥬' },
  { id: 'moutarde', nom: 'Moutarde', icon: '🟡' },
  { id: 'graines-de-sesame', nom: 'Graines de sésame', icon: '⚫' },
  { id: 'sulfites', nom: 'Sulfites', icon: '🍷' },
  { id: 'lupin', nom: 'Lupin', icon: '🌸' },
  { id: 'mollusques', nom: 'Mollusques', icon: '🦪' },
];

export function Allergenes({ menu, onAdd, onDelete }: AllergenesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    allergenes: [],
    ingredients: [],
  });
  const [ingredientInput, setIngredientInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.nom && newItem.ingredients && newItem.ingredients.length > 0) {
      onAdd(newItem as Omit<MenuItem, 'id'>);
      setIsOpen(false);
      setNewItem({
        allergenes: [],
        ingredients: [],
      });
      setIngredientInput('');
    }
  };

  const toggleAllergene = (allergene: string) => {
    const current = newItem.allergenes || [];
    if (current.includes(allergene)) {
      setNewItem({ ...newItem, allergenes: current.filter(a => a !== allergene) });
    } else {
      setNewItem({ ...newItem, allergenes: [...current, allergene] });
    }
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setNewItem({
        ...newItem,
        ingredients: [...(newItem.ingredients || []), ingredientInput.trim()],
      });
      setIngredientInput('');
    }
  };

  const removeIngredient = (index: number) => {
    setNewItem({
      ...newItem,
      ingredients: newItem.ingredients?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Gestion des Allergènes
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un plat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un plat au menu</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nom du plat</Label>
                <Input
                  placeholder="Ex: Burger Végétarien"
                  value={newItem.nom || ''}
                  onChange={(e) => setNewItem({ ...newItem, nom: e.target.value })}
                />
              </div>
              <div>
                <Label>Ingrédients</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter un ingrédient"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  />
                  <Button type="button" onClick={addIngredient} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newItem.ingredients?.map((ing, i) => (
                    <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeIngredient(i)}>
                      {ing} ×
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Allergènes présents</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded p-2">
                  {allergenesList.map((allergene) => (
                    <div
                      key={allergene.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        (newItem.allergenes || []).includes(allergene.id)
                          ? 'bg-orange-100 border border-orange-300'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => toggleAllergene(allergene.id)}
                    >
                      <span>{allergene.icon}</span>
                      <span className="text-sm">{allergene.nom}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-orange-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800">Information importante</h3>
              <p className="text-sm text-orange-700 mt-1">
                Les 14 allergènes majeurs doivent être clairement identifiés sur votre menu
                et communiqués aux clients sur demande. En cas de doute, informez le client.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Votre menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plat</TableHead>
                  <TableHead>Allergènes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menu.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                      Aucun plat enregistré
                    </TableCell>
                  </TableRow>
                ) : (
                  menu.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nom}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.allergenes.length === 0 ? (
                            <span className="text-sm text-gray-500">Aucun</span>
                          ) : (
                            item.allergenes.map((a) => (
                              <Badge key={a} variant="outline" className="text-xs bg-orange-50">
                                {allergenesList.find(al => al.id === a)?.nom || a}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item.id)}
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
            <CardTitle>Les 14 allergènes réglementaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {allergenesList.map((allergene) => (
                <div key={allergene.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-lg">{allergene.icon}</span>
                  <span className="text-sm">{allergene.nom}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Astuce :</strong> Affichez la liste des allergènes présents dans chaque plat
                sur votre menu en ligne et sur vos emballages de livraison.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
