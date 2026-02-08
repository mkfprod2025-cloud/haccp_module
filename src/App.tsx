import { useState } from 'react';
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Toaster } from '@/components/ui/sonner';
import { Dashboard } from '@/sections/Dashboard';
import { Controles } from '@/sections/Controles';
import { Produits } from '@/sections/Produits';
import { NettoyageSection } from '@/sections/Nettoyage';
import { Formations } from '@/sections/Formations';
import { Allergenes } from '@/sections/Allergenes';
import { Factures } from '@/sections/Factures';
import { Contrats } from '@/sections/Contrats';
import { useControles, useProduits, useNettoyage, useFormations, useMenu } from '@/hooks/useHaccp';
import { useFactures } from '@/hooks/useFactures';
import { useContrats } from '@/hooks/useContrats';
import { GOOGLE_APPS_SCRIPT_URL } from "@/lib/driveExport";
import { LayoutDashboard, Thermometer, Package, Sparkles, GraduationCap, AlertTriangle, ChefHat, FileText, Users, CloudUpload, Moon, Sun } from 'lucide-react';

function App() {
  const { controles, addControle, deleteControle } = useControles();
  const { produits, addProduit, deleteProduit } = useProduits();
  const { nettoyages, addNettoyage, deleteNettoyage } = useNettoyage();
  const { formations, addFormation, deleteFormation } = useFormations();
  const { menu, addMenuItem, deleteMenuItem } = useMenu();
  const { factures, addFacture, deleteFacture, getStats: getFactureStats } = useFactures();
  const { contrats, addContrat, deleteContrat, getRappels, getContratsExpires, getStats: getContratStats } = useContrats();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Calcul des statistiques
  const today = new Date().toISOString().split('T')[0];
  const stats = {
    controlesJour: controles.filter(c => c.date === today).length,
    produitsRecus: produits.filter(p => p.dateReception === today).length,
    nettoyages: nettoyages.filter(n => n.date === today).length,
    formations: formations.length,
    nonConformites: controles.filter(c => c.statut === 'non_conforme').length +
                   produits.filter(p => !p.conforme).length,
  };

  const handleSaveToDrive = async () => {
    if (GOOGLE_APPS_SCRIPT_URL.includes("PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
      toast.error("Ajoute l'URL Google Apps Script dans src/lib/driveExport.ts.");
      return;
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      controles,
      produits,
      nettoyages,
      formations,
      menu,
      factures,
      contrats,
    };

    const toastId = toast.loading("Sauvegarde en cours...");
    setIsSaving(true);

    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Drive upload failed");
      }

      toast.success("Sauvegarde envoyée sur Google Drive.", { id: toastId });
    } catch (error) {
      toast.error("Échec de la sauvegarde Drive.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HACCP Delivery</h1>
                <p className="text-xs text-muted-foreground">Gestion sanitaire simplifiée</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1">
                  <Sun className={`h-4 w-4 ${isDarkMode ? "text-muted-foreground" : ""}`} />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={handleThemeToggle}
                    aria-label="Basculer le mode sombre"
                  />
                  <Moon className={`h-4 w-4 ${isDarkMode ? "" : "text-muted-foreground"}`} />
                  <span className="hidden sm:inline text-xs text-muted-foreground">Mode sombre</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSaveToDrive} disabled={isSaving}>
                <CloudUpload className="h-4 w-4" />
                <span className="hidden sm:inline">{isSaving ? "Sauvegarde..." : "Sauvegarder"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-1 bg-muted/40 p-1 rounded-lg shadow-sm border border-border">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 px-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">Tableau</span>
            </TabsTrigger>
            <TabsTrigger value="controles" className="flex items-center gap-2 px-2">
              <Thermometer className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">Contrôles</span>
            </TabsTrigger>
            <TabsTrigger value="produits" className="flex items-center gap-2 px-2">
              <Package className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">Produits</span>
            </TabsTrigger>
            <TabsTrigger value="nettoyage" className="flex items-center gap-2 px-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">Nettoyage</span>
            </TabsTrigger>
            <TabsTrigger value="allergenes" className="flex items-center gap-2 px-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">Allergènes</span>
            </TabsTrigger>
            <TabsTrigger value="formations" className="flex items-center gap-2 px-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">Formations</span>
            </TabsTrigger>
            <TabsTrigger value="factures" className="flex items-center gap-2 px-2">
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">Factures</span>
            </TabsTrigger>
            <TabsTrigger value="contrats" className="flex items-center gap-2 px-2">
              <Users className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">Contrats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <Dashboard stats={stats} />
          </TabsContent>

          <TabsContent value="controles" className="mt-0">
            <Controles 
              controles={controles} 
              onAdd={addControle} 
              onDelete={deleteControle} 
            />
          </TabsContent>

          <TabsContent value="produits" className="mt-0">
            <Produits 
              produits={produits} 
              onAdd={addProduit} 
              onDelete={deleteProduit} 
            />
          </TabsContent>

          <TabsContent value="nettoyage" className="mt-0">
            <NettoyageSection 
              nettoyages={nettoyages} 
              onAdd={addNettoyage} 
              onDelete={deleteNettoyage} 
            />
          </TabsContent>

          <TabsContent value="allergenes" className="mt-0">
            <Allergenes 
              menu={menu} 
              onAdd={addMenuItem} 
              onDelete={deleteMenuItem} 
            />
          </TabsContent>

          <TabsContent value="formations" className="mt-0">
            <Formations 
              formations={formations} 
              onAdd={addFormation} 
              onDelete={deleteFormation} 
            />
          </TabsContent>

          <TabsContent value="factures" className="mt-0">
            <Factures 
              factures={factures}
              stats={getFactureStats()}
              onAdd={addFacture}
              onDelete={deleteFacture}
            />
          </TabsContent>

          <TabsContent value="contrats" className="mt-0">
            <Contrats 
              contrats={contrats}
              rappels={getRappels}
              expires={getContratsExpires}
              stats={getContratStats()}
              onAdd={addContrat}
              onDelete={deleteContrat}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p>HACCP Delivery Kitchen - Application de gestion sanitaire</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Conforme au règlement (CE) n° 852/2004</p>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
