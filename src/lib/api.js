// ============================================================
// KUXAAN — Cliente API (capa adaptadora)
// ============================================================
// Este archivo es el ÚNICO punto donde se traduce el contrato real
// del backend (español, envoltorio { exito, mensaje, datos }, roles en
// MAYÚSCULAS) a las formas limpias que consumen los componentes React.
//
// Si el frontend se refactoriza en el futuro, solo se reorganizan los
// componentes: este adaptador y el backend NO se vuelven a tocar.
//
//   import { auth, students, projects } from './lib/api';
//
//   const { role } = await auth.login(email, password);
//   const lista = await students.list();
// ============================================================

import axios from 'axios';

// URL base del backend. Cámbiala en el archivo .env cuando despliegues.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'kuxaan_token';
const ROLE_KEY = 'kuxaan_role';
const USER_KEY = 'kuxaan_user';

// Cliente axios con interceptor que adjunta el JWT automáticamente
// en cada petición.
const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Si el backend responde 401 (token expirado o inválido), borramos la sesión
// y avisamos a la app para que devuelva al usuario al login.
client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      session.clear();
      notificarExpiracion();
    }
    return Promise.reject(err);
  }
);

// ============================================================
// Helpers de contrato
// ============================================================
// El backend siempre responde { exito, mensaje, datos }. `datos` extrae
// el payload real de cualquier respuesta.
const datos = (r) => r.data?.datos;

// El backend usa ADMINISTRADOR / ESTUDIANTE; la UI usa admin / student.
const aRolUI = (rol) => (rol === 'ADMINISTRADOR' ? 'admin' : 'student');

// Mensaje de error legible a partir de una respuesta de axios.
export const mensajeError = (err) =>
  err?.response?.data?.mensaje || err?.message || 'Ocurrió un error inesperado';

// ============================================================
// Normalizadores (backend camelCase español → shape limpio para la UI)
// ============================================================
const mapStudent = (a) => ({
  id: a.idAlumno,
  name: a.nombreCompleto,
  career: a.carrera,
  uni: a.universidad,
  period: a.periodoAcademico,
  phone: a.telefono,
  status: a.estado,
  email: a.usuario?.email ?? a.email ?? null,
  hours: a.totalHoras ?? null,
  requiredHours: a.horasRequeridas ?? 240,
});

const mapProject = (p) => ({
  id: p.idProyecto,
  name: p.nombreProyecto,
  objective: p.objetivo,
  community: p.comunidadBeneficiada,
  responsible: p.responsable,
  startDate: p.fechaInicio,
  endDate: p.fechaTermino,
  status: p.estado,
});

const mapHour = (r) => ({
  id: r.idRegistro,
  studentId: r.idAlumno,
  student: r.alumno?.nombreCompleto ?? null,
  projectId: r.idProyecto,
  project: r.proyecto?.nombreProyecto ?? null,
  date: r.fechaRegistro,
  hours: r.cantidadHoras,
  description: r.descripcion,
});

const mapEvidence = (e) => ({
  id: e.idEvidencia,
  studentId: e.idAlumno,
  student: e.alumno?.nombreCompleto ?? null,
  projectId: e.idProyecto,
  project: e.proyecto?.nombreProyecto ?? null,
  file: e.nombreArchivo,
  type: e.tipoArchivo,
  url: e.urlArchivo,
  date: e.fechaSubida,
});

const mapAssignment = (a) => ({
  id: a.idAsignacion,
  studentId: a.alumno?.idAlumno,
  student: a.alumno?.nombreCompleto,
  projectId: a.proyecto?.idProyecto,
  project: a.proyecto?.nombreProyecto,
  date: a.fechaAsignacion,
});

// Perfil propio del estudiante (GET /students/me). Normaliza también sus
// proyectos para que la UI use un solo shape en toda la app.
const mapProfile = (p) => ({
  id: p.idAlumno,
  name: p.nombreCompleto,
  career: p.carrera,
  uni: p.universidad,
  period: p.periodoAcademico,
  phone: p.telefono,
  status: p.estado,
  email: p.email,
  hours: p.totalHoras ?? 0,
  requiredHours: p.horasRequeridas ?? 240,
  evidenceCount: p.totalEvidencias ?? 0,
  projects: (p.proyectos || []).map(mapProject),
});

// ============================================================
// Sesión
// ============================================================
// Suscriptores que quieren enterarse de que el token dejó de ser válido.
// La app registra uno para volver al login sin dejar una pantalla rota.
const suscriptoresExpiracion = new Set();

function notificarExpiracion() {
  suscriptoresExpiracion.forEach((cb) => cb());
}

export const session = {
  save: ({ token, role, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  get: () => {
    const raw = localStorage.getItem(USER_KEY);
    return {
      token: localStorage.getItem(TOKEN_KEY),
      role: localStorage.getItem(ROLE_KEY),
      user: raw ? JSON.parse(raw) : null,
    };
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
  },
  // Registra un callback para cuando la sesión expire. Devuelve la función
  // para darse de baja (útil como cleanup de useEffect).
  onExpire: (cb) => {
    suscriptoresExpiracion.add(cb);
    return () => suscriptoresExpiracion.delete(cb);
  },
};

// ============================================================
// AUTH
// ============================================================
export const auth = {
  // Backend espera { email, contrasena } y responde
  // datos: { token, usuario: { rol, idAlumno, nombreCompleto, ... } }
  login: async (email, password) => {
    const r = await client.post('/auth/login', { email, contrasena: password });
    const { token, usuario } = datos(r);
    const role = aRolUI(usuario.rol);
    const user = {
      id: usuario.idUsuario,
      email: usuario.email,
      name: usuario.nombreCompleto,
      studentId: usuario.idAlumno,
      role,
    };
    session.save({ token, role, user });
    return { token, role, user };
  },
  logout: () => session.clear(),

  // Cambio de contraseña del usuario autenticado (cualquier rol).
  changePassword: (current, next) =>
    client
      .put('/auth/password', { contrasenaActual: current, contrasenaNueva: next })
      .then((r) => datos(r)),

  // Alta de otro administrador (solo admin).
  registerAdmin: (email, password) =>
    client.post('/auth/register', { email, contrasena: password }).then((r) => datos(r)),
};

// ============================================================
// ESTUDIANTES   (admin)
// ============================================================
export const students = {
  list: () => client.get('/students').then((r) => datos(r).map(mapStudent)),
  get: (id) => client.get(`/students/${id}`).then((r) => mapStudent(datos(r))),
  // data: { name, email, password, career, uni, period, phone, status, requiredHours }
  create: (data) =>
    client
      .post('/students', {
        email: data.email,
        contrasena: data.password,
        nombreCompleto: data.name,
        carrera: data.career,
        universidad: data.uni,
        periodoAcademico: data.period,
        telefono: data.phone,
        estado: data.status,
        horasRequeridas: data.requiredHours,
      })
      .then((r) => datos(r)),
  update: (id, data) =>
    client
      .put(`/students/${id}`, {
        nombreCompleto: data.name,
        carrera: data.career,
        universidad: data.uni,
        periodoAcademico: data.period,
        telefono: data.phone,
        estado: data.status,
        horasRequeridas: data.requiredHours,
      })
      .then((r) => datos(r)),
  remove: (id) => client.delete(`/students/${id}`).then((r) => datos(r)),
  // El admin restablece la contraseña de un estudiante.
  resetPassword: (id, password) =>
    client.put(`/students/${id}/password`, { contrasenaNueva: password }).then((r) => datos(r)),
};

// ============================================================
// PROYECTOS
// ============================================================
export const projects = {
  list: () => client.get('/projects').then((r) => datos(r).map(mapProject)),
  get: (id) => client.get(`/projects/${id}`).then((r) => mapProject(datos(r))),
  // data: { name, objective, community, responsible, startDate, endDate, status }
  create: (data) =>
    client
      .post('/projects', {
        nombreProyecto: data.name,
        objetivo: data.objective,
        comunidadBeneficiada: data.community,
        responsable: data.responsible,
        fechaInicio: data.startDate,
        fechaTermino: data.endDate,
        estado: data.status,
      })
      .then((r) => datos(r)),
  update: (id, data) =>
    client
      .put(`/projects/${id}`, {
        nombreProyecto: data.name,
        objetivo: data.objective,
        comunidadBeneficiada: data.community,
        responsable: data.responsible,
        fechaInicio: data.startDate,
        fechaTermino: data.endDate,
        estado: data.status,
      })
      .then((r) => datos(r)),
  studentsOf: (id) =>
    client.get(`/projects/${id}/students`).then((r) => datos(r).map(mapStudent)),
  remove: (id) => client.delete(`/projects/${id}`).then((r) => datos(r)),
};

// ============================================================
// ASIGNACIONES   (admin)
// ============================================================
// El backend asigna de a uno { idAlumno, idProyecto }. El adaptador acepta
// el batch de la UI { projectId, studentIds:[...] } e itera. Usa allSettled
// para que un duplicado no cancele el resto.
export const assignments = {
  list: () => client.get('/assignments').then((r) => datos(r).map(mapAssignment)),
  create: async ({ projectId, studentIds = [] }) => {
    const resultados = await Promise.allSettled(
      studentIds.map((idAlumno) =>
        client.post('/assignments', { idAlumno, idProyecto: projectId })
      )
    );
    return {
      asignados: resultados.filter((x) => x.status === 'fulfilled').length,
      fallidos: resultados.filter((x) => x.status === 'rejected').length,
    };
  },
  remove: (id) => client.delete(`/assignments/${id}`).then((r) => datos(r)),
};

// ============================================================
// HORAS
// ============================================================
export const hours = {
  // admin ve todas; estudiante ve solo las suyas (lo decide el backend con el rol)
  list: () => client.get('/hours').then((r) => datos(r).map(mapHour)),
  // data: { projectId, hours, description, date, studentId? (solo admin) }
  create: (data) =>
    client
      .post('/hours', {
        idProyecto: data.projectId,
        cantidadHoras: data.hours,
        descripcion: data.description,
        fechaRegistro: data.date,
        idAlumno: data.studentId, // ignorado por el backend si es estudiante
      })
      .then((r) => datos(r)),
  update: (id, data) =>
    client
      .put(`/hours/${id}`, {
        cantidadHoras: data.hours,
        descripcion: data.description,
        fechaRegistro: data.date,
      })
      .then((r) => datos(r)),
  remove: (id) => client.delete(`/hours/${id}`).then((r) => datos(r)),
};

// ============================================================
// EVIDENCIAS  (con subida de archivos)
// ============================================================
export const evidence = {
  list: () => client.get('/evidence').then((r) => datos(r).map(mapEvidence)),

  // Recibe un File (input type=file) y lo manda como multipart/form-data.
  // El backend espera el campo de archivo llamado "archivo" y el body idProyecto.
  upload: (file, { projectId, studentId } = {}) => {
    const fd = new FormData();
    fd.append('archivo', file);
    if (projectId) fd.append('idProyecto', projectId);
    if (studentId) fd.append('idAlumno', studentId); // solo admin
    return client
      .post('/evidence', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => datos(r));
  },

  // El archivo viaja autenticado (el token va en el header), así que no se
  // puede usar un <a href> directo: se pide como blob y se descarga.
  download: async (id, filename = 'evidencia') => {
    try {
      const r = await client.get(`/evidence/${id}/file`, { responseType: 'blob' });
      descargarBlob(r.data, filename);
    } catch (err) {
      // Con responseType 'blob' el cuerpo de error también llega como Blob;
      // lo convertimos a JSON para que mensajeError siga funcionando.
      const cuerpo = err?.response?.data;
      if (cuerpo instanceof Blob) {
        const texto = await cuerpo.text();
        try {
          err.response.data = JSON.parse(texto);
        } catch {
          err.response.data = { mensaje: texto };
        }
      }
      throw err;
    }
  },

  remove: (id) => client.delete(`/evidence/${id}`).then((r) => datos(r)),
};

// ============================================================
// REPORTES   (el backend entrega JSON; la UI lo renderiza / exporta CSV)
// ============================================================
export const reports = {
  byStudent: () => client.get('/reports/students').then((r) => datos(r)),
  byProject: () => client.get('/reports/projects').then((r) => datos(r)),
  hours: () => client.get('/reports/hours').then((r) => datos(r)),
  evidence: () => client.get('/reports/evidence').then((r) => datos(r)),
  general: () => client.get('/reports/general').then((r) => datos(r)),
};

// Dispara la descarga de un blob en el navegador. Lo usan tanto la
// exportación a CSV como la descarga de evidencias.
function descargarBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Exporta un arreglo de objetos planos a CSV y dispara la descarga.
export const downloadCSV = (rows, filename = 'reporte.csv') => {
  if (!Array.isArray(rows) || rows.length === 0) return;
  const columnas = Object.keys(rows[0]);
  const escapar = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const contenido = [
    columnas.join(','),
    ...rows.map((fila) => columnas.map((c) => escapar(fila[c])).join(',')),
  ].join('\n');
  descargarBlob(new Blob([contenido], { type: 'text/csv;charset=utf-8;' }), filename);
};

// ============================================================
// DASHBOARD (admin)
// ============================================================
export const dashboard = {
  stats: () => client.get('/dashboard/stats').then((r) => datos(r)),
};

// ============================================================
// AUTO-SERVICIO DEL ESTUDIANTE
// ============================================================
export const me = {
  profile: () => client.get('/students/me').then((r) => mapProfile(datos(r))),
  projects: () => client.get('/students/me/project').then((r) => datos(r).map(mapProject)),
  // El estudiante actualiza sus propios datos de contacto.
  update: (data) =>
    client
      .put('/students/me', {
        nombreCompleto: data.name,
        carrera: data.career,
        universidad: data.uni,
        periodoAcademico: data.period,
        telefono: data.phone,
      })
      .then((r) => datos(r)),
};

export default client;
