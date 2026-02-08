export type CategorieFacture =
  | 'matieres-premieres'
  | 'emballages'
  | 'equipements'
  | 'produits-nettoyage'
  | 'services'
  | 'autres';

export interface Facture {
  id: string;
  dateCreation: string;
  date: string;
  numero: string;
  fournisseur: string;
  categorie: CategorieFacture;
  montantHT: number;
  montantTTC: number;
  tva: number;
  imageData?: string;
  notes?: string;
}

export interface FactureStats {
  totalFactures: number;
  montantTotalHT: number;
  montantTotalTTC: number;
  facturesCeMois: number;
  montantCeMois: number;
}
