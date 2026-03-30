import { describe, it, expect } from "vitest";
import { getImageUrl } from "../services/tmdbApi";

describe("getImageUrl", () => {
  it("devuelve la URL correcta con tamaño w500", () => {
    const url = getImageUrl("/pelicula.jpg", "w500");
    expect(url).toBe("https://image.tmdb.org/t/p/w500/pelicula.jpg");
  });

  it("devuelve la URL correcta con tamaño original", () => {
    const url = getImageUrl("/pelicula.jpg", "original");
    expect(url).toBe("https://image.tmdb.org/t/p/original/pelicula.jpg");
  });

  it("devuelve placeholder si el path es null", () => {
    const url = getImageUrl(null);
    expect(url).toBe("/placeholder.jpg");
  });

  it("usa w500 como tamaño por defecto", () => {
    const url = getImageUrl("/pelicula.jpg");
    expect(url).toContain("w500");
  });
});
