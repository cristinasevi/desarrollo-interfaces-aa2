import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './AuthContext';
import type { Movie } from '../types/movie';

const FavoritesContext = createContext<any>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Al iniciar sesión, cargar favoritos desde el backend
  // Si no hay sesión, cargar desde localStorage (modo invitado)
  useEffect(() => {
    if (usuario) {
      apiClient.get('/favoritos')
        .then(res => {
          const mapped: Movie[] = res.data.favoritos.map((f: any) => ({
            id: f.pelicula_id,
            title: f.titulo,
            poster_path: f.poster_path,
            vote_average: Number(f.vote_average),
            release_date: f.release_date ?? '',
            overview: '',
            backdrop_path: null,
            genre_ids: [],
            popularity: 0,
            adult: false,
          }));
          setFavorites(mapped);
        })
        .catch(() => {
          // Si falla la carga, quedarse con lista vacía
          setFavorites([]);
        });
    } else {
      // Sin sesión: usar localStorage como fallback
      const saved = localStorage.getItem('favorites');
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [usuario]);

  // Persistir en localStorage solo cuando no hay sesión activa
  useEffect(() => {
    if (!usuario) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, usuario]);

  const addFavorite = async (movie: Movie) => {
    if (favorites.some(fav => fav.id === movie.id)) return;

    setFavorites(prev => [...prev, movie]);

    if (usuario) {
      try {
        await apiClient.post('/favoritos', {
          pelicula_id: movie.id,
          titulo: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        });
      } catch {
        setFavorites(prev => prev.filter(f => f.id !== movie.id));
      }
    }
  };

  const removeFavorite = async (movieId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== movieId));

    if (usuario) {
      try {
        await apiClient.delete(`/favoritos/${movieId}`);
      } catch {
        console.error('Error al eliminar favorito del servidor');
      }
    }
  };

  const isFavorite = (movieId: number) => {
    return favorites.some(fav => fav.id === movieId);
  };

  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext)!;
