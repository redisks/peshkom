'use client'
import { FavoriteType, FavoritesState, IPlace } from '@/lib/types';

const FAVORITES_KEY = 'favorites';

export const favoritesService = {
  // Получить все избранное
  getFavorites(): FavoritesState {
    if (typeof window === 'undefined') {
      return { places: [], routes: [] };
    }

    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : { places: [], routes: [] };
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return { places: [], routes: [] };
    }
  },

  // Добавить в избранное
  addToFavorites(item: IPlace | IPlace[], type: FavoriteType): void {
    if (typeof window === 'undefined') return;

    try {
      const favorites = this.getFavorites();

      if (type === FavoriteType.PLACE) {
        const place = item as IPlace;
        const exists = favorites.places.some(p => p._id === place._id);
        if (!exists) {
          favorites.places.push(place);
        }
      } else if (type === FavoriteType.ROUTE) {
        const route = item as IPlace[];
        const routeId = this.generateRouteId(route);
        const exists = favorites.routes.some(r => this.generateRouteId(r) === routeId);
        console.log(exists);
        if (!exists) {
          favorites.routes.push(route);
        }
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  },

  // Удалить из избранного
  removeFromFavorites(id: string, type: FavoriteType): void {
    if (typeof window === 'undefined') return;

    try {
      const favorites = this.getFavorites();

      if (type === FavoriteType.PLACE) {
        favorites.places = favorites.places.filter(place => place._id !== id);
      } else if (type === FavoriteType.ROUTE) {
        favorites.routes = favorites.routes.filter(route => 
          this.generateRouteId(route) !== id
        );
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  },

  // Проверить, находится ли в избранном
  isFavorite(id: string, type: FavoriteType): boolean {
    const favorites = this.getFavorites();

    if (type === FavoriteType.PLACE) {
      return favorites.places.some(place => place._id === id);
    } else if (type === FavoriteType.ROUTE) {
      return favorites.routes.some(route => this.generateRouteId(route) === id);
    }

    return false;
  },

  // Генерация ID для маршрута (на основе ID мест)
  generateRouteId(route: IPlace[]): string {
    return route.map(place => place._id).sort().join('-');
  },

  // Очистить все избранное
  clearFavorites(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify({ places: [], routes: [] }));
  }
};