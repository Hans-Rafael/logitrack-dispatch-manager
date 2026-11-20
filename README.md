# 🚚 LogiTrack — Dispatch Manager

🇪🇸 [Español](#-español) · 🇬🇧 [English](#-english)

---

## 🇪🇸 Español

**LogiTrack** es una aplicación web full-stack para la gestión y seguimiento de despachos logísticos. Al registrar un envío, el sistema consulta las coordenadas del destino con la API oficial **GeoRef (Argentina)**, obtiene el clima actual con **Open-Meteo** y guarda todo en **PostgreSQL (Neon)**.

### ✨ Características

- **CRUD completo:** crear despachos, listar, cambiar estado (`Pendiente`, `En camino`, `Entregado`, `Cancelado`) y eliminar con confirmación.
- **Enriquecimiento automático:** geolocalización (GeoRef AR → `latitud`, `longitud`) y clima en destino (Open-Meteo → temperatura y viento).
- **Búsqueda y filtros combinados** en cliente (cliente, producto, dirección, localidad + estado) con contadores en vivo.
- **Health check:** `GET /api/health` consultado cada 30 s; el Navbar muestra si la API está conectada.
- **i18n ES / EN** con `LanguageContext`, diccionarios en `locales/` y preferencia guardada en `localStorage`.
- **Modo claro / oscuro** con `ThemeContext`, Tailwind v4 (`@custom-variant dark`) y preferencia persistente.

### 📸 Capturas / Screenshots

| Modo claro · ES | Modo oscuro · ES | Light mode · EN |
|---|---|---|
| ![Light ES](docs/screenshots/light-es.jpg) | ![Dark ES](docs/screenshots/dark-es.jpg) | ![Light EN](docs/screenshots/light-en.jpg) |

### 🏗️ Arquitectura

```text
┌────────────────────┐   fetch /api   ┌──────────────────────┐      SQL (pg)     ┌────────────────┐
│ Frontend           │ ─────────────▶ │ Backend              │ ────────────────▶ │ PostgreSQL     │
│ React 19 + Vite    │ ◀───────────── │ Node.js + Express 5  │ ◀──────────────── │ (Neon)         │
│ Tailwind v4        │      JSON      │ routes → controllers │                   └────────────────┘
│ i18n + Dark Mode   │                │        → services    │ ── axios ──▶ GeoRef AR (coordenadas)
└────────────────────┘                └──────────────────────┘ ── axios ──▶ Open-Meteo (clima)
```

Flujo de `POST /api/pedidos`: validación → GeoRef (dirección + localidad → lat/lon, provincia) → Open-Meteo (lat/lon → temperatura/viento) → `INSERT` con consultas SQL parametrizadas → respuesta JSON.

### 🔌 Integraciones externas

| Servicio | Uso | Docs |
|---|---|---|
| **GeoRef AR** | Normaliza dirección y localidad y devuelve coordenadas | <https://apis.datos.gob.ar/georef/api> |
| **Open-Meteo** | Clima actual (temperatura, viento) según coordenadas; no requiere API key | <https://open-meteo.com/> |

### 🗄️ Base de datos

Tabla `pedidos` (script completo en [backend/schema.sql](backend/schema.sql)): `id` (PK serial), `cliente_nombre`, `direccion_destino`, `localidad`, `provincia`, `producto`, `latitud`, `longitud`, `temperatura_clima`, `velocidad_viento`, `estado` (por defecto `Pendiente`) y `created_at`.

### 📂 Estructura

```text
logitrack-dispatch-manager/
├── backend/
│   ├── index.js              # Punto de entrada (app.listen)
│   ├── schema.sql            # Script de creación de la tabla
│   └── src/
│       ├── app.js            # Express, CORS, /api/health
│       ├── config/db.js      # Conexión PostgreSQL (Neon)
│       ├── routes/           # /api/pedidos
│       ├── controllers/      # Lógica de pedidos
│       └── services/         # georefService.js, weatherService.js
└── frontend/
    ├── public/               # Logo y estáticos
    └── src/
        ├── components/       # Navbar, PedidoForm, PedidoList
        ├── context/          # LanguageContext, ThemeContext
        ├── locales/          # es.js, en.js
        ├── services/         # pedidosService.js (cliente HTTP)
        ├── App.jsx
        └── index.css
```

### 🚀 Instalación local

Requisitos: Node.js 20+, pnpm y una base PostgreSQL (por ejemplo, un proyecto gratuito en [Neon](https://neon.tech)).

```bash
git clone https://github.com/Hans-Rafael/logitrack-dispatch-manager.git
cd logitrack-dispatch-manager
```

**1. Base de datos:** ejecuta [backend/schema.sql](backend/schema.sql) en tu base (consola SQL de Neon o `psql`).

**2. Backend**

```bash
cd backend
pnpm install
cp .env.example .env
```

Edita `backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@host/neondb?sslmode=require
```

```bash
pnpm dev          # desarrollo (node --watch)
pnpm run db-conex # opcional: prueba la conexión a la base
```

**3. Frontend** (en otra terminal)

```bash
cd frontend
pnpm install
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api
pnpm dev
```

### 📡 Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/pedidos` | Lista todos los despachos |
| GET | `/api/pedidos/:id` | Obtiene un despacho |
| POST | `/api/pedidos` | Crea un despacho (GeoRef + clima) |
| PATCH | `/api/pedidos/:id` | Actualiza el estado |
| DELETE | `/api/pedidos/:id` | Elimina un despacho |

### ☁️ Despliegue

1. **Base de datos (Neon):** crea el proyecto y ejecuta `backend/schema.sql`. Copia la cadena de conexión.
2. **Backend (Render / Railway):** Root Directory `backend` · Build `pnpm install` · Start `pnpm start` · variables `DATABASE_URL` y `PORT`.
3. **Frontend (Vercel / Netlify):** Root Directory `frontend` · Build `pnpm run build` · Output `dist` · variable `VITE_API_URL` = `https://tu-api.onrender.com/api`.

> `VITE_API_URL` se incrusta al compilar: si cambias la URL del backend, vuelve a desplegar el frontend.

---

## 🇬🇧 English

**LogiTrack** is a full-stack web app for managing and tracking logistics shipments. When a shipment is created, the system fetches the destination coordinates from Argentina's official **GeoRef** API, gets current weather from **Open-Meteo**, and stores everything in **PostgreSQL (Neon)**.

### ✨ Features

- **Full CRUD:** create shipments, list them, update status (`Pendiente`, `En camino`, `Entregado`, `Cancelado`) and delete with confirmation.
- **Automatic enrichment:** geolocation (GeoRef AR → `latitud`, `longitud`) and destination weather (Open-Meteo → temperature and wind).
- **Combined client-side search and filters** (client, product, address, city + status) with live counters.
- **Health check:** `GET /api/health` polled every 30 s; the Navbar shows whether the API is up.
- **ES / EN i18n** via `LanguageContext`, dictionaries in `locales/`, preference saved in `localStorage`.
- **Light / dark mode** via `ThemeContext`, Tailwind v4 (`@custom-variant dark`) and persisted preference.

### 🏗️ Architecture

See the diagram above. `POST /api/pedidos` flow: validation → GeoRef (address + city → lat/lon, province) → Open-Meteo (lat/lon → temperature/wind) → parameterized SQL `INSERT` → JSON response. The backend is layered as `routes → controllers → services`, and the frontend uses React Context for language and theme.

### 🔌 External integrations

| Service | Purpose |
|---|---|
| **GeoRef AR** | Normalizes address/city and returns coordinates |
| **Open-Meteo** | Current weather by coordinates; no API key required |

### 🗄️ Database

Table `pedidos`; full script in [backend/schema.sql](backend/schema.sql).

### 🚀 Local setup

Requirements: Node.js 20+, pnpm and a PostgreSQL database (e.g. a free [Neon](https://neon.tech) project).

```bash
git clone https://github.com/Hans-Rafael/logitrack-dispatch-manager.git
cd logitrack-dispatch-manager

# Database: run backend/schema.sql in your database

cd backend && pnpm install && cp .env.example .env   # set DATABASE_URL and PORT
pnpm dev

# In another terminal
cd frontend && pnpm install && cp .env.example .env  # VITE_API_URL=http://localhost:3000/api
pnpm dev
```

### 📡 Endpoints

`GET /api/health` · `GET /api/pedidos` · `GET /api/pedidos/:id` · `POST /api/pedidos` · `PATCH /api/pedidos/:id` · `DELETE /api/pedidos/:id`

### ☁️ Deployment

1. **Database (Neon):** create the project, run `backend/schema.sql`, copy the connection string.
2. **Backend (Render / Railway):** Root Directory `backend` · Build `pnpm install` · Start `pnpm start` · env vars `DATABASE_URL`, `PORT`.
3. **Frontend (Vercel / Netlify):** Root Directory `frontend` · Build `pnpm run build` · Output `dist` · env var `VITE_API_URL` = your public backend URL + `/api`.

---

## 👨‍💻 Autor / Author

**Hans Rafael García Vekoni** · [GitHub](https://github.com/Hans-Rafael)
