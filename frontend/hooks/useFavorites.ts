'use client'

import { useState, useEffect, useCallback } from 'react';
import { FavoriteType, FavoritesState, IPlace } from '@/lib/types';
import { favoritesService } from '@/lib/favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoritesState>({ 
    places: [], 
    routes: [] 
  });

  // Загрузить избранное при монтировании
  useEffect(() => {
    setFavorites(favoritesService.getFavorites());
  }, []);

  // Слушатель изменений в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setFavorites(favoritesService.getFavorites());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addFavorite = useCallback((item: IPlace | IPlace[], type: FavoriteType) => {
    favoritesService.addToFavorites(item, type);
    setFavorites(favoritesService.getFavorites());
  }, []);

  const removeFavorite = useCallback((id: string, type: FavoriteType) => {
    favoritesService.removeFromFavorites(id, type);
    setFavorites(favoritesService.getFavorites());
  }, []);

  const isFavorite = useCallback((id: string, type: FavoriteType): boolean => {
    return favoritesService.isFavorite(id, type);
  }, []);

  const clearFavorites = useCallback(() => {
    favoritesService.clearFavorites();
    setFavorites({ places: [], routes: [] });
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    hasFavorites: favorites.places.length > 0 || favorites.routes.length > 0
  };
};