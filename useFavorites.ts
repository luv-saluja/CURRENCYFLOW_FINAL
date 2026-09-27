import { useCallback, useEffect, useState } from "react";
import type { FavoritePair } from "../types/currency";
import { LOCAL_STORAGE_KEYS } from "../utils/constants";

function loadFavorites(): FavoritePair[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.favorites);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is FavoritePair =>
        typeof p === "object" && p !== null && typeof p.from === "string" && typeof p.to === "string"
    );
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePair[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (from: string, to: string) => favorites.some((f) => f.from === from && f.to === to),
    [favorites]
  );

  const toggleFavorite = useCallback((from: string, to: string) => {
    setFavorites((current) => {
      const exists = current.some((f) => f.from === from && f.to === to);
      if (exists) return current.filter((f) => !(f.from === from && f.to === to));
      return [{ from, to }, ...current].slice(0, 12);
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
