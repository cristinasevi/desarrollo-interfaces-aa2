import axios from 'axios';
import type { Movie, MovieDetail, TMDBResponse, Genre, CastMember } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p';

// Configurar axios
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'es-ES',
  },
});

// Helper para construir URLs de imágenes
export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w500') => {
  if (!path) return '/placeholder.jpg';
  return `${IMG_BASE_URL}/${size}${path}`;
};

// Películas populares
export const getPopularMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  const response = await api.get('/movie/popular', { params: { page } });
  return response.data;
};

// Películas en cartelera
export const getNowPlayingMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  const response = await api.get('/movie/now_playing', { params: { page } });
  return response.data;
};

// Películas mejor valoradas
export const getTopRatedMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  const response = await api.get('/movie/top_rated', { params: { page } });
  return response.data;
};

// Próximos estrenos
export const getUpcomingMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
  const response = await api.get('/movie/upcoming', { params: { page } });
  return response.data;
};

// Detalle de película
export const getMovieDetail = async (movieId: number): Promise<MovieDetail> => {
  const response = await api.get(`/movie/${movieId}`);
  return response.data;
};

// Buscar películas
export const searchMovies = async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
  const response = await api.get('/search/movie', {
    params: { query, page },
  });
  return response.data;
};

// Obtener reparto
export const getMovieCredits = async (movieId: number): Promise<CastMember[]> => {
  const response = await api.get(`/movie/${movieId}/credits`);
  return response.data.cast;
};

// Películas similares
export const getSimilarMovies = async (movieId: number): Promise<TMDBResponse<Movie>> => {
  const response = await api.get(`/movie/${movieId}/similar`);
  return response.data;
};

// Obtener todos los géneros
export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get('/genre/movie/list');
  return response.data.genres;
};
