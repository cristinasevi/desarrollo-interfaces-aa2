# 🎬 CineScope

Aplicación web de catálogo de películas desarrollada con React + TypeScript en el frontend y Express + MySQL en el backend, con autenticación JWT y panel de administración.

## Descripción

CineScope es la evolución de la entrega de la evaluación anterior, incorporando un sistema completo de autenticación y autorización basado en roles, gestión de estado global con Context API y useReducer, integración con un backend propio y un dashboard funcional diferenciado por rol.

## Características

- Registro e inicio de sesión con JWT y persistencia de sesión
- Protección de rutas según rol (user / admin)
- Dashboard de administración con tabla de usuarios, búsqueda, ordenación por columnas y paginación
- Perfil de usuario con tabla de favoritos filtrable y ordenable
- Tarjetas de resumen con estadísticas globales (admin) y personales (usuario)
- Busca películas por título con resultados en tiempo real
- Filtra por género y ordena por puntuación
- Guarda películas favoritas con persistencia en localStorage
- Tema claro y oscuro con persistencia
- Diseño responsive para móvil, tablet y escritorio
- Testing unitario con Vitest sobre el reducer y los servicios

## Tecnologías

**Frontend**
- React 19 + TypeScript
- Vite
- React Router DOM — enrutamiento y protección de rutas
- Axios — cliente HTTP con interceptores JWT
- Vitest + Testing Library — testing unitario
- TMDB API — base de datos de películas

**Backend**
- Node.js + Express 5
- MySQL2 — base de datos relacional
- JWT (jsonwebtoken) — autenticación y autorización
- bcryptjs — hash de contraseñas
- express-validator — validación de entradas

## Instalación

### Prerrequisitos

- Node.js >= 20.0.0
- npm >= 8.0.0
- MySQL >= 8.0 corriendo en local

### Pasos

Clona el repositorio:

```bash
git clone https://github.com/cristinasevi/desarrollo-interfaces-aa2.git
cd desarrollo-interfaces-aa2
```

Instala todas las dependencias (raíz + frontend + backend):

```bash
npm run install:all
```

Crea el archivo `backend/.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=cinescope
JWT_SECRET=cinescope_secret_2025_abc123xyz789
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Crea el archivo `frontend/.env`:

```
VITE_TMDB_API_KEY=tu_api_key_aqui
VITE_API_URL=http://localhost:3001/api
```

Obtén tu API key de TMDB:
- Regístrate en [The Movie Database](https://www.themoviedb.org/)
- Ve a Settings → API
- Genera tu API key (v3 auth)

Importa el esquema de base de datos en MySQL:

```bash
mysql -u root -p < backend/src/database/schema.sql
```

Arranca frontend y backend en paralelo:

```bash
npm run dev
```

- Frontend en http://localhost:5173
- Backend en http://localhost:3001

### Credenciales de prueba

| Rol   | Email                  | Contraseña |
|-------|------------------------|------------|
| Admin | admin@cinescope.com    | admin123   |

## Estructura del proyecto

```
desarrollo-interfaces-aa2/
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── Loading.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── MovieGrid.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── contexts/          # Estado global con Context API
│   │   │   ├── AuthContext.tsx      # useReducer + JWT
│   │   │   ├── FavoritesContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/             # Páginas de la aplicación
│   │   │   ├── Home.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── Favorites.tsx
│   │   │   ├── MovieDetail.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Registro.tsx
│   │   │   ├── Dashboard.tsx        # Solo admin
│   │   │   └── PerfilUsuario.tsx    # Solo user
│   │   ├── services/          # Acceso centralizado a APIs
│   │   │   ├── tmdbApi.ts           # API de TMDB
│   │   │   └── apiClient.ts         # Cliente axios con interceptores
│   │   ├── test/              # Tests unitarios
│   │   │   ├── auth.test.ts
│   │   │   ├── tmdbApi.test.ts
│   │   │   └── setup.ts
│   │   └── types/
│   │       └── movie.ts
├── backend/
│   └── src/
│       ├── controllers/       # Lógica de cada endpoint
│       │   ├── auth.js
│       │   ├── favoritos.js
│       │   └── admin.js
│       ├── database/
│       │   ├── db.js                # Pool de conexiones MySQL
│       │   └── schema.sql           # Esquema y datos iniciales
│       ├── middlewares/
│       │   └── auth.js              # verificarToken, soloAdmin
│       ├── routes/
│       │   ├── auth.js
│       │   ├── favoritos.js
│       │   └── admin.js
│       └── index.js
├── package.json               # Scripts raíz con concurrently
└── README.md
```

## API endpoints

**Autenticación**

| Método | Endpoint             | Descripción              | Auth |
|--------|----------------------|--------------------------|------|
| POST   | /api/auth/registro   | Registro de usuario      | No   |
| POST   | /api/auth/login      | Inicio de sesión         | No   |
| GET    | /api/auth/perfil     | Datos del usuario actual | JWT  |

**Favoritos**

| Método | Endpoint                    | Descripción               | Auth |
|--------|-----------------------------|---------------------------|------|
| GET    | /api/favoritos              | Lista favoritos del usuario | JWT |
| POST   | /api/favoritos              | Añadir favorito           | JWT  |
| DELETE | /api/favoritos/:peliculaId  | Eliminar favorito         | JWT  |

**Admin**

| Método | Endpoint                        | Descripción                  | Auth       |
|--------|---------------------------------|------------------------------|------------|
| GET    | /api/admin/estadisticas         | Totales globales             | JWT + Admin |
| GET    | /api/admin/usuarios             | Lista de usuarios paginada   | JWT + Admin |
| GET    | /api/admin/peliculas-populares  | Películas más guardadas      | JWT + Admin |
| GET    | /api/admin/busquedas-populares  | Términos más buscados        | JWT + Admin |

## Gestión de estado

El estado global se organiza en tres contextos independientes:

- **AuthContext**: gestiona sesión, token JWT y datos del usuario mediante `useReducer` con acciones `LOGIN`, `LOGOUT` y `SET_CARGANDO`
- **FavoritesContext**: gestiona la lista de favoritos con persistencia en localStorage
- **ThemeContext**: controla el tema visual con persistencia en localStorage

El `authReducer` está exportado para poder testearlo de forma aislada sin necesidad de montar el componente.

## Testing

```bash
cd frontend
npm run test:run
```

Los tests cubren:
- `authReducer` — acciones LOGIN, LOGOUT, SET_CARGANDO y acción desconocida
- `getImageUrl` — construcción de URLs correctas, tamaño por defecto y path nulo

## Scripts disponibles

| Comando              | Descripción                              |
|----------------------|------------------------------------------|
| `npm run dev`        | Arranca frontend y backend en paralelo   |
| `npm run dev:frontend` | Solo el frontend en :5173             |
| `npm run dev:backend`  | Solo el backend en :3001              |
| `npm run install:all`  | Instala dependencias en los tres niveles |
| `npm run build`        | Build de producción del frontend       |
| `cd frontend && npm run test:run` | Ejecuta los tests unitarios |

---
