// Películas
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
}

// Detalles
export interface MovieDetail extends Movie {
  runtime: number;    // duration
  genres: Genre[];
  original_language: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  status: string;
}

// Géneros
export interface Genre {
  id: number;
  name: string;
}

// Productora
export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

// País
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

// Reparto
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

// Categorías
export interface MovieCategory {
  title: string;
  endpoint: string;
}

// Respuesta genérica de la API
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
