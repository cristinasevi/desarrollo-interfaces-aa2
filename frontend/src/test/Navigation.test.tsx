import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navigation from "../components/Navigation";

vi.mock("react-router-dom", async () => {
  const actual = (await vi.importActual("react-router-dom")) as any;
  return {
    ...actual,
    Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("../contexts/ThemeContext", () => ({
  useTheme: () => ({ theme: "dark", toggleTheme: vi.fn() }),
}));
vi.mock("../contexts/FavoritesContext", () => ({
  useFavorites: () => ({ favorites: [] }),
}));

import { useAuth } from "../contexts/AuthContext";

describe("Navigation", () => {
  it("muestra Entrar y Registro cuando no hay sesión", () => {
    vi.mocked(useAuth).mockReturnValue({ usuario: null, logout: vi.fn() });

    render(<Navigation />);

    expect(screen.getByText(/entrar/i)).toBeInTheDocument();
    expect(screen.getByText(/registro/i)).toBeInTheDocument();
  });

  it("muestra el nombre del usuario cuando hay sesión", () => {
    vi.mocked(useAuth).mockReturnValue({
      usuario: { id: 1, nombre: "Cristina", rol: "user" },
      logout: vi.fn(),
    });

    render(<Navigation />);

    expect(screen.getByText(/cristina/i)).toBeInTheDocument();
  });

  it("muestra el botón de Salir cuando hay sesión y llama a logout al hacer click", async () => {
    const logout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      usuario: { id: 1, nombre: "Cristina", rol: "user" },
      logout,
    });

    render(<Navigation />);

    const botonSalir = screen.getByRole("button", { name: /salir/i });
    await userEvent.click(botonSalir);

    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("muestra Mi perfil para usuario normal", () => {
    vi.mocked(useAuth).mockReturnValue({
      usuario: { id: 1, nombre: "Cristina", rol: "user" },
      logout: vi.fn(),
    });

    render(<Navigation />);

    expect(screen.getByText(/mi perfil/i)).toBeInTheDocument();
  });

  it("muestra Dashboard para admin", () => {
    vi.mocked(useAuth).mockReturnValue({
      usuario: { id: 2, nombre: "Admin", rol: "admin" },
      logout: vi.fn(),
    });

    render(<Navigation />);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it("muestra Panel para moderador", () => {
    vi.mocked(useAuth).mockReturnValue({
      usuario: { id: 3, nombre: "Mod", rol: "moderator" },
      logout: vi.fn(),
    });

    render(<Navigation />);

    expect(screen.getByText(/panel/i)).toBeInTheDocument();
  });
});
