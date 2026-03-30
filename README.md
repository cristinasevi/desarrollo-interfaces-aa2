# 🎬 CineScope

Aplicación web de catálogo de películas desarrollada con React + TypeScript en el frontend y Express + MySQL en el backend, con autenticación JWT, panel de administración y panel de moderación.

## Descripción

CineScope es la evolución de la entrega de la evaluación anterior, incorporando un sistema completo de autenticación y autorización basado en roles, gestión de estado global con Context API y useReducer, integración con un backend propio y dashboards funcionales diferenciados por rol. Además, integra dos APIs externas (TMDB y OMDb) para ofrecer información completa sobre cada película.

## Características

- Registro e inicio de sesión con JWT y persistencia de sesión
- Protección de rutas según rol (user / moderator / admin)
- Dashboard de administración con tabla de usuarios, búsqueda, ordenación por columnas y paginación
- Panel de moderación con estadísticas de la plataforma y películas más populares
- Perfil de usuario con tabla de favoritos filtrable y ordenable
- Tarjetas de resumen con estadísticas globales (admin/moderador) y personales (usuario)
- Detalle de película enriquecido con datos de OMDb: director, premios, recaudación y rating de Rotten Tomatoes
- Favoritos con persistencia en base de datos (usuarios autenticados)
- Registro automático de búsquedas para análisis en el panel de moderación
- Busca películas por título con resultados en tiempo real
- Filtra por género y ordena por puntuación
- Guarda películas favoritas con persistencia en localStorage
- Tema claro y oscuro con persistencia
- Diseño responsive para móvil, tablet y escritorio
- Testing unitario e integración con Vitest y React Testing Library

## Tecnologías

**Frontend**
- React 19 + TypeScript
- Vite
- React Router DOM — enrutamiento y protección de rutas
- Axios — cliente HTTP con interceptores JWT
- Vitest + Testing Library — testing unitario e integración
- TMDB API — base de datos de películas
- OMDb API — datos extra: director, premios, recaudación, Rotten Tomatoes

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
VITE_OMDB_API_KEY=tu_api_key_aqui
VITE_API_URL=http://localhost:3001/api
```

Obtén tu API key de TMDB:
- Regístrate en [The Movie Database](https://www.themoviedb.org/)
- Ve a Settings → API
- Genera tu API key (v3 auth)

Obtén tu API key de OMDb:
- Regístrate en [OMDb API](https://www.omdbapi.com/apikey.aspx)
- Elige el plan gratuito (1000 peticiones/día)
- Activa la key desde el email de confirmación

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
 
| Rol       | Email                       | Contraseña |
|-----------|-----------------------------|------------|
| Admin     | admin@cinescope.com         | admin123   |
| Moderador | moderador@cinescope.com     | admin123   |

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
│   │   │   ├── OmdbInfo.tsx         # Datos extra de OMDb
│   │   │   └── SearchBar.tsx
│   │   ├── contexts/          # Estado global con Context API
│   │   │   ├── AuthContext.tsx      # useReducer + JWT
│   │   │   ├── FavoritesContext.tsx # Sincronización con backend
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/             # Páginas de la aplicación
│   │   │   ├── Home.tsx
│   │   │   ├── Search.tsx           # Registra búsquedas en BD
│   │   │   ├── Favorites.tsx
│   │   │   ├── MovieDetail.tsx      # Datos TMDB + OMDb
│   │   │   ├── Login.tsx
│   │   │   ├── Registro.tsx
│   │   │   ├── Dashboard.tsx        # Solo admin
│   │   │   ├── DashboardModerador.tsx  # Solo moderador
│   │   │   └── PerfilUsuario.tsx    # Solo user
│   │   ├── services/          # Acceso centralizado a APIs
│   │   │   ├── tmdbApi.ts           # API de TMDB
│   │   │   ├── omdbApi.ts           # API de OMDb
│   │   │   └── apiClient.ts         # Cliente axios con interceptores
│   │   ├── test/              # Tests unitarios e integración
│   │   │   ├── auth.test.ts         # Tests del authReducer
│   │   │   ├── tmdbApi.test.ts      # Tests de getImageUrl
│   │   │   ├── MovieCard.test.tsx   # Tests de integración
│   │   │   ├── Navigation.test.tsx  # Tests de integración
│   │   │   └── setup.ts
│   │   └── types/
│   │       └── movie.ts
├── backend/
│   └── src/
│       ├── controllers/       # Lógica de cada endpoint
│       │   ├── auth.js
│       │   ├── favoritos.js
│       │   ├── busquedas.js
│       │   ├── admin.js
│       │   └── moderador.js
│       ├── database/
│       │   ├── db.js                # Pool de conexiones MySQL
│       │   └── schema.sql           # Esquema y datos iniciales
│       ├── middlewares/
│       │   └── auth.js              # verificarToken, soloAdmin, soloModerador
│       ├── routes/
│       │   ├── auth.js
│       │   ├── favoritos.js
│       │   ├── busquedas.js
│       │   ├── admin.js
│       │   └── moderador.js
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

| Método | Endpoint                    | Descripción                 | Auth |
|--------|-----------------------------|-----------------------------|------|
| GET    | /api/favoritos              | Lista favoritos del usuario | JWT  |
| POST   | /api/favoritos              | Añadir favorito             | JWT  |
| DELETE | /api/favoritos/:peliculaId  | Eliminar favorito           | JWT  |

**Búsquedas**

| Método | Endpoint         | Descripción                  | Auth |
|--------|------------------|------------------------------|------|
| POST   | /api/busquedas   | Registrar búsqueda realizada | JWT  |

**Admin**

| Método | Endpoint                        | Descripción                | Auth         |
|--------|---------------------------------|----------------------------|--------------|
| GET    | /api/admin/estadisticas         | Totales globales           | JWT + Admin  |
| GET    | /api/admin/usuarios             | Lista de usuarios paginada | JWT + Admin  |
| GET    | /api/admin/peliculas-populares  | Películas más guardadas    | JWT + Admin  |
| GET    | /api/admin/busquedas-populares  | Términos más buscados      | JWT + Admin  |

**Moderador**

| Método | Endpoint                           | Descripción                | Auth              |
|--------|------------------------------------|----------------------------|-------------------|
| GET    | /api/moderador/estadisticas        | Estadísticas globales      | JWT + Moderador   |
| GET    | /api/moderador/peliculas-populares | Películas más guardadas    | JWT + Moderador   |
| GET    | /api/moderador/busquedas-populares | Términos más buscados      | JWT + Moderador   |

## Gestión de estado
 
El estado global se organiza en tres contextos independientes:

- **AuthContext**: gestiona sesión, token JWT y datos del usuario mediante `useReducer` con acciones `LOGIN`, `LOGOUT` y `SET_CARGANDO`. Se usa reducer porque las transiciones son complejas y relacionadas entre sí.
- **FavoritesContext**: gestiona la lista de favoritos. Si hay sesión activa sincroniza con el backend; si no, usa localStorage como fallback.
- **ThemeContext**: controla el tema visual con persistencia en localStorage.

El estado local de carga, errores y filtros de cada página se mantiene con `useState` dentro del propio componente, sin subirlo al contexto global.

El `authReducer` está exportado para poder testearlo de forma aislada sin necesidad de montar el componente.

## Testing

```bash
cd frontend
npm run test:run
```

Los tests cubren:

**Unitarios**
- `auth.test.ts`: acciones LOGIN (3 roles), LOGOUT, SET_CARGANDO e inmutabilidad del reducer
- `tmdbApi.test.ts`: construcción de URLs, tamaño por defecto y path nulo

**Integración**
- `MovieCard.test.tsx`: renderizado de título, año, puntuación, estado del corazón e interacción con favoritos
- `Navigation.test.tsx`: enlaces visibles según rol (user / moderator / admin), botón de logout

## Scripts disponibles

| Comando                            | Descripción                               |
|------------------------------------|-------------------------------------------|
| `npm run dev`                      | Arranca frontend y backend en paralelo    |
| `npm run dev:frontend`             | Solo el frontend en :5173                 |
| `npm run dev:backend`              | Solo el backend en :3001                  |
| `npm run install:all`              | Instala dependencias en los tres niveles  |
| `npm run build`                    | Build de producción del frontend          |
| `cd frontend && npm run test:run`  | Ejecuta los tests                         |

---
