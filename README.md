# KUXAAN — Frontend

Plataforma web para la gestión de servicio social comunitario.
Construida con **React + Vite + Tailwind CSS**.

---

## 🚀 Cómo correrlo

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de configuración
cp .env.example .env

# 3. Levantar el servidor de desarrollo
npm run dev
```

Abre **http://localhost:5173** en el navegador.

En el login encontrarás dos botones de demo (Administrador / Estudiante)
que te dejan entrar sin backend para explorar las pantallas.

---

## 📁 Estructura

```
kuxaan-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          ← Componente principal con TODAS las pantallas
│   ├── main.jsx         ← Punto de entrada
│   ├── index.css        ← Tailwind
│   └── lib/
│       └── api.js       ← Cliente axios (LISTO para conectar al backend)
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

---

## 🔌 Conectar al backend

Toda la lógica para hablar con el backend está en **`src/lib/api.js`**,
organizada por módulo (`auth`, `students`, `projects`, `hours`, etc).

### Paso 1 — Configurar la URL del backend

En `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

### Paso 2 — Usar el cliente en cualquier componente

```javascript
import { auth, students } from './lib/api';

// Login
const { token, role } = await auth.login('correo@kuxaan.org', 'password');

// Listar estudiantes
const lista = await students.list();

// Crear estudiante
await students.create({ name: 'Pedro Cetina', career: 'Sistemas', ... });
```

### Paso 3 — Reemplazar los botones de demo del login

En `src/App.jsx`, busca el componente `Login` y cambia los botones
de demo por una llamada real:

```javascript
import { auth } from './lib/api';

const handleLogin = async () => {
  try {
    const { role } = await auth.login(email, password);
    onLogin(role);  // 'admin' o 'student'
  } catch (e) {
    alert('Credenciales incorrectas');
  }
};
```

---

## 🧩 Endpoints que espera el cliente

El archivo `src/lib/api.js` ya tiene definidos todos los endpoints
que el backend debe exponer. Tu backend Node.js debe implementarlos
en **`http://localhost:3000/api`**:

| Método | Ruta                          | Descripción                       |
| ------ | ----------------------------- | --------------------------------- |
| POST   | `/auth/login`                 | Autenticación, devuelve JWT y rol |
| GET    | `/students`                   | Lista de estudiantes              |
| POST   | `/students`                   | Crear estudiante                  |
| PUT    | `/students/:id`               | Actualizar estudiante             |
| DELETE | `/students/:id`               | Eliminar estudiante               |
| GET    | `/projects`                   | Lista de proyectos                |
| POST   | `/projects`                   | Crear proyecto                    |
| GET    | `/projects/:id/students`      | Estudiantes asignados a proyecto  |
| POST   | `/assignments`                | Asignar estudiantes a proyecto    |
| GET    | `/hours`                      | Registros de horas                |
| POST   | `/hours`                      | Registrar horas                   |
| GET    | `/evidence`                   | Lista de evidencias               |
| POST   | `/evidence` (multipart)       | Subir archivo de evidencia        |
| GET    | `/reports/general?format=pdf` | Descargar reporte general         |
| GET    | `/dashboard/stats`            | Métricas del panel admin          |
| GET    | `/student/me`                 | Datos del estudiante logueado     |

---

## 🎨 Identidad visual

- **Color primario:** `#1E3A2F` (jade) — `kuxaan-jade` en Tailwind
- **Color de acento:** `#C16E4F` (terracota) — `kuxaan-terracota`
- **Fondo:** `#F2EBDD` (papel/crema) — `kuxaan-cream`
- **Tipografía display:** Fraunces (Google Fonts, ya incluida)
- **Tipografía cuerpo:** DM Sans (Google Fonts, ya incluida)

---

## ⚠️ CORS en desarrollo

Cuando conectes el backend, asegúrate de que tu servidor Node.js
permita peticiones desde `http://localhost:5173`. En Express:

```javascript
import cors from 'cors';
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
```

Si no quieres lidiar con CORS en desarrollo, abre `vite.config.js`
y descomenta el bloque `proxy` que ya está preparado.

---

## 📦 Build para producción

```bash
npm run build       # genera dist/
npm run preview     # prueba el build localmente
```

---

## 🛠️ Stack

- **React 18** — UI
- **Vite 5** — bundler / dev server
- **Tailwind CSS 3** — estilos utility-first
- **lucide-react** — iconos
- **axios** — peticiones HTTP

---

**KUXAAN** · *Maya: estar vivo* · Servicio Social Comunitario · Mérida, Yucatán
