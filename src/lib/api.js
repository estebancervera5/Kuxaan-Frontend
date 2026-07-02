// ============================================================
// KUXAAN — Cliente API
// ============================================================
// Aquí está toda la lógica para hablar con el backend.
// Cuando el backend esté listo, importa lo que necesites
// directamente desde este archivo:
//
//   import { auth, students, projects } from './lib/api';
//
//   const { token, role } = await auth.login(email, password);
//   const lista = await students.list();
// ============================================================

import axios from 'axios';

// URL base del backend. Cámbiala en el archivo .env cuando despliegues.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'kuxaan_token';

// Cliente axios con interceptor que adjunta el JWT automáticamente
// en cada petición.
const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Si el backend responde 401 (token expirado o inválido),
// borramos el token y mandamos al usuario al login.
client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Aquí podrías hacer un redirect global si lo necesitas
    }
    return Promise.reject(err);
  }
);

// ============================================================
// Helpers para guardar/leer la sesión
// ============================================================
export const session = {
  save:  ({ token, role }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('kuxaan_role', role);
  },
  get:   () => ({
    token: localStorage.getItem(TOKEN_KEY),
    role:  localStorage.getItem('kuxaan_role'),
  }),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('kuxaan_role');
  },
};

// ============================================================
// AUTH
// ============================================================
export const auth = {
  login: async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    session.save(data);
    return data; // { token, role: 'admin' | 'student', user }
  },
  logout: () => session.clear(),
};

// ============================================================
// ESTUDIANTES   (admin)
// ============================================================
export const students = {
  list:   ()       => client.get('/students').then(r => r.data),
  get:    (id)     => client.get(`/students/${id}`).then(r => r.data),
  create: (data)   => client.post('/students', data).then(r => r.data),
  update: (id, d)  => client.put(`/students/${id}`, d).then(r => r.data),
  remove: (id)     => client.delete(`/students/${id}`).then(r => r.data),
};

// ============================================================
// PROYECTOS
// ============================================================
export const projects = {
  list:   ()       => client.get('/projects').then(r => r.data),
  get:    (id)     => client.get(`/projects/${id}`).then(r => r.data),
  create: (data)   => client.post('/projects', data).then(r => r.data),
  update: (id, d)  => client.put(`/projects/${id}`, d).then(r => r.data),
  remove: (id)     => client.delete(`/projects/${id}`).then(r => r.data),
  studentsOf: (id) => client.get(`/projects/${id}/students`).then(r => r.data),
};

// ============================================================
// ASIGNACIONES   (admin)
// ============================================================
export const assignments = {
  // body: { project_id, student_ids: [1,2,3] }
  create: (body) => client.post('/assignments', body).then(r => r.data),
};

// ============================================================
// HORAS
// ============================================================
export const hours = {
  // admin ve todas; estudiante ve solo las suyas (lo decide el backend con el rol)
  list:   (params)  => client.get('/hours', { params }).then(r => r.data),
  // body: { project_id, date, hours, description }
  create: (data)    => client.post('/hours', data).then(r => r.data),
  update: (id, d)   => client.put(`/hours/${id}`, d).then(r => r.data),
  remove: (id)      => client.delete(`/hours/${id}`).then(r => r.data),
};

// ============================================================
// EVIDENCIAS  (con subida de archivos)
// ============================================================
export const evidence = {
  list: () => client.get('/evidence').then(r => r.data),

  // Recibe un File (input type=file) y lo manda con multipart/form-data
  upload: (file, { project_id, description } = {}) => {
    const fd = new FormData();
    fd.append('file', file);
    if (project_id)  fd.append('project_id',  project_id);
    if (description) fd.append('description', description);
    return client.post('/evidence', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  remove: (id) => client.delete(`/evidence/${id}`).then(r => r.data),
};

// ============================================================
// REPORTES   (descarga de PDF / Excel)
// ============================================================
// Como el backend devuelve un blob, manejamos la descarga aquí.
const downloadBlob = async (url, filename) => {
  const res = await client.get(url, { responseType: 'blob' });
  const blob = new Blob([res.data]);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const reports = {
  general:    (fmt = 'pdf') => downloadBlob(`/reports/general?format=${fmt}`,    `reporte-general.${fmt}`),
  byStudent:  (fmt = 'pdf') => downloadBlob(`/reports/by-student?format=${fmt}`, `reporte-estudiantes.${fmt}`),
  byProject:  (fmt = 'pdf') => downloadBlob(`/reports/by-project?format=${fmt}`, `reporte-proyectos.${fmt}`),
  hours:      (fmt = 'pdf') => downloadBlob(`/reports/hours?format=${fmt}`,      `reporte-horas.${fmt}`),
  evidence:   (fmt = 'pdf') => downloadBlob(`/reports/evidence?format=${fmt}`,   `reporte-evidencias.${fmt}`),
};

// ============================================================
// DASHBOARD / Datos del usuario actual
// ============================================================
export const dashboard = {
  stats:   ()  => client.get('/dashboard/stats').then(r => r.data),
};

export const me = {
  profile: ()  => client.get('/student/me').then(r => r.data),         // estudiante
  project: ()  => client.get('/student/me/project').then(r => r.data), // estudiante
};

export default client;
