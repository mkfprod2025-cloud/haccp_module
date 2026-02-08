import { useState, useEffect } from 'react';
import type { Controle, Produit, Nettoyage, Formation, MenuItem } from '@/types/haccp';

// Stockage local simulé
const STORAGE_KEYS = {
  controles: 'haccp_controles',
  produits: 'haccp_produits',
  nettoyage: 'haccp_nettoyage',
  formations: 'haccp_formations',
  menu: 'haccp_menu',
};

export function useControles() {
  const [controles, setControles] = useState<Controle[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.controles);
    if (saved) setControles(JSON.parse(saved));
  }, []);

  const saveControles = (newControles: Controle[]) => {
    setControles(newControles);
    localStorage.setItem(STORAGE_KEYS.controles, JSON.stringify(newControles));
  };

  const addControle = (controle: Omit<Controle, 'id'>) => {
    const newControle = { ...controle, id: Date.now().toString() };
    saveControles([newControle, ...controles]);
  };

  const deleteControle = (id: string) => {
    saveControles(controles.filter(c => c.id !== id));
  };

  return { controles, addControle, deleteControle };
}

export function useProduits() {
  const [produits, setProduits] = useState<Produit[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.produits);
    if (saved) setProduits(JSON.parse(saved));
  }, []);

  const saveProduits = (newProduits: Produit[]) => {
    setProduits(newProduits);
    localStorage.setItem(STORAGE_KEYS.produits, JSON.stringify(newProduits));
  };

  const addProduit = (produit: Omit<Produit, 'id'>) => {
    const newProduit = { ...produit, id: Date.now().toString() };
    saveProduits([newProduit, ...produits]);
  };

  const deleteProduit = (id: string) => {
    saveProduits(produits.filter(p => p.id !== id));
  };

  return { produits, addProduit, deleteProduit };
}

export function useNettoyage() {
  const [nettoyages, setNettoyages] = useState<Nettoyage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.nettoyage);
    if (saved) setNettoyages(JSON.parse(saved));
  }, []);

  const saveNettoyages = (newNettoyages: Nettoyage[]) => {
    setNettoyages(newNettoyages);
    localStorage.setItem(STORAGE_KEYS.nettoyage, JSON.stringify(newNettoyages));
  };

  const addNettoyage = (nettoyage: Omit<Nettoyage, 'id'>) => {
    const newNettoyage = { ...nettoyage, id: Date.now().toString() };
    saveNettoyages([newNettoyage, ...nettoyages]);
  };

  const deleteNettoyage = (id: string) => {
    saveNettoyages(nettoyages.filter(n => n.id !== id));
  };

  return { nettoyages, addNettoyage, deleteNettoyage };
}

export function useFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.formations);
    if (saved) setFormations(JSON.parse(saved));
  }, []);

  const saveFormations = (newFormations: Formation[]) => {
    setFormations(newFormations);
    localStorage.setItem(STORAGE_KEYS.formations, JSON.stringify(newFormations));
  };

  const addFormation = (formation: Omit<Formation, 'id'>) => {
    const newFormation = { ...formation, id: Date.now().toString() };
    saveFormations([newFormation, ...formations]);
  };

  const deleteFormation = (id: string) => {
    saveFormations(formations.filter(f => f.id !== id));
  };

  return { formations, addFormation, deleteFormation };
}

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.menu);
    if (saved) {
      setMenu(JSON.parse(saved));
    } else {
      // Menu par défaut pour une delivery kitchen
      const defaultMenu: MenuItem[] = [
        {
          id: '1',
          nom: 'Burger Classique',
          allergenes: ['gluten', 'lait', 'moutarde'],
          ingredients: ['pain', 'steak', 'fromage', 'salade', 'tomate', 'sauce']
        },
        {
          id: '2',
          nom: 'Burger Poulet',
          allergenes: ['gluten', 'lait'],
          ingredients: ['pain', 'poulet', 'fromage', 'salade', 'sauce']
        },
        {
          id: '3',
          nom: 'Frites',
          allergenes: [],
          ingredients: ['pommes de terre', 'huile']
        },
        {
          id: '4',
          nom: 'Salade César',
          allergenes: ['lait', 'oeuf', 'poisson'],
          ingredients: ['salade', 'poulet', 'parmesan', 'croutons', 'sauce césar']
        }
      ];
      setMenu(defaultMenu);
      localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(defaultMenu));
    }
  }, []);

  const saveMenu = (newMenu: MenuItem[]) => {
    setMenu(newMenu);
    localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(newMenu));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    saveMenu([...menu, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    saveMenu(menu.filter(m => m.id !== id));
  };

  return { menu, addMenuItem, deleteMenuItem };
}
