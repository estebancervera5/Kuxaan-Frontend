import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Users, FolderKanban, GitBranch, Clock, FileImage,
  FileBarChart, LogOut, Search, Plus, ChevronRight, ShieldCheck,
  Upload, Calendar, Filter, Download, Edit3, Trash2, User,
  Mail, Lock, ArrowRight, TrendingUp, CheckCircle2, MapPin
} from 'lucide-react';
import * as api from './lib/api';

// ============================================================
// KUXAAN — Plataforma de Servicio Social
// Frontend · React + Tailwind · conectado al backend vía lib/api
// ============================================================

// Hook mínimo para cargar datos del backend con estado de carga/error.
// `recargar()` fuerza una nueva petición (útil tras crear/eliminar).
function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let vivo = true;
    setLoading(true);
    Promise.resolve(fetcher())
      .then((d) => { if (vivo) { setData(d); setError(null); } })
      .catch((e) => { if (vivo) setError(api.mensajeError(e)); })
      .finally(() => { if (vivo) setLoading(false); });
    return () => { vivo = false; };
  }, [...deps, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, loading, error, recargar: () => setTick((t) => t + 1) };
}

// Estado visual reutilizable para carga / error / vacío.
const EstadoDatos = ({ loading, error, empty, children }) => {
  if (loading) return <p className="text-sm opacity-50 py-8">Cargando…</p>;
  if (error) return <p className="text-sm py-8" style={{ color: '#9F5235' }}>Error: {error}</p>;
  if (empty) return <p className="text-sm opacity-50 py-8">Sin registros todavía.</p>;
  return children;
};

const KUXAAN = () => {
  // Restaura la sesión guardada (si hay token) al cargar la app.
  const sesionInicial = api.session.get();
  const [view, setView] = useState(sesionInicial.token ? sesionInicial.role : 'login');
  const [user, setUser] = useState(sesionInicial.user);
  const [adminPage, setAdminPage] = useState('dashboard');
  const [studentPage, setStudentPage] = useState('dashboard');

  const handleLogin = (result) => {
    setUser(result.user);
    setView(result.role);
  };
  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    setView('login');
  };

  // Si el backend invalida el token (401), el adaptador ya borró la sesión;
  // aquí devolvemos al usuario al login en lugar de dejarlo en una vista rota.
  useEffect(() => api.session.onExpire(() => {
    setUser(null);
    setView('login');
  }), []);

  return (
    <div className="min-h-screen w-full" style={{ background: '#F2EBDD' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=DM+Sans:opsz,wght@9..40,300..700&display=swap');
        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-body    { font-family: 'DM Sans', sans-serif; font-optical-sizing: auto; }
        .kx-grid-pattern {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(30,58,47,0.08) 1px, transparent 0);
          background-size: 18px 18px;
        }
      `}</style>

      <div className="font-body" style={{ color: '#1A1A17' }}>
        {view === 'login'   && <Login onLogin={handleLogin} />}
        {view === 'admin'   && (
          <AdminShell page={adminPage} setPage={setAdminPage} user={user} onLogout={handleLogout} />
        )}
        {view === 'student' && (
          <StudentShell page={studentPage} setPage={setStudentPage} user={user} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
};

// ============================================================
// LOGIN
// ============================================================
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) { setError('Ingresa tu correo y contraseña'); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await api.auth.login(email, password);
      onLogin(result);
    } catch (err) {
      setError(api.mensajeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side — Brand */}
      <div
        className="hidden lg:flex flex-col justify-between p-8 xl:p-12 w-1/2 relative overflow-hidden"
        style={{ background: '#1E3A2F', color: '#F2EBDD' }}
      >
        <div className="absolute inset-0 kx-grid-pattern opacity-40" />
        {/* Decorative glyph */}
        <svg
          viewBox="0 0 400 400"
          className="absolute -right-20 -bottom-20 w-[560px] opacity-[0.07]"
          fill="none"
        >
          <circle cx="200" cy="200" r="180" stroke="#F2EBDD" strokeWidth="2" />
          <circle cx="200" cy="200" r="120" stroke="#F2EBDD" strokeWidth="2" />
          <circle cx="200" cy="200" r="60"  stroke="#F2EBDD" strokeWidth="2" />
          <path d="M40 200 L360 200 M200 40 L200 360" stroke="#F2EBDD" strokeWidth="2" />
          <rect x="180" y="180" width="40" height="40" stroke="#F2EBDD" strokeWidth="2" />
        </svg>

        <div className="relative z-10 flex items-center gap-3">
          <KxMark />
          <span className="font-display text-2xl tracking-tight" style={{ color: '#F2EBDD' }}>
            kuxaan
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: '#C16E4F' }}>
            Maya · estar vivo
          </p>
          <h1 className="font-display text-4xl xl:text-6xl leading-[1.05] tracking-tight">
            La plataforma del <em className="italic font-light">servicio social</em> que da vida a los proyectos comunitarios.
          </h1>
          <p className="text-sm opacity-70 leading-relaxed max-w-sm">
            Gestiona estudiantes, proyectos, horas y evidencias en un solo lugar.
            Diseñado para organizaciones que trabajan con la comunidad.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs opacity-60">
          <MapPin size={14} /> Mérida, Yucatán
        </div>
      </div>

      {/* Right side — Form */}
      <div className="flex-1 flex items-center justify-center px-5 py-8 sm:p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <KxMark dark />
            <span className="font-display text-2xl tracking-tight">kuxaan</span>
          </div>

          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: '#C16E4F' }}>
            Iniciar sesión
          </p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-2">Bienvenido de vuelta.</h2>
          <p className="text-sm opacity-60 mb-10">
            Ingresa tus credenciales para acceder a tu panel.
          </p>

          <div className="space-y-5">
            <Field icon={<Mail size={16} />} label="Correo electrónico">
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-sm py-1"
              />
            </Field>

            <Field icon={<Lock size={16} />} label="Contraseña">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                className="w-full bg-transparent outline-none text-sm py-1"
              />
            </Field>

            <p className="text-xs opacity-60 pt-2 leading-relaxed">
              ¿Olvidaste tu contraseña? Solicita a la coordinación que la restablezca
              desde el panel administrativo.
            </p>
          </div>

          {error && (
            <div
              className="mt-6 px-4 py-3 rounded-md text-sm"
              style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}
            >
              {error}
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={submit}
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all disabled:opacity-60"
              style={{ background: '#1E3A2F', color: '#F2EBDD' }}
            >
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
              {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>

          <p className="text-[11px] opacity-40 mt-10 leading-relaxed">
            Sistema KUXAAN · v1.0 · Servicio Social Comunitario
          </p>
        </div>
      </div>
    </div>
  );
};

const Field = ({ icon, label, children }) => (
  <div className="border-b pb-2" style={{ borderColor: 'rgba(26,26,23,0.2)' }}>
    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50 block mb-1">
      {label}
    </label>
    <div className="flex items-center gap-3" style={{ color: '#1A1A17' }}>
      <span className="opacity-50">{icon}</span>
      {children}
    </div>
  </div>
);

const KxMark = ({ dark = false }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill={dark ? '#1E3A2F' : '#F2EBDD'} />
    <circle cx="18" cy="18" r="10" stroke={dark ? '#F2EBDD' : '#1E3A2F'} strokeWidth="1.5" />
    <circle cx="18" cy="18" r="4"  fill={dark ? '#C16E4F'   : '#C16E4F'} />
    <path d="M18 4 V8 M18 28 V32 M4 18 H8 M28 18 H32" stroke={dark ? '#F2EBDD' : '#1E3A2F'} strokeWidth="1.5" />
  </svg>
);

// ============================================================
// ADMIN SHELL  (sidebar + topbar + page)
// ============================================================
const AdminShell = ({ page, setPage, user, onLogout }) => {
  const nav = [
    { id: 'dashboard',   label: 'Panel general',  icon: LayoutDashboard },
    { id: 'students',    label: 'Estudiantes',    icon: Users },
    { id: 'projects',    label: 'Proyectos',      icon: FolderKanban },
    { id: 'assignments', label: 'Asignaciones',   icon: GitBranch },
    { id: 'hours',       label: 'Control de horas', icon: Clock },
    { id: 'evidence',    label: 'Evidencias',     icon: FileImage },
    { id: 'reports',     label: 'Reportes',       icon: FileBarChart },
    { id: 'account',     label: 'Mi cuenta',      icon: Lock },
  ];

  return (
    <AppShell
      nav={nav}
      page={page}
      setPage={setPage}
      role="Administrador"
      name={user?.name || user?.email || 'Administrador'}
      onLogout={onLogout}
      maxWidth="max-w-[1400px]"
    >
      {page === 'dashboard'   && <AdminDashboard user={user} setPage={setPage} />}
      {page === 'students'    && <StudentsPage />}
      {page === 'projects'    && <ProjectsPage />}
      {page === 'assignments' && <AssignmentsPage />}
      {page === 'hours'       && <HoursPage />}
      {page === 'evidence'    && <EvidencePage />}
      {page === 'reports'     && <ReportsPage />}
      {page === 'account'     && <AccountPage user={user} role="admin" />}
    </AppShell>
  );
};

// ============================================================
// STUDENT SHELL
// ============================================================
const StudentShell = ({ page, setPage, user, onLogout }) => {
  const nav = [
    { id: 'dashboard', label: 'Inicio',           icon: LayoutDashboard },
    { id: 'profile',   label: 'Mi perfil',        icon: User },
    { id: 'project',   label: 'Mi proyecto',      icon: FolderKanban },
    { id: 'hours',     label: 'Registrar horas',  icon: Clock },
    { id: 'evidence',  label: 'Subir evidencias', icon: Upload },
    { id: 'account',   label: 'Mi cuenta',        icon: Lock },
  ];

  return (
    <AppShell
      nav={nav}
      page={page}
      setPage={setPage}
      role="Estudiante"
      name={user?.name || user?.email || 'Estudiante'}
      onLogout={onLogout}
      accent
      maxWidth="max-w-[1100px]"
    >
      {page === 'dashboard' && <StudentDashboard setPage={setPage} />}
      {page === 'profile'   && <StudentProfile />}
      {page === 'project'   && <StudentProject />}
      {page === 'hours'     && <StudentHours />}
      {page === 'evidence'  && <StudentEvidence />}
      {page === 'account'   && <AccountPage user={user} role="student" />}
    </AppShell>
  );
};

// ============================================================
// APP SHELL / NAVIGATION  (shared)
// ============================================================
const AppShell = ({ nav, page, setPage, role, name, onLogout, accent, maxWidth, children }) => (
  <div className="min-h-screen lg:h-screen lg:overflow-hidden lg:flex">
    <Sidebar nav={nav} page={page} setPage={setPage} role={role} name={name} onLogout={onLogout} accent={accent} />
    <main className="min-w-0 flex-1 lg:overflow-y-auto pb-24 lg:pb-0">
      <Topbar page={nav.find(n => n.id === page)?.label} />
      <div className={`w-full ${maxWidth} px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8`}>
        {children}
      </div>
    </main>
    <MobileNav nav={nav} page={page} setPage={setPage} onLogout={onLogout} />
  </div>
);

const Sidebar = ({ nav, page, setPage, role, name, onLogout, accent }) => (
  <aside
    className="hidden lg:flex w-64 flex-col border-r shrink-0"
    style={{ background: '#1E3A2F', color: '#F2EBDD', borderColor: 'rgba(0,0,0,0.2)' }}
  >
    <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(242,235,221,0.1)' }}>
      <KxMark />
      <div>
        <div className="font-display text-xl leading-none tracking-tight">kuxaan</div>
        <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 mt-1">
          Servicio social
        </div>
      </div>
    </div>

    <nav className="flex-1 p-4 space-y-1">
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 px-3 mb-3 mt-2">
        Menú principal
      </p>
      {nav.map(({ id, label, icon: Icon }) => {
        const active = page === id;
        return (
          <button
            key={id}
            onClick={() => setPage(id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all relative"
            style={{
              background: active ? 'rgba(242,235,221,0.08)' : 'transparent',
              color: active ? '#F2EBDD' : 'rgba(242,235,221,0.65)',
            }}
          >
            {active && (
              <span
                className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
                style={{ background: '#C16E4F' }}
              />
            )}
            <Icon size={16} strokeWidth={1.6} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>

    <div className="p-4 border-t" style={{ borderColor: 'rgba(242,235,221,0.1)' }}>
      <div className="flex items-center gap-3 px-3 py-2 rounded-md">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm"
          style={{ background: accent ? '#C16E4F' : '#F2EBDD', color: accent ? '#F2EBDD' : '#1E3A2F' }}
        >
          {name.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm truncate">{name}</div>
          <div className="text-[10px] uppercase tracking-[0.15em] opacity-50">{role}</div>
        </div>
        <button onClick={onLogout} className="opacity-50 hover:opacity-100 transition-opacity" title="Cerrar sesión">
          <LogOut size={15} />
        </button>
      </div>
    </div>
  </aside>
);

const MobileNav = ({ nav, page, setPage, onLogout }) => (
  <div
    className="fixed inset-x-0 bottom-0 z-40 border-t lg:hidden"
    style={{ background: '#1E3A2F', color: '#F2EBDD', borderColor: 'rgba(242,235,221,0.14)' }}
  >
    <div className="flex items-center gap-1 overflow-x-auto px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {nav.map(({ id, label, icon: Icon }) => {
        const active = page === id;
        return (
          <button
            key={id}
            onClick={() => setPage(id)}
            className="min-w-[76px] flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-[10px] transition-colors"
            style={{
              background: active ? 'rgba(242,235,221,0.1)' : 'transparent',
              color: active ? '#F2EBDD' : 'rgba(242,235,221,0.68)',
            }}
          >
            <Icon size={17} strokeWidth={1.7} />
            <span className="max-w-[72px] truncate">{label}</span>
          </button>
        );
      })}
      <button
        onClick={onLogout}
        className="min-w-[56px] flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-[10px]"
        style={{ color: 'rgba(242,235,221,0.68)' }}
        title="Cerrar sesión"
      >
        <LogOut size={17} strokeWidth={1.7} />
        <span>Salir</span>
      </button>
    </div>
  </div>
);

// ============================================================
// TOPBAR
// ============================================================
const Topbar = ({ page }) => (
  <div
    className="flex flex-col gap-3 px-4 py-4 border-b sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10 lg:py-5"
    style={{ borderColor: 'rgba(26,26,23,0.08)' }}
  >
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] opacity-50">
        KUXAAN /
      </p>
      <h1 className="font-display text-2xl tracking-tight mt-0.5">{page}</h1>
    </div>
    <div className="hidden text-xs opacity-60 sm:block">
      {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
    </div>
  </div>
);

// ============================================================
// ADMIN — DASHBOARD
// ============================================================
const AdminDashboard = ({ user, setPage }) => {
  const { data: stats, loading, error } = useApi(() => api.dashboard.stats(), []);
  const num = (v) => (v == null ? '—' : Number(v).toLocaleString('es-MX'));
  const metrics = [
    { label: 'Estudiantes activos',  value: num(stats?.totalEstudiantes),       delta: 'Registrados',    icon: Users },
    { label: 'Proyectos en curso',   value: num(stats?.totalProyectosActivos),  delta: 'Activos',        icon: FolderKanban },
    { label: 'Horas registradas',    value: num(stats?.totalHorasRegistradas),  delta: 'Acumuladas',     icon: Clock },
    { label: 'Evidencias cargadas',  value: num(stats?.totalEvidencias),        delta: 'En el sistema',  icon: FileImage },
  ];
  const destacados = stats?.proyectosDestacados || [];
  const maxHoras = Math.max(1, ...destacados.map((p) => p.totalHoras));
  const saludo = (user?.name || user?.email || 'administrador').split(' ')[0];

  return (
    <div className="space-y-10">
      {/* Hero strip */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: '#C16E4F' }}>
            Panel administrativo
          </p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight leading-tight">
            Hola, {saludo}. <em className="italic font-light opacity-70">El servicio sigue vivo.</em>
          </h2>
        </div>
        <button
          onClick={() => setPage && setPage('reports')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all hover:opacity-90"
          style={{ background: '#1E3A2F', color: '#F2EBDD' }}
        >
          <FileBarChart size={14} /> Generar reportes
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-6 rounded-lg border bg-white/40"
            style={{ borderColor: 'rgba(26,26,23,0.1)' }}
          >
            <div className="flex items-start justify-between mb-6">
              <p className="text-xs opacity-60">{m.label}</p>
              <m.icon size={16} className="opacity-40" strokeWidth={1.6} />
            </div>
            <div className="font-display text-4xl tracking-tight">{m.value}</div>
            <p className="text-[11px] mt-2 opacity-50">{m.delta}</p>
          </div>
        ))}
      </div>

      {/* Projects status */}
      <div className="p-4 sm:p-6 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg tracking-tight">Proyectos más activos</h3>
            <p className="text-xs opacity-60">Por horas registradas en el periodo</p>
          </div>
          <a className="text-xs underline underline-offset-4 opacity-70 hover:opacity-100 cursor-pointer">
            Ver todos →
          </a>
        </div>
        <EstadoDatos loading={loading} error={error} empty={destacados.length === 0}>
          <div className="space-y-3">
            {destacados.map((p) => {
              const pct = Math.round((p.totalHoras / maxHoras) * 100);
              return (
                <div key={p.idProyecto} className="grid grid-cols-2 gap-3 py-3 sm:grid-cols-12 sm:items-center sm:gap-4 sm:py-2">
                  <div className="col-span-2 sm:col-span-4">
                    <div className="text-sm font-medium">{p.nombreProyecto}</div>
                    <div className="text-[11px] opacity-50">{p.comunidadBeneficiada || '—'}</div>
                  </div>
                  <div className="text-xs opacity-70 sm:col-span-2">{p.totalParticipantes} estudiantes</div>
                  <div className="text-xs opacity-70 sm:col-span-2">{p.totalHoras} h</div>
                  <div className="col-span-2 sm:col-span-3">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,26,23,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#1E3A2F' }} />
                    </div>
                  </div>
                  <div className="text-xs opacity-70 sm:col-span-1 sm:text-right">{pct}%</div>
                </div>
              );
            })}
          </div>
        </EstadoDatos>
      </div>
    </div>
  );
};

// ============================================================
// ADMIN — STUDENTS
// ============================================================
const StudentsPage = () => {
  const { data, loading, error, recargar } = useApi(() => api.students.list(), []);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [reseteando, setReseteando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({ career: '', uni: '', period: '', status: '' });
  const students = data || [];

  // Opciones de filtro derivadas de los propios datos.
  const opciones = (campo) => [
    { value: '', label: 'Todos' },
    ...[...new Set(students.map((s) => s[campo]).filter(Boolean))]
      .sort()
      .map((v) => ({ value: v, label: v })),
  ];

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return students.filter((s) => {
      const coincideTexto =
        !texto ||
        [s.name, s.career, s.uni].some((v) => (v || '').toLowerCase().includes(texto));
      const coincideFiltros = Object.entries(filtros).every(
        ([campo, valor]) => !valor || s[campo] === valor
      );
      return coincideTexto && coincideFiltros;
    });
  }, [students, busqueda, filtros]);

  const eliminar = async (s) => {
    if (!window.confirm(`¿Eliminar a ${s.name}? Se borrarán también sus horas y evidencias.`)) return;
    try { await api.students.remove(s.id); recargar(); }
    catch (e) { alert(api.mensajeError(e)); }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Gestión"
        title="Estudiantes"
        subtitle={`${students.length} estudiante${students.length !== 1 ? 's' : ''} registrado${students.length !== 1 ? 's' : ''}`}
        action={{ label: 'Nuevo estudiante', icon: Plus, onClick: () => setCreando(true) }}
      />

      {creando && (
        <StudentForm
          onClose={() => setCreando(false)}
          onSaved={() => { setCreando(false); recargar(); }}
        />
      )}

      {editando && (
        <StudentForm
          student={editando}
          onClose={() => setEditando(null)}
          onSaved={() => { setEditando(null); recargar(); }}
        />
      )}

      {reseteando && (
        <ResetPasswordForm
          student={reseteando}
          onClose={() => setReseteando(null)}
          onSaved={() => setReseteando(null)}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div
          className="flex w-full items-center gap-2 rounded-md border bg-white/40 px-3 py-2 sm:max-w-xs sm:flex-1"
          style={{ borderColor: 'rgba(26,26,23,0.1)' }}
        >
          <Search size={14} className="opacity-50" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, carrera o universidad…"
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
        <FilterSelect label="Carrera" value={filtros.career}
          onChange={(v) => setFiltros((f) => ({ ...f, career: v }))} options={opciones('career')} />
        <FilterSelect label="Universidad" value={filtros.uni}
          onChange={(v) => setFiltros((f) => ({ ...f, uni: v }))} options={opciones('uni')} />
        <FilterSelect label="Periodo" value={filtros.period}
          onChange={(v) => setFiltros((f) => ({ ...f, period: v }))} options={opciones('period')} />
        <FilterSelect label="Estado" value={filtros.status}
          onChange={(v) => setFiltros((f) => ({ ...f, status: v }))} options={opciones('status')} />
      </div>

      {/* Table */}
      <div
        className="rounded-lg border overflow-x-auto bg-white/40"
        style={{ borderColor: 'rgba(26,26,23,0.1)' }}
      >
        <table className="min-w-[920px] w-full text-sm">
          <thead style={{ background: 'rgba(30,58,47,0.04)' }}>
            <tr className="text-left">
              {['Nombre', 'Correo', 'Carrera', 'Universidad', 'Periodo', 'Horas', 'Estado', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-medium opacity-60">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="8" className="px-5 py-8 text-sm opacity-50">Cargando…</td></tr>
            )}
            {error && (
              <tr><td colSpan="8" className="px-5 py-8 text-sm" style={{ color: '#9F5235' }}>Error: {error}</td></tr>
            )}
            {!loading && !error && students.length === 0 && (
              <tr><td colSpan="8" className="px-5 py-8 text-sm opacity-50">Aún no hay estudiantes registrados.</td></tr>
            )}
            {!loading && !error && students.length > 0 && visibles.length === 0 && (
              <tr><td colSpan="8" className="px-5 py-8 text-sm opacity-50">Ningún estudiante coincide con los filtros.</td></tr>
            )}
            {visibles.map((s) => (
              <tr key={s.id} className="border-t" style={{ borderColor: 'rgba(26,26,23,0.06)' }}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium"
                      style={{ background: '#1E3A2F', color: '#F2EBDD' }}
                    >
                      {(s.name || '?').split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 opacity-80">{s.email || '—'}</td>
                <td className="px-5 py-4 opacity-80">{s.career || '—'}</td>
                <td className="px-5 py-4 opacity-80">{s.uni || '—'}</td>
                <td className="px-5 py-4 opacity-80">{s.period || '—'}</td>
                <td className="px-5 py-4 font-medium">{s.hours != null ? `${s.hours} h` : '—'}</td>
                <td className="px-5 py-4">
                  <StatusPill status={s.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditando(s)} className="p-1.5 hover:bg-black/5 rounded" title="Editar">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => setReseteando(s)} className="p-1.5 hover:bg-black/5 rounded" title="Restablecer contraseña">
                      <Lock size={13} />
                    </button>
                    <button onClick={() => eliminar(s)} className="p-1.5 hover:bg-black/5 rounded" title="Eliminar">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs opacity-60">
        <span>
          Mostrando {visibles.length} de {students.length} estudiante{students.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

// Filtro desplegable poblado con los valores presentes en los datos.
const FilterSelect = ({ label, value, onChange, options }) => (
  <div
    className="flex items-center gap-2 px-3 py-2 rounded-md text-xs border bg-white/40"
    style={{ borderColor: 'rgba(26,26,23,0.1)' }}
  >
    <Filter size={12} className="opacity-50" />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent outline-none text-xs cursor-pointer"
      title={label}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.value === '' ? label : o.label}
        </option>
      ))}
    </select>
  </div>
);

const StatusPill = ({ status }) => {
  const key = (status || '').toUpperCase();
  const styles = {
    'ACTIVO':     { bg: 'rgba(30,58,47,0.1)',    color: '#1E3A2F' },
    'COMPLETADO': { bg: 'rgba(193,110,79,0.15)', color: '#9F5235' },
    'EN PAUSA':   { bg: 'rgba(26,26,23,0.08)',   color: '#1A1A17' },
    'INACTIVO':   { bg: 'rgba(26,26,23,0.08)',   color: '#1A1A17' },
  };
  const s = styles[key] || styles['ACTIVO'];
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '—';
  return (
    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
      {label}
    </span>
  );
};

const PageHeader = ({ eyebrow, title, subtitle, action }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: '#C16E4F' }}>
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm opacity-60 mt-2">{subtitle}</p>}
    </div>
    {action && (
      <button
        onClick={action.onClick}
        className="flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 sm:min-h-0"
        style={{ background: '#1E3A2F', color: '#F2EBDD' }}
      >
        <action.icon size={14} /> {action.label}
      </button>
    )}
  </div>
);

// ============================================================
// FORMULARIOS (modales reutilizables)
// ============================================================
const Modal = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(26,26,23,0.45)' }}
    onClick={onClose}
  >
    <div
      className="w-full max-w-lg rounded-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
      style={{ background: '#F2EBDD' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-2xl tracking-tight">{title}</h3>
        <button onClick={onClose} className="opacity-50 hover:opacity-100 text-2xl leading-none">×</button>
      </div>
      {children}
    </div>
  </div>
);

const TextField = ({ label, value, onChange, type = 'text', required, placeholder }) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.2em] opacity-60 block mb-1">
      {label}{required && ' *'}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent outline-none text-sm py-2 border-b"
      style={{ borderColor: 'rgba(26,26,23,0.2)' }}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, required }) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.2em] opacity-60 block mb-1">
      {label}{required && ' *'}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent outline-none text-sm py-2 border-b"
      style={{ borderColor: 'rgba(26,26,23,0.2)' }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

// Estados que reconoce StatusPill, compartidos por los formularios.
const ESTADOS_ESTUDIANTE = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
  { value: 'COMPLETADO', label: 'Completado' },
];

const ESTADOS_PROYECTO = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'EN PAUSA', label: 'En pausa' },
  { value: 'COMPLETADO', label: 'Completado' },
  { value: 'INACTIVO', label: 'Inactivo' },
];

const FormError = ({ error }) =>
  error ? (
    <div className="mb-4 px-4 py-2.5 rounded-md text-sm" style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}>
      {error}
    </div>
  ) : null;

const FormActions = ({ saving, onClose, onSave, label = 'Guardar' }) => (
  <div className="pt-6 flex gap-3">
    <button
      onClick={onSave}
      disabled={saving}
      className="px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
      style={{ background: '#1E3A2F', color: '#F2EBDD' }}
    >
      {saving ? 'Guardando…' : label} <ArrowRight size={14} />
    </button>
    <button onClick={onClose} className="px-5 py-2.5 rounded-md text-sm font-medium border" style={{ borderColor: 'rgba(26,26,23,0.2)' }}>
      Cancelar
    </button>
  </div>
);

// Formulario dual: sin `student` da de alta; con `student` edita.
// En edición se ocultan correo y contraseña porque PUT /students/:id solo
// actualiza la tabla de alumnos.
const StudentForm = ({ student, onClose, onSaved }) => {
  const editando = Boolean(student);
  const [form, setForm] = useState({
    name: student?.name || '',
    email: '',
    password: '',
    career: student?.career || '',
    uni: student?.uni || '',
    period: student?.period || '',
    phone: student?.phone || '',
    status: student?.status || 'ACTIVO',
    requiredHours: student?.requiredHours ?? 240,
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const guardar = async () => {
    if (!form.name) { setError('El nombre completo es obligatorio'); return; }
    if (!editando && (!form.email || !form.password)) {
      setError('Nombre, correo y contraseña son obligatorios');
      return;
    }
    setSaving(true); setError(null);
    try {
      const datos = { ...form, requiredHours: Number(form.requiredHours) || 240 };
      if (editando) await api.students.update(student.id, datos);
      else await api.students.create(datos);
      onSaved();
    }
    catch (e) { setError(api.mensajeError(e)); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={editando ? 'Editar estudiante' : 'Nuevo estudiante'} onClose={onClose}>
      <FormError error={error} />
      <div className="space-y-4">
        <TextField label="Nombre completo" value={form.name} onChange={set('name')} required />
        {!editando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Correo" type="email" value={form.email} onChange={set('email')} required />
            <TextField label="Contraseña" type="password" value={form.password} onChange={set('password')} required />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Carrera" value={form.career} onChange={set('career')} />
          <TextField label="Universidad" value={form.uni} onChange={set('uni')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Periodo académico" value={form.period} onChange={set('period')} placeholder="Ene–Jun 2026" />
          <TextField label="Teléfono" value={form.phone} onChange={set('phone')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Horas requeridas" type="number" value={form.requiredHours} onChange={set('requiredHours')} />
          <SelectField label="Estado" value={form.status} onChange={set('status')} options={ESTADOS_ESTUDIANTE} />
        </div>
      </div>
      {editando && (
        <p className="text-[11px] opacity-50 mt-4">
          El correo no se puede modificar. Para cambiar la contraseña usa la acción
          «Restablecer contraseña» de la tabla.
        </p>
      )}
      <FormActions saving={saving} onClose={onClose} onSave={guardar} />
    </Modal>
  );
};

// El administrador asigna una contraseña nueva a un estudiante.
const ResetPasswordForm = ({ student, onClose, onSaved }) => {
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  const guardar = async () => {
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    if (password !== confirmacion) { setError('Las contraseñas no coinciden'); return; }
    setSaving(true); setError(null);
    try {
      await api.students.resetPassword(student.id, password);
      setOk(true);
      setTimeout(onSaved, 1200);
    }
    catch (e) { setError(api.mensajeError(e)); }
    finally { setSaving(false); }
  };

  return (
    <Modal title="Restablecer contraseña" onClose={onClose}>
      <FormError error={error} />
      <p className="text-sm opacity-70 mb-5">
        Se asignará una contraseña nueva a <span className="font-medium">{student.name}</span>.
        Compártesela para que pueda entrar y cambiarla desde su cuenta.
      </p>
      <div className="space-y-4">
        <TextField label="Contraseña nueva" type="password" value={password} onChange={setPassword} required />
        <TextField label="Confirmar contraseña" type="password" value={confirmacion} onChange={setConfirmacion} required />
      </div>
      {ok && <p className="text-sm mt-4" style={{ color: '#1E3A2F' }}>✓ Contraseña actualizada</p>}
      <FormActions saving={saving} onClose={onClose} onSave={guardar} label="Restablecer" />
    </Modal>
  );
};

// Recorta una fecha ISO a YYYY-MM-DD para los <input type="date">.
const aFechaInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

const ProjectForm = ({ project, onClose, onSaved }) => {
  const editando = Boolean(project);
  const [form, setForm] = useState({
    name: project?.name || '',
    objective: project?.objective || '',
    community: project?.community || '',
    responsible: project?.responsible || '',
    startDate: aFechaInput(project?.startDate),
    endDate: aFechaInput(project?.endDate),
    status: project?.status || 'ACTIVO',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const guardar = async () => {
    if (!form.name) { setError('El nombre del proyecto es obligatorio'); return; }
    setSaving(true); setError(null);
    try {
      if (editando) await api.projects.update(project.id, form);
      else await api.projects.create(form);
      onSaved();
    }
    catch (e) { setError(api.mensajeError(e)); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={editando ? 'Editar proyecto' : 'Nuevo proyecto'} onClose={onClose}>
      <FormError error={error} />
      <div className="space-y-4">
        <TextField label="Nombre del proyecto" value={form.name} onChange={set('name')} required />
        <TextField label="Objetivo" value={form.objective} onChange={set('objective')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Comunidad beneficiada" value={form.community} onChange={set('community')} />
          <TextField label="Responsable" value={form.responsible} onChange={set('responsible')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Fecha de inicio" type="date" value={form.startDate} onChange={set('startDate')} />
          <TextField label="Fecha de término" type="date" value={form.endDate} onChange={set('endDate')} />
        </div>
        <SelectField label="Estado" value={form.status} onChange={set('status')} options={ESTADOS_PROYECTO} />
      </div>
      <FormActions saving={saving} onClose={onClose} onSave={guardar} />
    </Modal>
  );
};

// ============================================================
// ADMIN — PROJECTS
// ============================================================
const ProjectsPage = () => {
  const { data, loading, error, recargar } = useApi(() => api.projects.list(), []);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const projects = data || [];

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar el proyecto "${p.name}"?`)) return;
    try {
      await api.projects.remove(p.id);
      setDetalle(null);
      recargar();
    } catch (e) { alert(api.mensajeError(e)); }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Gestión"
        title="Proyectos comunitarios"
        subtitle={`${projects.length} proyecto${projects.length !== 1 ? 's' : ''} en el sistema`}
        action={{ label: 'Nuevo proyecto', icon: Plus, onClick: () => setCreando(true) }}
      />

      {creando && (
        <ProjectForm
          onClose={() => setCreando(false)}
          onSaved={() => { setCreando(false); recargar(); }}
        />
      )}

      {editando && (
        <ProjectForm
          project={editando}
          onClose={() => setEditando(null)}
          onSaved={() => { setEditando(null); setDetalle(null); recargar(); }}
        />
      )}

      {detalle && !editando && (
        <ProjectDetail
          project={detalle}
          onClose={() => setDetalle(null)}
          onEdit={() => setEditando(detalle)}
          onDelete={() => eliminar(detalle)}
        />
      )}

      <EstadoDatos loading={loading} error={error} empty={projects.length === 0}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => setDetalle(p)}
              className="p-5 rounded-lg border bg-white/40 hover:bg-white/60 transition-all cursor-pointer group"
              style={{ borderColor: 'rgba(26,26,23,0.1)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded"
                  style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}>
                  {p.community || 'Comunidad'}
                </span>
                <StatusPill status={p.status} />
              </div>
              <h3 className="font-display text-xl tracking-tight leading-tight mb-2">{p.name}</h3>
              <p className="text-xs opacity-65 leading-relaxed mb-5">{p.objective || 'Sin descripción.'}</p>
              <div className="flex items-center gap-4 text-[11px] opacity-70 pt-4 border-t" style={{ borderColor: 'rgba(26,26,23,0.08)' }}>
                <span className="flex items-center gap-1.5"><User size={11} /> {p.responsible || '—'}</span>
                {p.startDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} /> {new Date(p.startDate).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}
                  </span>
                )}
                <ChevronRight size={14} className="ml-auto opacity-50 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </EstadoDatos>
    </div>
  );
};

// Detalle del proyecto con los estudiantes asignados y sus acciones.
const ProjectDetail = ({ project, onClose, onEdit, onDelete }) => {
  const { data: asignados, loading, error } = useApi(
    () => api.projects.studentsOf(project.id),
    [project.id]
  );
  const fecha = (d) => (d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }) : '—');
  const lista = asignados || [];

  return (
    <Modal title={project.name} onClose={onClose}>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded"
          style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}>
          {project.community || 'Comunidad'}
        </span>
        <StatusPill status={project.status} />
      </div>

      <p className="text-sm opacity-75 leading-relaxed mb-6">
        {project.objective || 'Sin descripción disponible.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Detail label="Responsable" value={project.responsible || '—'} />
        <Detail label="Comunidad"   value={project.community || '—'} />
        <Detail label="Inicio"      value={fecha(project.startDate)} />
        <Detail label="Término"     value={fecha(project.endDate)} />
      </div>

      <div className="border-t pt-5" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-3">
          Estudiantes asignados ({lista.length})
        </p>
        <EstadoDatos loading={loading} error={error} empty={lista.length === 0}>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {lista.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium"
                  style={{ background: '#1E3A2F', color: '#F2EBDD' }}>
                  {(s.name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{s.name}</div>
                  <div className="text-[11px] opacity-50 truncate">{s.career || '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </EstadoDatos>
      </div>

      <div className="pt-6 flex flex-wrap gap-3">
        <button
          onClick={onEdit}
          className="px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
          style={{ background: '#1E3A2F', color: '#F2EBDD' }}
        >
          <Edit3 size={14} /> Editar
        </button>
        <button
          onClick={onDelete}
          className="px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 border"
          style={{ borderColor: 'rgba(159,82,53,0.4)', color: '#9F5235' }}
        >
          <Trash2 size={14} /> Eliminar
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-md text-sm font-medium border"
          style={{ borderColor: 'rgba(26,26,23,0.2)' }}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

// ============================================================
// ADMIN — ASSIGNMENTS
// ============================================================
const AssignmentsPage = () => {
  const { data: proyectosData } = useApi(() => api.projects.list(), []);
  const { data: estudiantesData, loading, error } = useApi(() => api.students.list(), []);
  const {
    data: asignacionesData,
    loading: cargandoAsignaciones,
    error: errorAsignaciones,
    recargar: recargarAsignaciones,
  } = useApi(() => api.assignments.list(), []);
  const [projectId, setProjectId] = useState('');
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const proyectos = proyectosData || [];
  const alumnos = estudiantesData || [];
  const asignaciones = asignacionesData || [];
  const proyectoSel = proyectos.find((p) => String(p.id) === String(projectId));

  useEffect(() => {
    if (!projectId && proyectos.length) setProjectId(String(proyectos[0].id));
  }, [proyectos, projectId]);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const asignar = async () => {
    if (!projectId || selected.length === 0) {
      setMsg('Selecciona un proyecto y al menos un estudiante');
      return;
    }
    setSaving(true); setMsg(null);
    try {
      const r = await api.assignments.create({ projectId: Number(projectId), studentIds: selected });
      setMsg(`Asignados: ${r.asignados}${r.fallidos ? ` · ${r.fallidos} ya estaban asignados` : ''}`);
      setSelected([]);
      recargarAsignaciones();
    } catch (e) {
      setMsg(api.mensajeError(e));
    } finally {
      setSaving(false);
    }
  };

  const desasignar = async (a) => {
    if (!window.confirm(`¿Quitar a ${a.student} del proyecto "${a.project}"?`)) return;
    try { await api.assignments.remove(a.id); recargarAsignaciones(); }
    catch (e) { alert(api.mensajeError(e)); }
  };

  const fecha = (d) => (d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Vinculación"
        title="Asignación de estudiantes"
        subtitle="Vincula estudiantes con proyectos comunitarios"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-4 sm:p-6 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2">Paso 1</p>
          <h3 className="font-display text-2xl tracking-tight mb-5">Selecciona el proyecto</h3>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full text-sm bg-transparent border rounded-md px-3 py-2.5"
            style={{ borderColor: 'rgba(26,26,23,0.15)' }}
          >
            {proyectos.length === 0 && <option value="">Sin proyectos</option>}
            {proyectos.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {proyectoSel && (
            <div className="mt-5 p-4 rounded-md" style={{ background: 'rgba(30,58,47,0.06)' }}>
              <div className="text-xs opacity-60 mb-1">Proyecto seleccionado</div>
              <div className="font-display text-lg tracking-tight mb-1">{proyectoSel.name}</div>
              <div className="text-xs opacity-60 leading-relaxed">
                {proyectoSel.community || 'Comunidad no especificada'} · {proyectoSel.responsible || 'Sin responsable'}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2">Paso 2</p>
          <h3 className="font-display text-2xl tracking-tight mb-5">
            Selecciona estudiantes <span className="opacity-50 text-base">({selected.length})</span>
          </h3>

          <EstadoDatos loading={loading} error={error} empty={alumnos.length === 0}>
            <div className="space-y-1 max-h-80 overflow-y-auto pr-2">
              {alumnos.map((a) => {
                const checked = selected.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer hover:bg-black/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(a.id)}
                      className="accent-emerald-900"
                    />
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium"
                      style={{ background: '#1E3A2F', color: '#F2EBDD' }}
                    >
                      {(a.name || '?').split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="text-sm flex-1">{a.name}</span>
                  </label>
                );
              })}
            </div>
          </EstadoDatos>

          {msg && <p className="text-xs mt-4" style={{ color: '#9F5235' }}>{msg}</p>}

          <button
            onClick={asignar}
            disabled={saving}
            className="w-full mt-5 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium disabled:opacity-60"
            style={{ background: '#C16E4F', color: '#F2EBDD' }}
          >
            {saving ? 'Asignando…' : `Asignar ${selected.length} estudiante${selected.length !== 1 ? 's' : ''}`} <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Asignaciones existentes */}
      <div>
        <h3 className="font-display text-2xl tracking-tight mb-1">Asignaciones activas</h3>
        <p className="text-sm opacity-60 mb-5">
          {asignaciones.length} vínculo{asignaciones.length !== 1 ? 's' : ''} entre estudiantes y proyectos
        </p>

        <div className="rounded-lg border overflow-x-auto bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
          <table className="min-w-[640px] w-full text-sm">
            <thead style={{ background: 'rgba(30,58,47,0.04)' }}>
              <tr className="text-left">
                {['Estudiante', 'Proyecto', 'Fecha de asignación', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-medium opacity-60">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargandoAsignaciones && (
                <tr><td colSpan="4" className="px-5 py-8 text-sm opacity-50">Cargando…</td></tr>
              )}
              {errorAsignaciones && (
                <tr><td colSpan="4" className="px-5 py-8 text-sm" style={{ color: '#9F5235' }}>Error: {errorAsignaciones}</td></tr>
              )}
              {!cargandoAsignaciones && !errorAsignaciones && asignaciones.length === 0 && (
                <tr><td colSpan="4" className="px-5 py-8 text-sm opacity-50">Todavía no hay estudiantes asignados.</td></tr>
              )}
              {asignaciones.map((a) => (
                <tr key={a.id} className="border-t" style={{ borderColor: 'rgba(26,26,23,0.06)' }}>
                  <td className="px-5 py-4 font-medium">{a.student}</td>
                  <td className="px-5 py-4 opacity-80">{a.project}</td>
                  <td className="px-5 py-4 opacity-80">{fecha(a.date)}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => desasignar(a)} className="p-1.5 hover:bg-black/5 rounded" title="Quitar asignación">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADMIN — HOURS
// ============================================================
const HoursPage = () => {
  const { data, loading, error, recargar } = useApi(() => api.hours.list(), []);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const rows = data || [];
  const fecha = (d) => (d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este registro de horas?')) return;
    try { await api.hours.remove(id); recargar(); }
    catch (e) { alert(api.mensajeError(e)); }
  };

  const exportar = () => {
    api.downloadCSV(
      rows.map((r) => ({
        estudiante: r.student, proyecto: r.project, fecha: fecha(r.date),
        horas: r.hours, descripcion: r.description,
      })),
      'reporte-horas.csv'
    );
  };

  const totalHoras = rows.reduce((s, r) => s + (r.hours || 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Seguimiento"
        title="Control de horas"
        subtitle={`${totalHoras} horas registradas · ${rows.length} registro${rows.length !== 1 ? 's' : ''}`}
        action={{ label: 'Registrar horas', icon: Plus, onClick: () => setCreando(true) }}
      />

      {creando && (
        <HoursForm
          onClose={() => setCreando(false)}
          onSaved={() => { setCreando(false); recargar(); }}
        />
      )}

      {editando && (
        <HoursForm
          record={editando}
          onClose={() => setEditando(null)}
          onSaved={() => { setEditando(null); recargar(); }}
        />
      )}

      <div className="flex justify-end">
        <button
          onClick={exportar}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs border bg-white/40 hover:bg-white/70 transition-colors"
          style={{ borderColor: 'rgba(26,26,23,0.15)' }}
        >
          <Download size={13} /> Exportar CSV
        </button>
      </div>

      <div className="rounded-lg border overflow-x-auto bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
        <table className="min-w-[860px] w-full text-sm">
          <thead style={{ background: 'rgba(30,58,47,0.04)' }}>
            <tr className="text-left">
              {['Estudiante', 'Proyecto', 'Fecha', 'Horas', 'Descripción', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-medium opacity-60">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="6" className="px-5 py-8 text-sm opacity-50">Cargando…</td></tr>
            )}
            {error && (
              <tr><td colSpan="6" className="px-5 py-8 text-sm" style={{ color: '#9F5235' }}>Error: {error}</td></tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr><td colSpan="6" className="px-5 py-8 text-sm opacity-50">Aún no hay horas registradas.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t" style={{ borderColor: 'rgba(26,26,23,0.06)' }}>
                <td className="px-5 py-4 font-medium">{r.student}</td>
                <td className="px-5 py-4 opacity-80">{r.project}</td>
                <td className="px-5 py-4 opacity-80">{fecha(r.date)}</td>
                <td className="px-5 py-4">
                  <span className="font-display text-lg" style={{ color: '#C16E4F' }}>{r.hours}</span>
                  <span className="text-xs opacity-50 ml-1">h</span>
                </td>
                <td className="px-5 py-4 opacity-75 max-w-xs">{r.description || '—'}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditando(r)} className="p-1.5 hover:bg-black/5 rounded" title="Editar">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => eliminar(r.id)} className="p-1.5 hover:bg-black/5 rounded" title="Eliminar">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Alta de horas a nombre de un estudiante (admin) y edición de un registro.
// Al editar, el backend solo acepta cantidad, fecha y descripción.
const HoursForm = ({ record, onClose, onSaved }) => {
  const editando = Boolean(record);
  const { data: estudiantesData } = useApi(
    () => (editando ? Promise.resolve([]) : api.students.list()),
    []
  );
  const { data: proyectosData } = useApi(
    () => (editando ? Promise.resolve([]) : api.projects.list()),
    []
  );
  const estudiantes = estudiantesData || [];
  const proyectos = proyectosData || [];

  const [form, setForm] = useState({
    studentId: '',
    projectId: '',
    hours: record?.hours ?? '',
    description: record?.description || '',
    date: aFechaInput(record?.date) || new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  // Preselecciona el primer estudiante y proyecto disponibles.
  useEffect(() => {
    if (!editando && !form.studentId && estudiantes.length) set('studentId')(String(estudiantes[0].id));
  }, [estudiantes]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!editando && !form.projectId && proyectos.length) set('projectId')(String(proyectos[0].id));
  }, [proyectos]); // eslint-disable-line react-hooks/exhaustive-deps

  const guardar = async () => {
    if (!form.hours || Number(form.hours) <= 0) { setError('Ingresa una cantidad de horas mayor a cero'); return; }
    if (!editando && (!form.studentId || !form.projectId)) {
      setError('Selecciona el estudiante y el proyecto');
      return;
    }
    setSaving(true); setError(null);
    try {
      const datos = {
        hours: Number(form.hours),
        description: form.description,
        date: form.date,
      };
      if (editando) await api.hours.update(record.id, datos);
      else await api.hours.create({
        ...datos,
        studentId: Number(form.studentId),
        projectId: Number(form.projectId),
      });
      onSaved();
    }
    catch (e) { setError(api.mensajeError(e)); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={editando ? 'Editar registro de horas' : 'Registrar horas'} onClose={onClose}>
      <FormError error={error} />
      {editando ? (
        <p className="text-sm opacity-70 mb-5">
          {record.student} · {record.project}
        </p>
      ) : (
        <div className="space-y-4 mb-4">
          <SelectField
            label="Estudiante"
            value={form.studentId}
            onChange={set('studentId')}
            options={estudiantes.map((s) => ({ value: String(s.id), label: s.name }))}
            required
          />
          <SelectField
            label="Proyecto"
            value={form.projectId}
            onChange={set('projectId')}
            options={proyectos.map((p) => ({ value: String(p.id), label: p.name }))}
            required
          />
        </div>
      )}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Fecha" type="date" value={form.date} onChange={set('date')} />
          <TextField label="Horas" type="number" value={form.hours} onChange={set('hours')} required />
        </div>
        <TextField label="Descripción" value={form.description} onChange={set('description')} />
      </div>
      <FormActions saving={saving} onClose={onClose} onSave={guardar} />
    </Modal>
  );
};

// ============================================================
// ADMIN — EVIDENCE
// ============================================================
// Subida de evidencia a nombre de un estudiante (solo administrador).
const EvidenceForm = ({ onClose, onSaved }) => {
  const { data: estudiantesData } = useApi(() => api.students.list(), []);
  const { data: proyectosData } = useApi(() => api.projects.list(), []);
  const estudiantes = estudiantesData || [];
  const proyectos = proyectosData || [];

  const [studentId, setStudentId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!studentId && estudiantes.length) setStudentId(String(estudiantes[0].id));
  }, [estudiantes]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!projectId && proyectos.length) setProjectId(String(proyectos[0].id));
  }, [proyectos]); // eslint-disable-line react-hooks/exhaustive-deps

  const guardar = async () => {
    if (!studentId || !projectId || !file) { setError('Selecciona estudiante, proyecto y archivo'); return; }
    setSaving(true); setError(null);
    try {
      await api.evidence.upload(file, { projectId: Number(projectId), studentId: Number(studentId) });
      onSaved();
    }
    catch (e) { setError(api.mensajeError(e)); }
    finally { setSaving(false); }
  };

  return (
    <Modal title="Subir evidencia" onClose={onClose}>
      <FormError error={error} />
      <div className="space-y-4">
        <SelectField
          label="Estudiante"
          value={studentId}
          onChange={setStudentId}
          options={estudiantes.map((s) => ({ value: String(s.id), label: s.name }))}
          required
        />
        <SelectField
          label="Proyecto"
          value={projectId}
          onChange={setProjectId}
          options={proyectos.map((p) => ({ value: String(p.id), label: p.name }))}
          required
        />
        <label className="block rounded-md border-2 border-dashed p-6 text-center cursor-pointer hover:bg-white/40 transition-colors"
          style={{ borderColor: 'rgba(30,58,47,0.25)' }}>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Upload size={20} className="mx-auto mb-2 opacity-60" />
          <div className="text-sm">{file ? file.name : 'Selecciona un archivo'}</div>
          <div className="text-[11px] opacity-50 mt-1 uppercase tracking-wider">PDF · JPG · PNG · hasta 10 MB</div>
        </label>
      </div>
      <FormActions saving={saving} onClose={onClose} onSave={guardar} label="Subir" />
    </Modal>
  );
};

const EvidencePage = () => {
  const { data, loading, error, recargar } = useApi(() => api.evidence.list(), []);
  const [subiendo, setSubiendo] = useState(false);
  const [proyectoFiltro, setProyectoFiltro] = useState('');
  const items = data || [];
  const fecha = (d) => (d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
  const esPdf = (t) => (t || '').toLowerCase().includes('pdf');

  const proyectos = [
    { value: '', label: 'Todos' },
    ...[...new Set(items.map((e) => e.project).filter(Boolean))]
      .sort()
      .map((v) => ({ value: v, label: v })),
  ];

  const visibles = useMemo(
    () => items.filter((e) => !proyectoFiltro || e.project === proyectoFiltro),
    [items, proyectoFiltro]
  );

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta evidencia?')) return;
    try { await api.evidence.remove(id); recargar(); }
    catch (e) { alert(api.mensajeError(e)); }
  };

  const descargar = async (ev) => {
    try { await api.evidence.download(ev.id, ev.file); }
    catch (e) { alert(api.mensajeError(e)); }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Documentación"
        title="Evidencias"
        subtitle={`${items.length} archivo${items.length !== 1 ? 's' : ''} cargado${items.length !== 1 ? 's' : ''}`}
        action={{ label: 'Subir evidencia', icon: Upload, onClick: () => setSubiendo(true) }}
      />

      {subiendo && (
        <EvidenceForm
          onClose={() => setSubiendo(false)}
          onSaved={() => { setSubiendo(false); recargar(); }}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <FilterSelect label="Proyecto" value={proyectoFiltro}
          onChange={setProyectoFiltro} options={proyectos} />
      </div>

      <EstadoDatos loading={loading} error={error} empty={items.length === 0}>
        {visibles.length === 0 ? (
          <p className="text-sm opacity-50">Ningún archivo coincide con el filtro.</p>
        ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibles.map((e) => (
            <div
              key={e.id}
              className="rounded-lg border bg-white/40 overflow-hidden group hover:bg-white/60 transition-all"
              style={{ borderColor: 'rgba(26,26,23,0.1)' }}
            >
              <div
                className="aspect-[4/3] flex items-center justify-center relative"
                style={{
                  background: esPdf(e.type)
                    ? 'linear-gradient(135deg, rgba(193,110,79,0.12), rgba(193,110,79,0.04))'
                    : 'linear-gradient(135deg, rgba(30,58,47,0.12), rgba(30,58,47,0.04))',
                }}
              >
                <div className="font-display text-5xl tracking-tight opacity-30">
                  {esPdf(e.type) ? 'PDF' : 'IMG'}
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(30,58,47,0.6)' }}>
                  <button
                    onClick={() => descargar(e)}
                    className="p-2 rounded-md"
                    style={{ background: '#F2EBDD' }}
                    title="Descargar evidencia"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => eliminar(e.id)}
                    className="p-2 rounded-md"
                    style={{ background: '#F2EBDD' }}
                    title="Eliminar evidencia"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm font-medium truncate">{e.file}</div>
                <div className="text-[11px] opacity-60 mt-1">
                  {e.student} · {e.project}
                </div>
                <div className="text-[10px] opacity-50 mt-1.5 uppercase tracking-wider">{fecha(e.date)}</div>
              </div>
            </div>
          ))}
        </div>
        )}
      </EstadoDatos>
    </div>
  );
};

// ============================================================
// ADMIN — REPORTS
// ============================================================
const ReportsPage = () => {
  const [descargando, setDescargando] = useState(null);
  const [error, setError] = useState(null);

  // Cada tipo obtiene el JSON del backend y lo aplana a filas para el CSV.
  const types = [
    {
      title: 'Reporte por estudiante',
      desc: 'Horas y proyectos por participante',
      icon: User,
      file: 'reporte-estudiantes.csv',
      fetch: async () => (await api.reports.byStudent()).map((e) => ({
        id: e.idAlumno, nombre: e.nombreCompleto, carrera: e.carrera, universidad: e.universidad,
        proyectos: (e.proyectosAsignados || []).join(' | '), horas: e.totalHorasAcumuladas,
      })),
    },
    {
      title: 'Reporte por proyecto',
      desc: 'Estudiantes asignados por proyecto',
      icon: FolderKanban,
      file: 'reporte-proyectos.csv',
      fetch: async () => (await api.reports.byProject()).map((p) => ({
        id: p.idProyecto, proyecto: p.nombreProyecto, responsable: p.responsable,
        comunidad: p.comunidadBeneficiada,
        participantes: (p.estudiantesAsignados || []).map((a) => a.nombreCompleto).join(' | '),
        total: p.totalParticipantes,
      })),
    },
    {
      title: 'Reporte de horas',
      desc: 'Registro detallado de horas por proyecto',
      icon: Clock,
      file: 'reporte-horas.csv',
      fetch: async () => (await api.reports.hours()).map((h) => ({
        proyecto: h.nombreProyecto, estudiante: h.estudianteParticipante,
        fecha: h.fechaRegistro ? new Date(h.fechaRegistro).toLocaleDateString('es-MX') : '',
        horas: h.cantidadHoras, descripcion: h.descripcion,
      })),
    },
    {
      title: 'Reporte de evidencias',
      desc: 'Listado de archivos cargados al sistema',
      icon: FileImage,
      file: 'reporte-evidencias.csv',
      fetch: async () => (await api.reports.evidence()).map((ev) => ({
        estudiante: ev.nombreEstudiante, proyecto: ev.proyectoRelacionado,
        archivo: ev.nombreArchivo, tipo: ev.tipoArchivo,
        fecha: ev.fechaSubida ? new Date(ev.fechaSubida).toLocaleDateString('es-MX') : '',
      })),
    },
    {
      title: 'Reporte general',
      desc: 'Indicadores globales del sistema',
      icon: FileBarChart,
      file: 'reporte-general.csv',
      fetch: async () => [await api.reports.general()],
    },
  ];

  const descargar = async (t) => {
    setDescargando(t.title); setError(null);
    try {
      const filas = await t.fetch();
      if (!filas || filas.length === 0) { setError(`"${t.title}" no tiene datos todavía.`); return; }
      api.downloadCSV(filas, t.file);
    } catch (e) {
      setError(api.mensajeError(e));
    } finally {
      setDescargando(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Análisis"
        title="Generación de reportes"
        subtitle="Exporta la información del sistema en formato CSV"
      />

      {error && (
        <div className="px-4 py-3 rounded-md text-sm" style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}>
          {error}
        </div>
      )}

      <div>
        <h3 className="font-display text-2xl tracking-tight mb-5">Tipos de reporte</h3>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {types.map((t) => (
            <div
              key={t.title}
              className="flex flex-col gap-4 rounded-lg border bg-white/40 p-4 transition-all hover:bg-white/60 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
              style={{ borderColor: 'rgba(26,26,23,0.1)' }}
            >
              <div
                className="w-12 h-12 rounded-md flex items-center justify-center shrink-0"
                style={{ background: 'rgba(30,58,47,0.08)' }}
              >
                <t.icon size={20} strokeWidth={1.6} style={{ color: '#1E3A2F' }} />
              </div>
              <div className="flex-1">
                <h4 className="font-display text-lg tracking-tight">{t.title}</h4>
                <p className="text-xs opacity-65 mt-0.5">{t.desc}</p>
              </div>
              <div className="flex gap-2 sm:ml-auto">
                <button
                  onClick={() => descargar(t)}
                  disabled={descargando === t.title}
                  className="px-3 py-1.5 rounded-md text-xs border flex items-center gap-1.5 disabled:opacity-60"
                  style={{ borderColor: 'rgba(26,26,23,0.15)' }}
                >
                  <Download size={12} /> {descargando === t.title ? 'Generando…' : 'CSV'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CUENTA  (admin y estudiante)
// ============================================================
const AccountPage = ({ user, role }) => (
  <div className="space-y-8">
    <PageHeader
      eyebrow="Mi cuenta"
      title="Cuenta y seguridad"
      subtitle={user?.email || undefined}
    />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChangePasswordCard />
      {role === 'admin' && <NewAdminCard />}
    </div>
  </div>
);

const ChangePasswordCard = () => {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    if (!actual || !nueva) { setMsg('Completa ambos campos'); setOk(false); return; }
    if (nueva.length < 8) { setMsg('La contraseña nueva debe tener al menos 8 caracteres'); setOk(false); return; }
    if (nueva !== confirmacion) { setMsg('Las contraseñas no coinciden'); setOk(false); return; }
    setSaving(true); setMsg(null);
    try {
      await api.auth.changePassword(actual, nueva);
      setMsg('Contraseña actualizada correctamente'); setOk(true);
      setActual(''); setNueva(''); setConfirmacion('');
    } catch (err) {
      setMsg(api.mensajeError(err)); setOk(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={guardar} className="rounded-lg border bg-white/40 p-5 sm:p-6 space-y-5"
      style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
      <div>
        <h3 className="font-display text-2xl tracking-tight">Cambiar contraseña</h3>
        <p className="text-xs opacity-60 mt-1">Mínimo 8 caracteres.</p>
      </div>
      <TextField label="Contraseña actual" type="password" value={actual} onChange={setActual} required />
      <TextField label="Contraseña nueva" type="password" value={nueva} onChange={setNueva} required />
      <TextField label="Confirmar contraseña" type="password" value={confirmacion} onChange={setConfirmacion} required />
      {msg && <p className="text-sm" style={{ color: ok ? '#1E3A2F' : '#9F5235' }}>{ok ? '✓ ' : ''}{msg}</p>}
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: '#1E3A2F', color: '#F2EBDD' }}
      >
        {saving ? 'Guardando…' : 'Actualizar contraseña'} <Lock size={14} />
      </button>
    </form>
  );
};

const NewAdminCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    if (!email || !password) { setMsg('Correo y contraseña son obligatorios'); setOk(false); return; }
    if (password.length < 8) { setMsg('La contraseña debe tener al menos 8 caracteres'); setOk(false); return; }
    setSaving(true); setMsg(null);
    try {
      await api.auth.registerAdmin(email, password);
      setMsg(`Administrador ${email} creado correctamente`); setOk(true);
      setEmail(''); setPassword('');
    } catch (err) {
      setMsg(api.mensajeError(err)); setOk(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={guardar} className="rounded-lg border bg-white/40 p-5 sm:p-6 space-y-5"
      style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
      <div>
        <h3 className="font-display text-2xl tracking-tight">Nuevo administrador</h3>
        <p className="text-xs opacity-60 mt-1">
          Crea otra cuenta con acceso completo al panel administrativo.
        </p>
      </div>
      <TextField label="Correo" type="email" value={email} onChange={setEmail} required />
      <TextField label="Contraseña" type="password" value={password} onChange={setPassword} required />
      {msg && <p className="text-sm" style={{ color: ok ? '#1E3A2F' : '#9F5235' }}>{ok ? '✓ ' : ''}{msg}</p>}
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: '#C16E4F', color: '#F2EBDD' }}
      >
        {saving ? 'Creando…' : 'Crear administrador'} <ShieldCheck size={14} />
      </button>
    </form>
  );
};

// ============================================================
// STUDENT — DASHBOARD
// ============================================================
const HORAS_REQUERIDAS = 240; // meta por defecto si el perfil aún no cargó

const StudentDashboard = ({ setPage }) => {
  const { data: perfil } = useApi(() => api.me.profile(), []);
  const { data: registros } = useApi(() => api.hours.list(), []);
  const historial = (registros || []).slice(0, 5);
  const proyecto = perfil?.projects?.[0];
  const horas = perfil?.hours ?? 0;
  const meta = perfil?.requiredHours ?? HORAS_REQUERIDAS;
  const pct = Math.min(100, Math.round((horas / meta) * 100));
  const restantes = Math.max(0, meta - horas);
  const nombre = perfil?.name?.split(' ')[0] || 'estudiante';
  const fecha = (d) => (d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '');

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: '#C16E4F' }}>
          Servicio social comunitario
        </p>
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight leading-tight max-w-xl">
          Hola, {nombre}. <em className="italic font-light opacity-70">Vas por buen camino.</em>
        </h2>
      </div>

      {/* Progress card */}
      <div
        className="relative overflow-hidden rounded-lg p-5 sm:p-8"
        style={{ background: '#1E3A2F', color: '#F2EBDD' }}
      >
        <div className="absolute inset-0 kx-grid-pattern opacity-30" />
        <svg viewBox="0 0 400 400" className="absolute -right-10 -top-20 w-[400px] opacity-[0.06]" fill="none">
          <circle cx="200" cy="200" r="160" stroke="#F2EBDD" strokeWidth="2" />
          <circle cx="200" cy="200" r="100" stroke="#F2EBDD" strokeWidth="2" />
          <rect x="180" y="180" width="40" height="40" stroke="#F2EBDD" strokeWidth="2" />
        </svg>

        <div className="relative z-10 grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-3">Horas acumuladas</p>
            <div className="font-display text-5xl sm:text-6xl tracking-tight leading-none">
              {horas}<span className="text-3xl opacity-50">/{meta}</span>
            </div>
            <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(242,235,221,0.15)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#C16E4F' }} />
            </div>
            <p className="text-xs opacity-70 mt-2">{pct}% completado · {restantes} horas restantes</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-3">Mi proyecto</p>
            <div className="font-display text-2xl tracking-tight leading-tight">
              {proyecto?.name || 'Sin proyecto asignado'}
            </div>
            {proyecto?.community && (
              <p className="text-xs opacity-70 mt-2 flex items-center gap-1.5">
                <MapPin size={11} /> {proyecto.community}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-3">Evidencias</p>
            <div className="font-display text-5xl sm:text-6xl tracking-tight leading-none">{perfil?.evidenceCount ?? 0}</div>
            <p className="text-xs opacity-70 mt-3">Archivos cargados</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          onClick={() => setPage && setPage('hours')}
          className="flex items-center justify-between rounded-lg border bg-white/40 p-4 text-left transition-all hover:bg-white/60 sm:p-6"
          style={{ borderColor: 'rgba(26,26,23,0.1)' }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Acción rápida</p>
            <h3 className="font-display text-xl sm:text-2xl tracking-tight">Registrar nuevas horas</h3>
            <p className="text-xs opacity-65 mt-1">Anota tu actividad de hoy</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#C16E4F' }}>
            <Plus size={20} style={{ color: '#F2EBDD' }} />
          </div>
        </button>

        <button
          onClick={() => setPage && setPage('evidence')}
          className="flex items-center justify-between rounded-lg border bg-white/40 p-4 text-left transition-all hover:bg-white/60 sm:p-6"
          style={{ borderColor: 'rgba(26,26,23,0.1)' }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Acción rápida</p>
            <h3 className="font-display text-xl sm:text-2xl tracking-tight">Subir evidencias</h3>
            <p className="text-xs opacity-65 mt-1">PDF o imagen, hasta 10 MB</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#1E3A2F' }}>
            <Upload size={18} style={{ color: '#F2EBDD' }} />
          </div>
        </button>
      </div>

      {/* History */}
      <div className="p-4 sm:p-6 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
        <h3 className="font-display text-lg tracking-tight mb-1">Últimos registros</h3>
        <p className="text-xs opacity-60 mb-5">Tus actividades más recientes</p>
        <div className="space-y-3">
          {historial.length === 0 && (
            <p className="text-sm opacity-50">Aún no has registrado horas.</p>
          )}
          {historial.map((h) => (
            <div key={h.id} className="flex flex-wrap items-center gap-3 py-2 sm:gap-5">
              <div className="text-xs font-mono opacity-70 w-16">{fecha(h.date)}</div>
              <div className="font-display text-xl" style={{ color: '#C16E4F' }}>
                {h.hours}<span className="text-xs opacity-50 ml-0.5">h</span>
              </div>
              <div className="text-sm opacity-80 flex-1">{h.description || '—'}</div>
              <CheckCircle2 size={14} style={{ color: '#1E3A2F' }} className="opacity-60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STUDENT — PROFILE
// ============================================================
const StudentProfile = () => {
  const { data: perfil, loading, error, recargar } = useApi(() => api.me.profile(), []);
  const [editando, setEditando] = useState(false);
  const iniciales = (perfil?.name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('');
  const proyecto = perfil?.projects?.[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Mi cuenta"
        title="Información personal"
        action={perfil ? { label: 'Editar datos', icon: Edit3, onClick: () => setEditando(true) } : undefined}
      />

      {editando && (
        <ProfileForm
          profile={perfil}
          onClose={() => setEditando(false)}
          onSaved={() => { setEditando(false); recargar(); }}
        />
      )}

      <EstadoDatos loading={loading} error={error} empty={!perfil}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="p-4 sm:p-6 rounded-lg border bg-white/40 text-center" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
            <div
              className="w-24 h-24 rounded-full mx-auto flex items-center justify-center font-display text-3xl mb-4"
              style={{ background: '#1E3A2F', color: '#F2EBDD' }}
            >
              {iniciales}
            </div>
            <h3 className="font-display text-2xl tracking-tight">{perfil?.name}</h3>
            <p className="text-sm opacity-60 mt-1">{perfil?.email}</p>
            <div className="mt-4 inline-block px-3 py-1 rounded-full text-[11px]"
              style={{ background: 'rgba(30,58,47,0.1)', color: '#1E3A2F' }}>
              {perfil?.status || 'Activo'} · {perfil?.hours ?? 0}h acumuladas
            </div>
          </div>

          <div className="space-y-5 rounded-lg border bg-white/40 p-4 sm:p-6 lg:col-span-2" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
            <InfoRow label="Nombre completo"   value={perfil?.name || '—'} />
            <InfoRow label="Correo electrónico" value={perfil?.email || '—'} />
            <InfoRow label="Carrera"           value={perfil?.career || '—'} />
            <InfoRow label="Universidad"        value={perfil?.uni || '—'} />
            <InfoRow label="Periodo"           value={perfil?.period || '—'} />
            <InfoRow label="Teléfono"          value={perfil?.phone || '—'} />
            <InfoRow label="Proyecto asignado" value={proyecto?.name || 'Sin asignar'} last />
          </div>
        </div>
      </EstadoDatos>
    </div>
  );
};

// El estudiante edita sus propios datos de contacto (PUT /students/me).
// El estado y la meta de horas los administra la coordinación.
const ProfileForm = ({ profile, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: profile?.name || '',
    career: profile?.career || '',
    uni: profile?.uni || '',
    period: profile?.period || '',
    phone: profile?.phone || '',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const guardar = async () => {
    if (!form.name) { setError('El nombre completo es obligatorio'); return; }
    setSaving(true); setError(null);
    try { await api.me.update(form); onSaved(); }
    catch (e) { setError(api.mensajeError(e)); }
    finally { setSaving(false); }
  };

  return (
    <Modal title="Editar mis datos" onClose={onClose}>
      <FormError error={error} />
      <div className="space-y-4">
        <TextField label="Nombre completo" value={form.name} onChange={set('name')} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Carrera" value={form.career} onChange={set('career')} />
          <TextField label="Universidad" value={form.uni} onChange={set('uni')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Periodo académico" value={form.period} onChange={set('period')} />
          <TextField label="Teléfono" value={form.phone} onChange={set('phone')} />
        </div>
      </div>
      <p className="text-[11px] opacity-50 mt-4">
        El correo y la meta de horas solo los puede cambiar la coordinación.
      </p>
      <FormActions saving={saving} onClose={onClose} onSave={guardar} />
    </Modal>
  );
};

const InfoRow = ({ label, value, last }) => (
  <div className={`flex flex-col gap-1 pb-4 sm:flex-row sm:items-center sm:justify-between ${!last ? 'border-b' : ''}`}
    style={{ borderColor: 'rgba(26,26,23,0.08)' }}>
    <span className="text-[11px] uppercase tracking-[0.18em] opacity-60">{label}</span>
    <span className="text-sm font-medium sm:text-right">{value}</span>
  </div>
);

// ============================================================
// STUDENT — PROJECT
// ============================================================
const StudentProject = () => {
  const { data: perfil, loading, error } = useApi(() => api.me.profile(), []);
  const proyecto = perfil?.projects?.[0];
  const { data: companeros } = useApi(
    () => (proyecto ? api.projects.studentsOf(proyecto.id) : Promise.resolve([])),
    [proyecto?.id]
  );
  const horas = perfil?.hours ?? 0;
  const meta = perfil?.requiredHours ?? HORAS_REQUERIDAS;
  const fecha = (d) => (d ? new Date(d).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }) : '—');

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Mi proyecto" title={proyecto?.name || 'Mi proyecto'} />

      <EstadoDatos loading={loading} error={error} empty={!perfil}>
        {!proyecto ? (
          <p className="text-sm opacity-60">
            Todavía no tienes un proyecto asignado. Contacta a tu administrador.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-lg border bg-white/40 p-5 sm:p-8 lg:col-span-2" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
              <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded"
                style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}>
                {proyecto.community || 'Comunidad'}
              </span>
              <h3 className="font-display text-3xl tracking-tight mt-4 leading-tight">
                {proyecto.name}
              </h3>
              <p className="text-sm opacity-75 leading-relaxed mt-4 max-w-prose">
                {proyecto.objective || 'Sin descripción disponible.'}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Responsable" value={proyecto.responsible || '—'} />
                <Detail label="Comunidad"   value={proyecto.community || '—'} />
                <Detail label="Estado"      value={proyecto.status || '—'} />
                <Detail label="Inicio"      value={fecha(proyecto.startDate)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-lg" style={{ background: '#1E3A2F', color: '#F2EBDD' }}>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2">Mi progreso</p>
                <div className="font-display text-4xl tracking-tight">{horas}h</div>
                <p className="text-xs opacity-70 mt-1">de {meta} horas requeridas</p>
              </div>
              <div className="p-5 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2">Compañeros en el proyecto</p>
                <div className="font-display text-4xl tracking-tight">{companeros?.length ?? 0}</div>
                <p className="text-xs opacity-65 mt-1">estudiantes asignados</p>
              </div>
            </div>
          </div>
        )}
      </EstadoDatos>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">{label}</div>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

// ============================================================
// STUDENT — HOURS  (formulario)
// ============================================================
const StudentHours = () => {
  const { data: proyectos } = useApi(() => api.me.projects(), []);
  const { data: registros, recargar } = useApi(() => api.hours.list(), []);
  const lista = proyectos || [];
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [horas, setHoras] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!projectId && lista.length) setProjectId(String(lista[0].id));
  }, [lista, projectId]);

  const totalRegistrado = (registros || []).reduce((s, r) => s + (r.hours || 0), 0);

  const guardar = async (e) => {
    e.preventDefault();
    if (!projectId || !horas) { setMsg('Selecciona un proyecto e ingresa las horas'); setOk(false); return; }
    setSaving(true); setMsg(null);
    try {
      await api.hours.create({ projectId: Number(projectId), hours: Number(horas), description: descripcion, date });
      setMsg('Horas registradas correctamente'); setOk(true);
      setHoras(''); setDescripcion('');
      recargar();
    } catch (err) {
      setMsg(api.mensajeError(err)); setOk(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Registro"
        title="Registrar horas de servicio"
        subtitle="Documenta tu actividad del día"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={guardar}
          className="space-y-6 rounded-lg border bg-white/40 p-5 sm:p-8 lg:col-span-2"
          style={{ borderColor: 'rgba(26,26,23,0.1)' }}
        >
          <FormField label="Proyecto">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-transparent outline-none text-sm py-2 border-b"
              style={{ borderColor: 'rgba(26,26,23,0.2)' }}
            >
              {lista.length === 0 && <option value="">Sin proyecto asignado</option>}
              {lista.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField label="Fecha de la actividad">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none text-sm py-2 border-b"
                style={{ borderColor: 'rgba(26,26,23,0.2)' }}
              />
            </FormField>
            <FormField label="Número de horas">
              <input
                type="number" min="0.5" step="0.5" placeholder="4"
                value={horas}
                onChange={(e) => setHoras(e.target.value)}
                className="w-full bg-transparent outline-none py-2 border-b font-display text-2xl"
                style={{ borderColor: 'rgba(26,26,23,0.2)' }}
              />
            </FormField>
          </div>

          <FormField label="Descripción de la actividad">
            <textarea
              rows="4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe brevemente qué hiciste, con quiénes trabajaste y qué resultados obtuviste…"
              className="w-full bg-transparent outline-none text-sm py-2 border-b resize-none"
              style={{ borderColor: 'rgba(26,26,23,0.2)' }}
            />
          </FormField>

          {msg && (
            <p className="text-sm" style={{ color: ok ? '#1E3A2F' : '#9F5235' }}>{ok ? '✓ ' : ''}{msg}</p>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: '#1E3A2F', color: '#F2EBDD' }}
            >
              {saving ? 'Guardando…' : 'Guardar registro'} <ArrowRight size={14} />
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="p-5 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-3">Total registrado</p>
            <div className="font-display text-4xl tracking-tight">{totalRegistrado}h</div>
            <p className="text-xs opacity-65 mt-1">{(registros || []).length} registro{(registros || []).length !== 1 ? 's' : ''}</p>
          </div>
          <div className="p-5 rounded-lg" style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}>
            <div className="flex items-start gap-3">
              <TrendingUp size={16} className="mt-0.5" />
              <div>
                <p className="text-xs font-medium mb-1">Sigue así</p>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  Registra tus horas al terminar cada actividad para no perder el seguimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.2em] opacity-60 block mb-2">{label}</label>
    {children}
  </div>
);

// ============================================================
// STUDENT — EVIDENCE  (upload)
// ============================================================
const StudentEvidence = () => {
  const { data: proyectos } = useApi(() => api.me.projects(), []);
  const { data: evidencias, recargar } = useApi(() => api.evidence.list(), []);
  const lista = proyectos || [];
  const recientes = (evidencias || []).slice(0, 6);
  const [projectId, setProjectId] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!projectId && lista.length) setProjectId(String(lista[0].id));
  }, [lista, projectId]);

  const esPdf = (t) => (t || '').toLowerCase().includes('pdf');
  const fecha = (d) => (d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '');

  const descargar = async (ev) => {
    try { await api.evidence.download(ev.id, ev.file); }
    catch (e) { alert(api.mensajeError(e)); }
  };

  const subir = async () => {
    if (!projectId || !file) { setMsg('Selecciona un proyecto y un archivo'); setOk(false); return; }
    setSaving(true); setMsg(null);
    try {
      await api.evidence.upload(file, { projectId: Number(projectId) });
      setMsg('Evidencia subida correctamente'); setOk(true);
      setFile(null);
      recargar();
    } catch (e) {
      setMsg(api.mensajeError(e)); setOk(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Documentación"
        title="Subir evidencias"
        subtitle="Carga archivos que respalden tu actividad"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Dropzone */}
          <label
            className="block rounded-lg border-2 border-dashed bg-white/40 p-6 text-center transition-all hover:bg-white/60 sm:p-12 cursor-pointer"
            style={{ borderColor: 'rgba(30,58,47,0.25)' }}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5"
              style={{ background: 'rgba(30,58,47,0.08)' }}
            >
              <Upload size={24} strokeWidth={1.5} style={{ color: '#1E3A2F' }} />
            </div>
            <h3 className="font-display text-2xl tracking-tight">
              {file ? file.name : 'Selecciona un archivo'}
            </h3>
            <p className="text-sm opacity-65 mt-2">
              {file ? 'Haz clic para elegir otro' : 'Haz clic para seleccionar desde tu dispositivo'}
            </p>
            <p className="text-[11px] opacity-50 mt-4 uppercase tracking-wider">
              PDF · JPG · PNG · hasta 10 MB
            </p>
          </label>

          {/* Form */}
          <div className="space-y-5 rounded-lg border bg-white/40 p-4 sm:p-6" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
            <FormField label="Proyecto asociado">
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-transparent outline-none text-sm py-2 border-b"
                style={{ borderColor: 'rgba(26,26,23,0.2)' }}
              >
                {lista.length === 0 && <option value="">Sin proyecto asignado</option>}
                {lista.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </FormField>

            {msg && (
              <p className="text-sm" style={{ color: ok ? '#1E3A2F' : '#9F5235' }}>{ok ? '✓ ' : ''}{msg}</p>
            )}

            <button
              onClick={subir}
              disabled={saving}
              className="px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: '#C16E4F', color: '#F2EBDD' }}
            >
              {saving ? 'Subiendo…' : 'Subir evidencia'} <Upload size={14} />
            </button>
          </div>
        </div>

        {/* Recent uploads */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-3">Mis evidencias recientes</p>
          <div className="space-y-2">
            {recientes.length === 0 && (
              <p className="text-sm opacity-50">Aún no has subido evidencias.</p>
            )}
            {recientes.map((f) => (
              <div
                key={f.id}
                className="p-3 rounded-md border bg-white/40 flex items-center gap-3"
                style={{ borderColor: 'rgba(26,26,23,0.08)' }}
              >
                <div className="w-9 h-9 rounded flex items-center justify-center text-[10px] font-display"
                  style={{
                    background: esPdf(f.type) ? 'rgba(193,110,79,0.12)' : 'rgba(30,58,47,0.08)',
                    color: esPdf(f.type) ? '#9F5235' : '#1E3A2F',
                  }}>
                  {esPdf(f.type) ? 'PDF' : 'IMG'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{f.file}</div>
                  <div className="text-[10px] opacity-50">{fecha(f.date)}</div>
                </div>
                <button
                  onClick={() => descargar(f)}
                  className="p-1.5 rounded hover:bg-black/5 opacity-60 hover:opacity-100 transition-opacity"
                  title="Descargar"
                >
                  <Download size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KUXAAN;
