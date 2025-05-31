import { useState, useEffect } from 'react';

// Utility to get favorites from localStorage
const getFavoritesFromStorage = (): number[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('mooFollowFavorites');
  return stored ? JSON.parse(stored) : [];
};

// Utility to save favorites to localStorage
const saveFavoritesToStorage = (favorites: number[]) => {
  localStorage.setItem('mooFollowFavorites', JSON.stringify(favorites));
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(getFavoritesFromStorage());

  // Load favorites from localStorage on mount
  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  // Listen for storage changes (e.g., from other tabs or components)
  useEffect(() => {
    const handleStorageChange = () => {
      setFavorites(getFavoritesFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id];
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  };

  // Check if an item is favorited
  const isFavorite = (id: number) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
};