import axios from 'axios';

const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY;
const OMDB_URL = 'https://www.omdbapi.com';

export interface OmdbData {
  Director: string;
  Actors: string;
  Awards: string;
  BoxOffice: string;
  Ratings: { Source: string; Value: string }[];
  imdbRating: string;
  Runtime: string;
  Country: string;
  Language: string;
}

// Busca datos de OMDb por título y año
export const getOmdbData = async (
  titulo: string,
  año: number
): Promise<OmdbData | null> => {
  if (!OMDB_KEY) return null;

  try {
    const res = await axios.get(OMDB_URL, {
      params: {
        apikey: OMDB_KEY,
        t: titulo,
        y: año,
        type: 'movie',
      },
    });

    if (res.data.Response === 'False') return null;
    return res.data as OmdbData;
  } catch {
    return null;
  }
};

// Extrae el rating de Rotten Tomatoes del array de ratings
export const getRottenTomatoesRating = (ratings: OmdbData['Ratings']) => {
  return ratings.find((r) => r.Source === 'Rotten Tomatoes')?.Value ?? null;
};
