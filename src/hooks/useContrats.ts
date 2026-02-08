import { useState, useEffect, useMemo } from 'react';
import type { ContratIntervenant, RappelContrat } from '@/types/contrat';

const STORAGE_KEY = 'haccp_contrats';

export function useContrats() {
  const [contrats, setContrats] = useState<ContratIntervenant[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContrats(JSON.parse(saved));
    }
  }, []);

  const saveContrats = (newContrats: ContratIntervenant[]) => {
    setContrats(newContrats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContrats));
  };

  const addContrat = (contrat: Omit<ContratIntervenant, 'id' | 'dateCreation'>) => {
    const newContrat: ContratIntervenant = {
      ...contrat,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
    };
    saveContrats([newContrat, ...contrats]);
  };

  const deleteContrat = (id: string) => {
    saveContrats(contrats.filter(c => c.id !== id));
  };

  const getRappels = useMemo((): RappelContrat[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return contrats
      .map(contrat => {
        const dateFin = new Date(contrat.dateFin);
        dateFin.setHours(0, 0, 0, 0);
        const diffTime = dateFin.getTime() - today.getTime();
        const joursRestants = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          contrat,
          joursRestants,
          estUrgent: joursRestants <= 30 && joursRestants >= 0,
        };
      })
      .filter(r => r.joursRestants <= 60) // Afficher ceux qui expirent dans 60 jours
      .sort((a, b) => a.joursRestants - b.joursRestants);
  }, [contrats]);

  const getContratsExpires = useMemo((): ContratIntervenant[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return contrats.filter(contrat => {
      const dateFin = new Date(contrat.dateFin);
      dateFin.setHours(0, 0, 0, 0);
      return dateFin < today;
    });
  }, [contrats]);

  const getStats = () => {
    const today = new Date();
    const expires = contrats.filter(c => new Date(c.dateFin) < today).length;
    const expireBientot = contrats.filter(c => {
      const dateFin = new Date(c.dateFin);
      const diff = Math.ceil((dateFin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 30;
    }).length;

    return {
      totalContrats: contrats.length,
      expires,
      expireBientot,
      actifs: contrats.length - expires,
    };
  };

  return {
    contrats,
    addContrat,
    deleteContrat,
    getRappels,
    getContratsExpires,
    getStats,
  };
}
