export type TypeControle =
  | 'temperature'
  | 'proprete'
  | 'livraison'
  | 'stockage'
  | 'allergenes';

export type StatutControle = 'conforme' | 'non_conforme';

export interface Controle {
  id: string;
  date: string;
  type: TypeControle;
  valeur: string;
  statut: StatutControle;
  action?: string;
  commentaire?: string;
}

export interface Produit {
  id: string;
  nom: string;
  fournisseur: string;
  dateReception: string;
  dlc: string;
  temperatureReception?: string;
  conforme: boolean;
  allergenes: string[];
}

export interface Nettoyage {
  id: string;
  date: string;
  zone: string;
  produitUtilise: string;
  realise: boolean;
  controleVisuel: boolean;
}

export interface Formation {
  id: string;
  date: string;
  sujet: string;
  personneFormee: string;
  duree: number;
}

export interface MenuItem {
  id: string;
  nom: string;
  allergenes: string[];
  ingredients: string[];
}
