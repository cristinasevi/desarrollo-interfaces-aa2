import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { FavoritesProvider } from './contexts/FavoritesContext.tsx';
import Navigation from './components/Navigation.tsx';
import Home from './pages/Home.tsx';
import Search from './pages/Search.tsx';
import Favorites from './pages/Favorites.tsx';
import MovieDetail from './pages/MovieDetail.tsx';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <div className="app">
            <Navigation />
            <main className="app__content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
