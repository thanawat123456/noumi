// src/hooks/useFavorites.ts (Updated)
import { useState, useEffect } from 'react';

interface WishPlace {
  id: number;
  isFavorite: boolean;
}

export const useFavorites = (initialPlaces: WishPlace[]) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Load favorites from localStorage on mount
    const savedFavorites = localStorage.getItem('wishPlaceFavorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(new Set(parsedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        // Initialize with any existing favorites from initialPlaces
        const initialFavIds = initialPlaces
          .filter(place => place.isFavorite)
          .map(place => place.id);
        setFavorites(new Set(initialFavIds));
      }
    } else {
      // Initialize with any existing favorites from initialPlaces
      const initialFavIds = initialPlaces
        .filter(place => place.isFavorite)
        .map(place => place.id);
      setFavorites(new Set(initialFavIds));
    }
  }, [initialPlaces]);

  const toggleFavorite = (placeId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      
      // Save to localStorage
      try {
        localStorage.setItem('wishPlaceFavorites', JSON.stringify(Array.from(newFavorites)));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
      
      return newFavorites;
    });
  };

  const isFavorite = (placeId: number): boolean => favorites.has(placeId);

  const getFavoriteIds = (): number[] => Array.from(favorites);

  return { 
    favorites, 
    toggleFavorite, 
    isFavorite, 
    getFavoriteIds 
  };
};