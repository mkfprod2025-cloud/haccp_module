import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Camera, FileText, Download, Eye, Users, AlertTriangle, CheckCircle, Clock, FileUp } from 'lucide-react';
import type { ContratIntervenant, TypeIntervenant, RappelContrat } from '@/types/contrat';
import { typesIntervenant } from '@/types/contrat';

interface ContratsProps {
  contrats: ContratIntervenant[];
  rappels: RappelContrat[];
  expires: ContratIntervenant[];
  stats: {
    totalContrats: number;
    expires: number;
    expireBientot: number;
    actifs: number;
  };
  onAdd: (contrat: Omit<ContratIntervenant, 'id' | 'dateCreation'>) => void;
  onDelete: (id: string) => void;
}

export function Contrats({ contrats, rappels, expires, stats, onAdd, onDelete }: ContratsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedContrat, setSelectedContrat] = useState<ContratIntervenant | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [newContrat, setNewContrat] = useState<Partial<ContratIntervenant>>({
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'deratisation',
    frequence: 'Mensuelle',
  });

  const handleFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewFile(base64);
        setNewContrat({ ...newContrat, contratData: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContrat.nom && newContrat.type && newContrat.dateFin && newContrat.contratData) {
      onAdd(newContrat as Omit<ContratIntervenant, 'id' | 'dateCreation'>);
      setIsOpen(false);
      setPreviewFile(null);
      setNewContrat({
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'deratisation',
        frequence: 'Mensuelle',
      });
    }
  };

  const getTypeLabel = (type: TypeIntervenant) => {
    return typesIntervenant.find(t => t.value === type)?.label || type;
  };

  const getTypeIcon = (type: TypeIntervenant) => {
    return typesIntervenant.find(t => t.value === type)?.icon || '📋';
  };

  const getJoursRestantsColor = (jours: number) => {
    if (jours < 0) return 'text-red-600 bg-red-100';
    if (jours <= 7) return 'text-red-600 bg-red-50';
    if (jours <= 30) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const formatJoursRestants = (jours: number) => {
    if (jours < 0) return `Expiré depuis ${Math.abs(jours)} jours`;
    if (jours === 0) return 'Expire aujourd\'hui';
    if (jours === 1) return 'Expire demain';
    return `${jours} jours restants`;
  };

  return (
    <div className="space-y-6">
      {/* Alertes */}
      {expires.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>{expires.length} contrat(s) expiré(s)</strong> - Renouvellement nécessaire immédiatement
          </AlertDescription>
        </Alert>
      )}

      {rappels.filter(r => r.joursRestants >= 0 && r.joursRestants <= 30).length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-700">
            <strong>{rappels.filter(r => r.joursRestants >= 0 && r.joursRestants <= 30).length} contrat(s)</strong> expirent dans moins de 30 jours
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total contrats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContrats}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.actifs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Expire bientôt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expireBientot}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Expirés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expires}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Contrats Intervenants
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau contrat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un contrat intervenant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Scan Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {previewFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-8 w-8" />
                      <span className="font-medium">Contrat scanné</span>
                    </div>
                    <p className="text-sm text-gray-500">Fichier prêt à être enregistré</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPreviewFile(null);
                        setNewContrat({ ...newContrat, contratData: undefined });
                      }}
                    >
                      Supprimer le fichier
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
                        <FileUp className="h-8 w-8" />
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
                      Formats acceptés : PDF, JPG, PNG
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={handleFileCapture}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileCapture}
                />
              </div>

              {/* Intervenant Details */}
              <div>
                <Label>Nom de l'intervenant / Société *</Label>
                <Input
                  placeholder="Ex: ProDérat 33"
                  value={newContrat.nom || ''}
                  onChange={(e) => setNewContrat({ ...newContrat, nom: e.target.value })}
                />
              </div>

              <div>
                <Label>Type d'intervention *</Label>
                <Select
                  value={newContrat.type}
                  onValueChange={(value) => setNewContrat({ ...newContrat, type: value as TypeIntervenant })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typesIntervenant.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    placeholder="06 12 34 56 78"
                    value={newContrat.telephone || ''}
                    onChange={(e) => setNewContrat({ ...newContrat, telephone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="contact@example.com"
                    value={newContrat.email || ''}
                    onChange={(e) => setNewContrat({ ...newContrat, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Contact (nom de la personne)</Label>
                <Input
                  placeholder="Nom du contact chez l'intervenant"
                  value={newContrat.contact || ''}
                  onChange={(e) => setNewContrat({ ...newContrat, contact: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de début *</Label>
                  <Input
                    type="date"
                    value={newContrat.dateDebut}
                    onChange={(e) => setNewContrat({ ...newContrat, dateDebut: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Date de fin *</Label>
                  <Input
                    type="date"
                    value={newContrat.dateFin}
                    onChange={(e) => setNewContrat({ ...newContrat, dateFin: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Fréquence d'intervention</Label>
                <Select
                  value={newContrat.frequence}
                  onValueChange={(value) => setNewContrat({ ...newContrat, frequence: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ponctuelle">Ponctuelle</SelectItem>
                    <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
                    <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                    <SelectItem value="Trimestrielle">Trimestrielle</SelectItem>
                    <SelectItem value="Semestrielle">Semestrielle</SelectItem>
                    <SelectItem value="Annuelle">Annuelle</SelectItem>
                    <SelectItem value="Sur appel">Sur appel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes (optionnel)</Label>
                <Input
                  placeholder="Informations complémentaires..."
                  value={newContrat.notes || ''}
                  onChange={(e) => setNewContrat({ ...newContrat, notes: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!newContrat.contratData || !newContrat.nom || !newContrat.dateFin}
              >
                <FileText className="h-4 w-4 mr-2" />
                Enregistrer le contrat
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rappels Section */}
      {rappels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Rappels de renouvellement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rappels.slice(0, 5).map((rappel) => (
                <div
                  key={rappel.contrat.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${getJoursRestantsColor(rappel.joursRestants)}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getTypeIcon(rappel.contrat.type)}</span>
                    <div>
                      <p className="font-medium">{rappel.contrat.nom}</p>
                      <p className="text-sm opacity-80">{getTypeLabel(rappel.contrat.type)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatJoursRestants(rappel.joursRestants)}</p>
                    <p className="text-sm opacity-80">
                      Expire le {new Date(rappel.contrat.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contrats List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes contrats ({contrats.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Intervenant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Fin de contrat</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Contrat</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contrats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    Aucun contrat enregistré
                  </TableCell>
                </TableRow>
              ) : (
                contrats.map((contrat) => {
                  const joursRestants = Math.ceil(
                    (new Date(contrat.dateFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isExpired = joursRestants < 0;
                  const isUrgent = joursRestants >= 0 && joursRestants <= 30;

                  return (
                    <TableRow key={contrat.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getTypeIcon(contrat.type)}</span>
                          <span className="text-sm">{getTypeLabel(contrat.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{contrat.nom}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {contrat.telephone && <p>{contrat.telephone}</p>}
                          {contrat.email && <p className="text-gray-500">{contrat.email}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(contrat.dateFin).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {isExpired ? (
                          <Badge className="bg-red-500">Expiré</Badge>
                        ) : isUrgent ? (
                          <Badge className="bg-orange-500">{joursRestants}j</Badge>
                        ) : (
                          <Badge className="bg-green-500">Actif</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedContrat(contrat)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(contrat.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Contrat Preview Dialog */}
      <Dialog open={!!selectedContrat} onOpenChange={() => setSelectedContrat(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedContrat && getTypeIcon(selectedContrat.type)}</span>
              Contrat {selectedContrat?.nom}
            </DialogTitle>
          </DialogHeader>
          {selectedContrat && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium">{getTypeLabel(selectedContrat.type)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Contact:</span>
                  <p className="font-medium">{selectedContrat.contact || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Téléphone:</span>
                  <p className="font-medium">{selectedContrat.telephone || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">{selectedContrat.email || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Période:</span>
                  <p className="font-medium">
                    Du {new Date(selectedContrat.dateDebut).toLocaleDateString('fr-FR')}
                    {' '}au {new Date(selectedContrat.dateFin).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Fréquence:</span>
                  <p className="font-medium">{selectedContrat.frequence}</p>
                </div>
                {selectedContrat.notes && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Notes:</span>
                    <p className="font-medium">{selectedContrat.notes}</p>
                  </div>
                )}
              </div>
              {selectedContrat.contratData && (
                <div className="border rounded-lg overflow-hidden">
                  {selectedContrat.contratData.startsWith('data:application/pdf') ? (
                    <div className="p-8 text-center bg-gray-100">
                      <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Document PDF</p>
                    </div>
                  ) : (
                    <img
                      src={selectedContrat.contratData}
                      alt={`Contrat ${selectedContrat.nom}`}
                      className="w-full max-h-96 object-contain"
                    />
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedContrat.contratData;
                    link.download = `contrat-${selectedContrat.nom}.pdf`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le contrat
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
