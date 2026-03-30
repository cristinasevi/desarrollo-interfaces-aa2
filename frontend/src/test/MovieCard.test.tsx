import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const mockToggleFavorite = vi.fn();
const mockIsFavorite = vi.fn(() => false);

vi.mock("../contexts/FavoritesContext", () => ({
  useFavorites: () => ({
    isFavorite: mockIsFavorite,
    toggleFavorite: mockToggleFavorite,
  }),
}));

const pelicula = {
  id: 550,
  title: "Fight Club",
  overview: "Un hombre insomne conoce a Tyler Durden.",
  poster_path: "/abc.jpg",
  backdrop_path: null,
  release_date: "1999-10-15",
  vote_average: 8.4,
  genre_ids: [18],
  popularity: 100,
  adult: false,
};

describe("MovieCard", () => {
  it("muestra el título de la película", () => {
    render(
      <MemoryRouter>
        <MovieCard movie={pelicula} />
      </MemoryRouter>
    );

    expect(screen.getByText("Fight Club")).toBeInTheDocument();
  });

  it("muestra el año de estreno", () => {
    render(
      <MemoryRouter>
        <MovieCard movie={pelicula} />
      </MemoryRouter>
    );

    expect(screen.getByText("1999")).toBeInTheDocument();
  });

  it("muestra la puntuación", () => {
    render(
      <MemoryRouter>
        <MovieCard movie={pelicula} />
      </MemoryRouter>
    );

    expect(screen.getByText("8.4")).toBeInTheDocument();
  });

  it("muestra corazón vacío cuando no es favorito", () => {
    mockIsFavorite.mockReturnValue(false);

    render(
      <MemoryRouter>
        <MovieCard movie={pelicula} />
      </MemoryRouter>
    );

    expect(screen.getByText("🤍")).toBeInTheDocument();
  });

  it("muestra corazón lleno cuando es favorito", () => {
    mockIsFavorite.mockReturnValue(true);

    render(
      <MemoryRouter>
        <MovieCard movie={pelicula} />
      </MemoryRouter>
    );

    expect(screen.getByText("❤️")).toBeInTheDocument();
  });

  it("llama a toggleFavorite cuando se pulsa el botón de favorito", () => {
    mockIsFavorite.mockReturnValue(false);

    render(
      <MemoryRouter>
        <MovieCard movie={pelicula} />
      </MemoryRouter>
    );

    const boton = screen.getByRole("button");
    boton.click();

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
  });
});
