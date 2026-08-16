# KUXAAN — Frontend

Plataforma web para la gestión de servicio social comunitario.
Construida con **React + Vite + Tailwind CSS** y conectada al backend
`PlataformaKuxaan_backend`.

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

> El backend debe estar corriendo en `http://localhost:3000` (o en la URL que
> configures en `.env`). **No hay modo de demostración sin backend**: el login
> valida las credenciales contra la API real.

---

## 🔐 Inicio de sesión

Hay **un solo formulario de login para los dos roles**. El backend responde con
el rol dentro del JWT y la aplicación decide qué panel montar:

| Rol en el backend | Vista que se monta | Secciones |
| ----------------- | ------------------ | --------- |
| `ADMINISTRADOR`   | `AdminShell`       | Panel general, Estudiantes, Proyectos, Asignaciones, Control de horas, Evidencias, Reportes, Mi cuenta |
| `ESTUDIANTE`      | `StudentShell`     | Inicio, Mi perfil, Mi proyecto, Registrar horas, Subir evidencias, Mi cuenta |

Las cuentas de estudiante **las crea el administrador** desde la sección
Estudiantes; no existe auto-registro. Si un estudiante olvida su contraseña, el
administrador la restablece desde la misma tabla.

La sesión se guarda en `localStorage`. Si el backend responde `401` (token
expirado), el adaptador limpia la sesión y la app regresa al login sola.

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
│       └── api.js       ← Cliente axios + adaptador del contrato del backend
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

---

## 🔌 Cómo habla con el backend

Toda la comunicación pasa por **`src/lib/api.js`**, que es la única capa donde
se traduce el contrato real del backend (español, envoltorio
`{ exito, mensaje, datos }`, roles en mayúsculas) a las formas limpias que
consumen los componentes.

```javascript
import { auth, students, me } from './lib/api';

const { role } = await auth.login('admin@kuxaan.com', 'Admin123');
const lista    = await students.list();   // [{ id, name, career, hours, ... }]
const perfil   = await me.profile();      // { name, hours, requiredHours, projects: [...] }
```

Los normalizadores (`mapStudent`, `mapProject`, `mapProfile`, …) garantizan que
**ningún componente vea campos crudos de Prisma**. Si el backend cambia un
nombre de campo, se ajusta solo aquí.

### Configurar la URL del backend

En `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

---

## 🧩 Endpoints que consume

| Método | Ruta | Usado en |
| ------ | ---- | -------- |
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Mi cuenta → Nuevo administrador |
| PUT | `/auth/password` | Mi cuenta → Cambiar contraseña |
| GET / POST | `/students` | Tabla de estudiantes y alta |
| PUT / DELETE | `/students/:id` | Editar y eliminar estudiante |
| PUT | `/students/:id/password` | Restablecer contraseña de un estudiante |
| GET / PUT | `/students/me` | Perfil del estudiante y su edición |
| GET | `/students/me/project` | Selector de proyecto del estudiante |
| GET / POST | `/projects` | Tarjetas de proyectos y alta |
| GET / PUT / DELETE | `/projects/:id` | Detalle, edición y borrado |
| GET | `/projects/:id/students` | Estudiantes asignados (detalle y "Mi proyecto") |
| GET / POST / DELETE | `/assignments` | Asignar y desasignar estudiantes |
| GET / POST | `/hours` | Control de horas y registro |
| PUT / DELETE | `/hours/:id` | Editar y eliminar registros |
| GET / POST | `/evidence` | Galería de evidencias y carga |
| GET | `/evidence/:id/file` | Descargar el archivo |
| DELETE | `/evidence/:id` | Eliminar evidencia |
| GET | `/reports/{students,projects,hours,evidence,general}` | Exportación a CSV |
| GET | `/dashboard/stats` | Métricas del panel admin |

---

## 🎨 Identidad visual

- **Color primario:** `#1E3A2F` (jade) — `kuxaan-jade` en Tailwind
- **Color de acento:** `#C16E4F` (terracota) — `kuxaan-terracota`
- **Fondo:** `#F2EBDD` (papel/crema) — `kuxaan-cream`
- **Tipografía display:** Fraunces (Google Fonts, ya incluida)
- **Tipografía cuerpo:** DM Sans (Google Fonts, ya incluida)

---

## ⚠️ CORS en desarrollo

El backend ya usa `cors()` abierto, así que en desarrollo local no hace falta
configurar nada. Si lo restringes al desplegar, permite el origen del frontend:

```javascript
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
```

Alternativamente, abre `vite.config.js` y descomenta el bloque `proxy` que ya
está preparado.

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
