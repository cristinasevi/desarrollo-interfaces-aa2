import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { FavoritesProvider } from './contexts/FavoritesContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { useAuth } from './contexts/AuthContext.tsx';
import Navigation from './components/Navigation.tsx';
import Home from './pages/Home.tsx';
import Search from './pages/Search.tsx';
import Favorites from './pages/Favorites.tsx';
import MovieDetail from './pages/MovieDetail.tsx';
import Login from './pages/Login.tsx';
import Registro from './pages/Registro.tsx';
import Loading from './components/Loading.tsx';
import Dashboard from './pages/Dashboard.tsx';
import DashboardModerador from './pages/DashboardModerador';
import PerfilUsuario from './pages/PerfilUsuario';
import './App.css';

// Ruta protegida para usuarios logueados
function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Loading />;
  if (!usuario) return <Navigate to="/login" />;
  return <>{children}</>;
}

// Ruta solo para admins
function RutaAdmin({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Loading />;
  if (!usuario) return <Navigate to="/login" />;
  if (usuario.rol !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
}

// Ruta para moderadores y admins
function RutaModerador({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Loading />;
  if (!usuario) return <Navigate to="/login" />;
  if (!['moderator', 'admin'].includes(usuario.rol)) return <Navigate to="/" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div className="app">
      <Navigation />
      <main className="app__content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/perfil" element={
            <RutaProtegida>
              <PerfilUsuario />
            </RutaProtegida>
          } />
          <Route path="/admin" element={
            <RutaAdmin>
              <Dashboard />
            </RutaAdmin>
          } />
          <Route path="/moderador" element={
            <RutaModerador>
              <DashboardModerador />
            </RutaModerador>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/favorites" element={
            <RutaProtegida>
              <Favorites />
            </RutaProtegida>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
