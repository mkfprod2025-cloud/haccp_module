import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Camera, FileText, Image, Download, Eye, FolderOpen } from 'lucide-react';
import type { Facture, CategorieFacture } from '@/types/facture';
import type { FactureStats } from '@/types/facture';

interface FacturesProps {
  factures: Facture[];
  stats: FactureStats;
  onAdd: (facture: Omit<Facture, 'id' | 'dateCreation'>) => void;
  onDelete: (id: string) => void;
}

const categories: { value: CategorieFacture; label: string; color: string }[] = [
  { value: 'matieres-premieres', label: 'Matières premières', color: 'bg-blue-500' },
  { value: 'emballages', label: 'Emballages', color: 'bg-green-500' },
  { value: 'equipements', label: 'Équipements', color: 'bg-purple-500' },
  { value: 'produits-nettoyage', label: 'Produits nettoyage', color: 'bg-orange-500' },
  { value: 'services', label: 'Services', color: 'bg-pink-500' },
  { value: 'autres', label: 'Autres', color: 'bg-gray-500' },
];

export function Factures({ factures, stats, onAdd, onDelete }: FacturesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [newFacture, setNewFacture] = useState<Partial<Facture>>({
    date: new Date().toISOString().split('T')[0],
    categorie: 'matieres-premieres',
    montantHT: 0,
    montantTTC: 0,
    tva: 20,
  });

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewImage(base64);
        setNewFacture({ ...newFacture, imageData: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFacture.numero && newFacture.fournisseur && newFacture.imageData) {
      onAdd(newFacture as Omit<Facture, 'id' | 'dateCreation'>);
      setIsOpen(false);
      setPreviewImage(null);
      setNewFacture({
        date: new Date().toISOString().split('T')[0],
        categorie: 'matieres-premieres',
        montantHT: 0,
        montantTTC: 0,
        tva: 20,
      });
    }
  };

  const calculateTTC = (ht: number, tva: number) => {
    return ht * (1 + tva / 100);
  };

  const handleHTChange = (ht: number) => {
    const ttc = calculateTTC(ht, newFacture.tva || 20);
    setNewFacture({ ...newFacture, montantHT: ht, montantTTC: ttc });
  };

  const handleTVAChange = (tva: number) => {
    const ttc = calculateTTC(newFacture.montantHT || 0, tva);
    setNewFacture({ ...newFacture, tva, montantTTC: ttc });
  };

  const getCategorieLabel = (cat: CategorieFacture) => {
    return categories.find(c => c.value === cat)?.label || cat;
  };

  const getCategorieColor = (cat: CategorieFacture) => {
    return categories.find(c => c.value === cat)?.color || 'bg-gray-500';
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(montant);
  };

  const facturesByCategorie = categories.map(cat => ({
    ...cat,
    count: factures.filter(f => f.categorie === cat.value).length,
    total: factures.filter(f => f.categorie === cat.value).reduce((sum, f) => sum + f.montantTTC, 0),
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total factures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFactures}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.facturesCeMois}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Montant total TTC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMontant(stats.montantTotalTTC)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Ce mois TTC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMontant(stats.montantCeMois)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FolderOpen className="h-6 w-6" />
          Gestion des Factures
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une facture</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Scan Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {previewImage ? (
                  <div className="space-y-3">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPreviewImage(null);
                        setNewFacture({ ...newFacture, imageData: undefined });
                      }}
                    >
                      Supprimer l'image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 h-auto py-4 px-6"
                      >
                        <Image className="h-8 w-8" />
                        <span className="text-sm">Choisir un fichier</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 h-auto py-4 px-6"
                      >
                        <Camera className="h-8 w-8" />
                        <span className="text-sm">Prendre une photo</span>
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Formats acceptés : JPG, PNG, PDF
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleImageCapture}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageCapture}
                />
              </div>

              {/* Facture Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Numéro de facture *</Label>
                  <Input
                    placeholder="FA-2024-001"
                    value={newFacture.numero || ''}
                    onChange={(e) => setNewFacture({ ...newFacture, numero: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={newFacture.date}
                    onChange={(e) => setNewFacture({ ...newFacture, date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Fournisseur *</Label>
                <Input
                  placeholder="Nom du fournisseur"
                  value={newFacture.fournisseur || ''}
                  onChange={(e) => setNewFacture({ ...newFacture, fournisseur: e.target.value })}
                />
              </div>

              <div>
                <Label>Catégorie</Label>
                <Select
                  value={newFacture.categorie}
                  onValueChange={(value) => setNewFacture({ ...newFacture, categorie: value as CategorieFacture })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Montant HT (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newFacture.montantHT || ''}
                    onChange={(e) => handleHTChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>TVA (%)</Label>
                  <Select
                    value={newFacture.tva?.toString()}
                    onValueChange={(value) => handleTVAChange(parseFloat(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5.5">5.5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Montant TTC (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newFacture.montantTTC?.toFixed(2) || ''}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <Label>Notes (optionnel)</Label>
                <Input
                  placeholder="Informations complémentaires..."
                  value={newFacture.notes || ''}
                  onChange={(e) => setNewFacture({ ...newFacture, notes: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!newFacture.imageData || !newFacture.numero || !newFacture.fournisseur}
              >
                <FileText className="h-4 w-4 mr-2" />
                Enregistrer la facture
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste des factures</TabsTrigger>
          <TabsTrigger value="categories">Par catégorie</TabsTrigger>
        </TabsList>

        <TabsContent value="liste">
          <Card>
            <CardHeader>
              <CardTitle>Mes factures ({factures.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Montant TTC</TableHead>
                    <TableHead>Scan</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        Aucune facture enregistrée
                      </TableCell>
                    </TableRow>
                  ) : (
                    factures.map((facture) => (
                      <TableRow key={facture.id}>
                        <TableCell>{new Date(facture.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="font-medium">{facture.numero}</TableCell>
                        <TableCell>{facture.fournisseur}</TableCell>
                        <TableCell>
                          <Badge className={getCategorieColor(facture.categorie)}>
                            {getCategorieLabel(facture.categorie)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatMontant(facture.montantTTC)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFacture(facture)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(facture.id)}
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
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facturesByCategorie.map((cat) => (
              <Card key={cat.value}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cat.label}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Factures</span>
                      <span className="font-semibold">{cat.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total TTC</span>
                      <span className="font-semibold">{formatMontant(cat.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedFacture} onOpenChange={() => setSelectedFacture(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Facture {selectedFacture?.numero}</DialogTitle>
          </DialogHeader>
          {selectedFacture && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Fournisseur:</span>
                  <p className="font-medium">{selectedFacture.fournisseur}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <p className="font-medium">{new Date(selectedFacture.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <span className="text-gray-500">Montant HT:</span>
                  <p className="font-medium">{formatMontant(selectedFacture.montantHT)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Montant TTC:</span>
                  <p className="font-medium">{formatMontant(selectedFacture.montantTTC)}</p>
                </div>
              </div>
              {selectedFacture.imageData && (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={selectedFacture.imageData}
                    alt={`Facture ${selectedFacture.numero}`}
                    className="w-full max-h-96 object-contain"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (!selectedFacture.imageData) {
                      return;
                    }

                    const link = document.createElement('a');
                    link.href = selectedFacture.imageData;
                    link.download = `facture-${selectedFacture.numero}.jpg`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
