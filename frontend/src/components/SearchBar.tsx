import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar() {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const buscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/search?q=${busqueda.trim()}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={buscar}>
      <input
        type="text"
        placeholder="Buscar películas..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="search-bar__input"
      />
      <button type="submit" className="search-bar__button">
        🔍
      </button>
    </form>
  );
}
