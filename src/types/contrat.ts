// Types pour la gestion des contrats intervenants

export interface ContratIntervenant {
  id: string;
  nom: string;
  type: TypeIntervenant;
  contact: string;
  telephone: string;
  email: string;
  dateDebut: string;
  dateFin: string;
  frequence: string;
  contratData: string; // Base64 du fichier contrat
  notes?: string;
  dateCreation: string;
}

export type TypeIntervenant = 
  | 'deratisation'
  | 'nettoyage-exterieur'
  | 'maintenance-frigo'
  | 'maintenance-cuisine'
  | 'extincteur'
  | 'assainissement'
  | 'electricien'
  | 'plombier'
  | 'autre';

export interface RappelContrat {
  contrat: ContratIntervenant;
  joursRestants: number;
  estUrgent: boolean;
}

export const typesIntervenant: { value: TypeIntervenant; label: string; icon: string }[] = [
  { value: 'deratisation', label: 'Dératisation / Désinsectisation', icon: '🐀' },
  { value: 'nettoyage-exterieur', label: 'Nettoyage extérieur', icon: '🧹' },
  { value: 'maintenance-frigo', label: 'Maintenance froid', icon: '❄️' },
  { value: 'maintenance-cuisine', label: 'Maintenance cuisine', icon: '🔧' },
  { value: 'extincteur', label: 'Contrôle extincteurs', icon: '🧯' },
  { value: 'assainissement', label: 'Assainissement / WC', icon: '🚽' },
  { value: 'electricien', label: 'Électricien', icon: '⚡' },
  { value: 'plombier', label: 'Plombier', icon: '🔵' },
  { value: 'autre', label: 'Autre intervenant', icon: '📋' },
];
