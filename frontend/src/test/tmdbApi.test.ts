import { describe, it, expect } from 'vitest';
import { getImageUrl } from '../services/tmdbApi';

describe('getImageUrl', () => {
  it('debe devolver la URL correcta con tamaño w500', () => {
    const url = getImageUrl('/pelicula.jpg', 'w500');
    expect(url).toBe('https://image.tmdb.org/t/p/w500/pelicula.jpg');
  });

  it('debe devolver la URL correcta con tamaño original', () => {
    const url = getImageUrl('/pelicula.jpg', 'original');
    expect(url).toBe('https://image.tmdb.org/t/p/original/pelicula.jpg');
  });

  it('debe devolver placeholder si path es null', () => {
    const url = getImageUrl(null);
    expect(url).toBe('/placeholder.jpg');
  });

  it('debe usar w500 como tamaño por defecto', () => {
    const url = getImageUrl('/pelicula.jpg');
    expect(url).toContain('w500');
  });
});
