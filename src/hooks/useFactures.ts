import { useState, useEffect } from 'react';
import type { Facture, FactureStats } from '@/types/facture';

const STORAGE_KEY = 'haccp_factures';

export function useFactures() {
  const [factures, setFactures] = useState<Facture[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setFactures(JSON.parse(saved));
    }
  }, []);

  const saveFactures = (newFactures: Facture[]) => {
    setFactures(newFactures);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFactures));
  };

  const addFacture = (facture: Omit<Facture, 'id' | 'dateCreation'>) => {
    const newFacture: Facture = {
      ...facture,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
    };
    saveFactures([newFacture, ...factures]);
  };

  const deleteFacture = (id: string) => {
    saveFactures(factures.filter(f => f.id !== id));
  };

  const getStats = (): FactureStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const facturesCeMois = factures.filter(f => {
      const date = new Date(f.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    return {
      totalFactures: factures.length,
      montantTotalHT: factures.reduce((sum, f) => sum + f.montantHT, 0),
      montantTotalTTC: factures.reduce((sum, f) => sum + f.montantTTC, 0),
      facturesCeMois: facturesCeMois.length,
      montantCeMois: facturesCeMois.reduce((sum, f) => sum + f.montantTTC, 0),
    };
  };

  const getFacturesByCategorie = () => {
    const grouped: Record<string, Facture[]> = {};
    factures.forEach(f => {
      if (!grouped[f.categorie]) {
        grouped[f.categorie] = [];
      }
      grouped[f.categorie].push(f);
    });
    return grouped;
  };

  return {
    factures,
    addFacture,
    deleteFacture,
    getStats,
    getFacturesByCategorie,
  };
}
