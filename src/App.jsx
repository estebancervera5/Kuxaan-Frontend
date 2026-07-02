import React, { useState } from 'react';
import {
  LayoutDashboard, Users, FolderKanban, GitBranch, Clock, FileImage,
  FileBarChart, LogOut, Search, Plus, MoreHorizontal, ChevronRight,
  Upload, Calendar, Filter, Download, Eye, Edit3, Trash2, User,
  Mail, Lock, ArrowRight, Sparkles, TrendingUp, CheckCircle2,
  BookOpen, MapPin, Bell, Menu
} from 'lucide-react';

// ============================================================
// KUXAAN — Plataforma de Servicio Social
// Frontend Prototype · React + Tailwind
// ============================================================

const KUXAAN = () => {
  const [view, setView] = useState('login');     // login | admin | student
  const [adminPage, setAdminPage] = useState('dashboard');
  const [studentPage, setStudentPage] = useState('dashboard');

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
        {view === 'login'   && <Login onLogin={(role) => setView(role)} />}
        {view === 'admin'   && (
          <AdminShell page={adminPage} setPage={setAdminPage} onLogout={() => setView('login')} />
        )}
        {view === 'student' && (
          <StudentShell page={studentPage} setPage={setStudentPage} onLogout={() => setView('login')} />
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
                className="w-full bg-transparent outline-none text-sm py-1"
              />
            </Field>

            <div className="flex items-center justify-between text-xs pt-2">
              <label className="flex items-center gap-2 opacity-70 cursor-pointer">
                <input type="checkbox" className="accent-emerald-900" /> Mantener sesión
              </label>
              <a href="#" className="opacity-70 hover:opacity-100 underline underline-offset-4">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] opacity-50">
              Demo — acceder como:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onLogin('admin')}
                className="group flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-all"
                style={{ background: '#1E3A2F', color: '#F2EBDD' }}
              >
                <span>Administrador</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onLogin('student')}
                className="group flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium border transition-all"
                style={{ borderColor: '#1E3A2F', color: '#1E3A2F' }}
              >
                <span>Estudiante</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
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
const AdminShell = ({ page, setPage, onLogout }) => {
  const nav = [
    { id: 'dashboard',   label: 'Panel general',  icon: LayoutDashboard },
    { id: 'students',    label: 'Estudiantes',    icon: Users },
    { id: 'projects',    label: 'Proyectos',      icon: FolderKanban },
    { id: 'assignments', label: 'Asignaciones',   icon: GitBranch },
    { id: 'hours',       label: 'Control de horas', icon: Clock },
    { id: 'evidence',    label: 'Evidencias',     icon: FileImage },
    { id: 'reports',     label: 'Reportes',       icon: FileBarChart },
  ];

  return (
    <AppShell
      nav={nav}
      page={page}
      setPage={setPage}
      role="Administrador"
      name="Isabella Ortiz"
      onLogout={onLogout}
      maxWidth="max-w-[1400px]"
    >
      {page === 'dashboard'   && <AdminDashboard />}
      {page === 'students'    && <StudentsPage />}
      {page === 'projects'    && <ProjectsPage />}
      {page === 'assignments' && <AssignmentsPage />}
      {page === 'hours'       && <HoursPage />}
      {page === 'evidence'    && <EvidencePage />}
      {page === 'reports'     && <ReportsPage />}
    </AppShell>
  );
};

// ============================================================
// STUDENT SHELL
// ============================================================
const StudentShell = ({ page, setPage, onLogout }) => {
  const nav = [
    { id: 'dashboard', label: 'Inicio',           icon: LayoutDashboard },
    { id: 'profile',   label: 'Mi perfil',        icon: User },
    { id: 'project',   label: 'Mi proyecto',      icon: FolderKanban },
    { id: 'hours',     label: 'Registrar horas',  icon: Clock },
    { id: 'evidence',  label: 'Subir evidencias', icon: Upload },
  ];

  return (
    <AppShell
      nav={nav}
      page={page}
      setPage={setPage}
      role="Estudiante"
      name="Diego Pech Canul"
      onLogout={onLogout}
      accent
      maxWidth="max-w-[1100px]"
    >
      {page === 'dashboard' && <StudentDashboard />}
      {page === 'profile'   && <StudentProfile />}
      {page === 'project'   && <StudentProject />}
      {page === 'hours'     && <StudentHours />}
      {page === 'evidence'  && <StudentEvidence />}
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
    <div className="flex items-center gap-2 sm:gap-3">
      <button className="p-2.5 rounded-md hover:bg-black/5 transition-colors">
        <Search size={16} strokeWidth={1.8} />
      </button>
      <button className="p-2.5 rounded-md hover:bg-black/5 transition-colors relative">
        <Bell size={16} strokeWidth={1.8} />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: '#C16E4F' }} />
      </button>
      <div className="h-6 w-px" style={{ background: 'rgba(26,26,23,0.15)' }} />
      <div className="hidden text-xs opacity-60 sm:block">
        {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  </div>
);

// ============================================================
// ADMIN — DASHBOARD
// ============================================================
const AdminDashboard = () => {
  const metrics = [
    { label: 'Estudiantes activos',  value: '184', delta: '+12 este mes', icon: Users },
    { label: 'Proyectos en curso',   value: '23',  delta: '+3 nuevos',    icon: FolderKanban },
    { label: 'Horas registradas',    value: '4,820', delta: 'Este periodo', icon: Clock },
    { label: 'Evidencias cargadas',  value: '1,107', delta: '+86 esta semana', icon: FileImage },
  ];

  return (
    <div className="space-y-10">
      {/* Hero strip */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: '#C16E4F' }}>
            Periodo Enero – Junio 2026
          </p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight leading-tight">
            Buenos días, Isabella. <em className="italic font-light opacity-70">El servicio sigue vivo.</em>
          </h2>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all hover:opacity-90"
          style={{ background: '#1E3A2F', color: '#F2EBDD' }}
        >
          <Sparkles size={14} /> Generar reporte mensual
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

      {/* Two columns */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Activity chart */}
        <div
          className="p-4 sm:p-6 rounded-lg border bg-white/40 xl:col-span-2"
          style={{ borderColor: 'rgba(26,26,23,0.1)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg tracking-tight">Horas registradas</h3>
              <p className="text-xs opacity-60">Últimos 6 meses</p>
            </div>
            <select className="text-xs bg-transparent border rounded px-3 py-1.5 opacity-70"
              style={{ borderColor: 'rgba(26,26,23,0.15)' }}>
              <option>Todos los proyectos</option>
            </select>
          </div>
          <BarChart />
        </div>

        {/* Recent activity */}
        <div
          className="p-4 sm:p-6 rounded-lg border bg-white/40"
          style={{ borderColor: 'rgba(26,26,23,0.1)' }}
        >
          <h3 className="font-display text-lg tracking-tight mb-1">Actividad reciente</h3>
          <p className="text-xs opacity-60 mb-5">En las últimas 24 horas</p>
          <div className="space-y-4">
            {[
              { who: 'María Couoh', what: 'Subió 3 evidencias',  when: 'hace 12 min', dot: '#C16E4F' },
              { who: 'Carlos Uc',   what: 'Registró 4h en Milpa', when: 'hace 1 h',    dot: '#1E3A2F' },
              { who: 'Ana Balam',   what: 'Completó 240h',        when: 'hace 3 h',    dot: '#C16E4F' },
              { who: 'Luis Pat',    what: 'Nuevo en el sistema',  when: 'hace 5 h',    dot: '#1E3A2F' },
            ].map((a, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: a.dot }} />
                <div className="text-xs flex-1">
                  <div><span className="font-medium">{a.who}</span> · {a.what}</div>
                  <div className="opacity-50 mt-0.5">{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
        <div className="space-y-3">
          {[
            { name: 'Milpa Maya Comunitaria', area: 'Agroecología', students: 18, hours: 1240, pct: 92 },
            { name: 'Alfabetización Digital Mayab', area: 'Educación', students: 12, hours: 880, pct: 71 },
            { name: 'Salud Itinerante Yucatán', area: 'Salud', students: 9, hours: 620, pct: 54 },
            { name: 'Lengua Maya en Aulas', area: 'Cultura', students: 7, hours: 410, pct: 38 },
          ].map((p) => (
            <div key={p.name} className="grid grid-cols-2 gap-3 py-3 sm:grid-cols-12 sm:items-center sm:gap-4 sm:py-2">
              <div className="col-span-2 sm:col-span-4">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-[11px] opacity-50">{p.area}</div>
              </div>
              <div className="text-xs opacity-70 sm:col-span-2">{p.students} estudiantes</div>
              <div className="text-xs opacity-70 sm:col-span-2">{p.hours} h</div>
              <div className="col-span-2 sm:col-span-3">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,26,23,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: '#1E3A2F' }} />
                </div>
              </div>
              <div className="text-xs opacity-70 sm:col-span-1 sm:text-right">{p.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BarChart = () => {
  const data = [
    { m: 'Ene', v: 480 }, { m: 'Feb', v: 620 }, { m: 'Mar', v: 580 },
    { m: 'Abr', v: 790 }, { m: 'May', v: 910 }, { m: 'Jun', v: 1440 },
  ];
  const max = Math.max(...data.map(d => d.v));
  return (
    <div className="flex items-end gap-3 h-48">
      {data.map((d, i) => {
        const h = (d.v / max) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={d.m} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-[10px] opacity-50">{d.v}</div>
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: `${h}%`,
                background: isLast ? '#C16E4F' : '#1E3A2F',
              }}
            />
            <div className="text-[10px] uppercase tracking-wider opacity-60">{d.m}</div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// ADMIN — STUDENTS
// ============================================================
const StudentsPage = () => {
  const students = [
    { name: 'María Couoh Tun',    career: 'Trabajo Social',       uni: 'UADY',    period: 'Ene–Jun 2026', hours: 180, status: 'Activo'      },
    { name: 'Carlos Uc Poot',     career: 'Agronomía',            uni: 'ITM',     period: 'Ene–Jun 2026', hours: 142, status: 'Activo'      },
    { name: 'Ana Balam Chí',      career: 'Pedagogía',            uni: 'UADY',    period: 'Ene–Jun 2026', hours: 240, status: 'Completado'  },
    { name: 'Luis Pat Caamal',    career: 'Comunicación',         uni: 'Anáhuac', period: 'Ene–Jun 2026', hours: 36,  status: 'Activo'      },
    { name: 'Sofía Tzul Cetina',  career: 'Enfermería',           uni: 'UADY',    period: 'Ene–Jun 2026', hours: 198, status: 'Activo'      },
    { name: 'José Canul May',     career: 'Sistemas',             uni: 'ITM',     period: 'Ago–Dic 2025', hours: 240, status: 'Completado'  },
    { name: 'Pamela Dzul Ek',     career: 'Lingüística',          uni: 'UADY',    period: 'Ene–Jun 2026', hours: 88,  status: 'Activo'      },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Gestión"
        title="Estudiantes"
        subtitle="184 estudiantes registrados · 7 universidades"
        action={{ label: 'Nuevo estudiante', icon: Plus }}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div
          className="flex w-full items-center gap-2 rounded-md border bg-white/40 px-3 py-2 sm:max-w-xs sm:flex-1"
          style={{ borderColor: 'rgba(26,26,23,0.1)' }}
        >
          <Search size={14} className="opacity-50" />
          <input
            placeholder="Buscar por nombre, carrera o universidad…"
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
        <FilterChip label="Carrera" />
        <FilterChip label="Universidad" />
        <FilterChip label="Periodo" />
        <FilterChip label="Estado" />
      </div>

      {/* Table */}
      <div
        className="rounded-lg border overflow-x-auto bg-white/40"
        style={{ borderColor: 'rgba(26,26,23,0.1)' }}
      >
        <table className="min-w-[780px] w-full text-sm">
          <thead style={{ background: 'rgba(30,58,47,0.04)' }}>
            <tr className="text-left">
              {['Nombre', 'Carrera', 'Universidad', 'Periodo', 'Horas', 'Estado', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-medium opacity-60">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'rgba(26,26,23,0.06)' }}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium"
                      style={{ background: '#1E3A2F', color: '#F2EBDD' }}
                    >
                      {s.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 opacity-80">{s.career}</td>
                <td className="px-5 py-4 opacity-80">{s.uni}</td>
                <td className="px-5 py-4 opacity-80">{s.period}</td>
                <td className="px-5 py-4 font-medium">{s.hours} h</td>
                <td className="px-5 py-4">
                  <StatusPill status={s.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="opacity-50 hover:opacity-100 p-1">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs opacity-60">
        <span>Mostrando 7 de 184</span>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 rounded border" style={{ borderColor: 'rgba(26,26,23,0.15)' }}>← Anterior</button>
          <button className="px-3 py-1.5 rounded border" style={{ borderColor: 'rgba(26,26,23,0.15)' }}>Siguiente →</button>
        </div>
      </div>
    </div>
  );
};

const FilterChip = ({ label }) => (
  <button
    className="flex items-center gap-2 px-3 py-2 rounded-md text-xs border bg-white/40 hover:bg-white/70 transition-colors"
    style={{ borderColor: 'rgba(26,26,23,0.1)' }}
  >
    <Filter size={12} className="opacity-50" />
    {label}
  </button>
);

const StatusPill = ({ status }) => {
  const styles = {
    'Activo':     { bg: 'rgba(30,58,47,0.1)',  color: '#1E3A2F' },
    'Completado': { bg: 'rgba(193,110,79,0.15)', color: '#9F5235' },
    'En revisión':{ bg: 'rgba(26,26,23,0.08)', color: '#1A1A17' },
  };
  const s = styles[status] || styles['Activo'];
  return (
    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
      {status}
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
        className="flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 sm:min-h-0"
        style={{ background: '#1E3A2F', color: '#F2EBDD' }}
      >
        <action.icon size={14} /> {action.label}
      </button>
    )}
  </div>
);

// ============================================================
// ADMIN — PROJECTS
// ============================================================
const ProjectsPage = () => {
  const projects = [
    { name: 'Milpa Maya Comunitaria', area: 'Agroecología', loc: 'Tixkokob',  team: 18, hours: 1240, status: 'Activo', desc: 'Recuperación de prácticas agrícolas tradicionales con familias del oriente.' },
    { name: 'Alfabetización Digital Mayab', area: 'Educación', loc: 'Mérida', team: 12, hours: 880, status: 'Activo', desc: 'Talleres de tecnología básica para adultos mayores de comisarías.' },
    { name: 'Salud Itinerante Yucatán', area: 'Salud', loc: 'Yaxcabá', team: 9, hours: 620, status: 'Activo', desc: 'Brigadas mensuales de chequeo médico en comunidades del sur.' },
    { name: 'Lengua Maya en Aulas', area: 'Cultura', loc: 'Valladolid', team: 7, hours: 410, status: 'Activo', desc: 'Material didáctico bilingüe para primarias rurales.' },
    { name: 'Huertos Urbanos', area: 'Sostenibilidad', loc: 'Mérida', team: 5, hours: 180, status: 'En pausa', desc: 'Construcción de huertos comunitarios en colonias del sur.' },
    { name: 'Memoria Oral del Mayab', area: 'Cultura', loc: 'Maní', team: 4, hours: 95, status: 'Activo', desc: 'Registro audiovisual de tradiciones orales con abuelos.' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Gestión"
        title="Proyectos comunitarios"
        subtitle="23 proyectos activos · 6 áreas de impacto"
        action={{ label: 'Nuevo proyecto', icon: Plus }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border bg-white/40 hover:bg-white/60 transition-all cursor-pointer group"
            style={{ borderColor: 'rgba(26,26,23,0.1)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded"
                style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}>
                {p.area}
              </span>
              <StatusPill status={p.status} />
            </div>
            <h3 className="font-display text-xl tracking-tight leading-tight mb-2">{p.name}</h3>
            <p className="text-xs opacity-65 leading-relaxed mb-5">{p.desc}</p>
            <div className="flex items-center gap-4 text-[11px] opacity-70 pt-4 border-t" style={{ borderColor: 'rgba(26,26,23,0.08)' }}>
              <span className="flex items-center gap-1.5"><MapPin size={11} /> {p.loc}</span>
              <span className="flex items-center gap-1.5"><Users size={11} /> {p.team}</span>
              <span className="flex items-center gap-1.5"><Clock size={11} /> {p.hours}h</span>
              <ChevronRight size={14} className="ml-auto opacity-50 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// ADMIN — ASSIGNMENTS
// ============================================================
const AssignmentsPage = () => {
  const [selected, setSelected] = useState(['María Couoh Tun', 'Sofía Tzul Cetina']);
  const available = [
    'María Couoh Tun', 'Carlos Uc Poot', 'Luis Pat Caamal', 'Sofía Tzul Cetina',
    'Pamela Dzul Ek', 'Roberto Kú Ay', 'Elena Chablé Pat',
  ];

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
          <select className="w-full text-sm bg-transparent border rounded-md px-3 py-2.5"
            style={{ borderColor: 'rgba(26,26,23,0.15)' }}>
            <option>Milpa Maya Comunitaria</option>
            <option>Alfabetización Digital Mayab</option>
            <option>Salud Itinerante Yucatán</option>
          </select>

          <div className="mt-5 p-4 rounded-md" style={{ background: 'rgba(30,58,47,0.06)' }}>
            <div className="text-xs opacity-60 mb-1">Proyecto seleccionado</div>
            <div className="font-display text-lg tracking-tight mb-1">Milpa Maya Comunitaria</div>
            <div className="text-xs opacity-60 leading-relaxed">
              Tixkokob · Agroecología · 18 estudiantes asignados actualmente
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2">Paso 2</p>
          <h3 className="font-display text-2xl tracking-tight mb-5">
            Selecciona estudiantes <span className="opacity-50 text-base">({selected.length})</span>
          </h3>

          <div className="space-y-1 max-h-80 overflow-y-auto pr-2">
            {available.map((name) => {
              const checked = selected.includes(name);
              return (
                <label
                  key={name}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer hover:bg-black/5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelected(checked
                        ? selected.filter(s => s !== name)
                        : [...selected, name]);
                    }}
                    className="accent-emerald-900"
                  />
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium"
                    style={{ background: '#1E3A2F', color: '#F2EBDD' }}
                  >
                    {name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <span className="text-sm flex-1">{name}</span>
                </label>
              );
            })}
          </div>

          <button
            className="w-full mt-5 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium"
            style={{ background: '#C16E4F', color: '#F2EBDD' }}
          >
            Asignar {selected.length} estudiante{selected.length !== 1 ? 's' : ''} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADMIN — HOURS
// ============================================================
const HoursPage = () => {
  const rows = [
    { student: 'María Couoh Tun',  project: 'Milpa Maya',         date: '12 May 2026', hours: 5,  desc: 'Preparación de terreno y siembra de calabaza'  },
    { student: 'Carlos Uc Poot',   project: 'Milpa Maya',         date: '12 May 2026', hours: 4,  desc: 'Aplicación de composta y riego'                 },
    { student: 'Sofía Tzul Cetina',project: 'Salud Itinerante',   date: '11 May 2026', hours: 6,  desc: 'Brigada de chequeo en Yaxcabá'                  },
    { student: 'Ana Balam Chí',    project: 'Alfabetización',     date: '11 May 2026', hours: 3,  desc: 'Taller de uso de tableta para adultos'          },
    { student: 'Pamela Dzul Ek',   project: 'Lengua Maya',        date: '10 May 2026', hours: 4,  desc: 'Diseño de material didáctico bilingüe'          },
    { student: 'Luis Pat Caamal',  project: 'Memoria Oral',       date: '10 May 2026', hours: 5,  desc: 'Entrevista con Don Pablo Chuc'                  },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Seguimiento"
        title="Control de horas"
        subtitle="4,820 horas registradas este periodo"
        action={{ label: 'Exportar', icon: Download }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <FilterChip label="Estudiante" />
        <FilterChip label="Proyecto" />
        <FilterChip label="Mes" />
        <FilterChip label="Rango de fechas" />
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
            {rows.map((r, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'rgba(26,26,23,0.06)' }}>
                <td className="px-5 py-4 font-medium">{r.student}</td>
                <td className="px-5 py-4 opacity-80">{r.project}</td>
                <td className="px-5 py-4 opacity-80">{r.date}</td>
                <td className="px-5 py-4">
                  <span className="font-display text-lg" style={{ color: '#C16E4F' }}>{r.hours}</span>
                  <span className="text-xs opacity-50 ml-1">h</span>
                </td>
                <td className="px-5 py-4 opacity-75 max-w-xs">{r.desc}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 hover:bg-black/5 rounded"><Edit3 size={13} /></button>
                    <button className="p-1.5 hover:bg-black/5 rounded"><Trash2 size={13} /></button>
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

// ============================================================
// ADMIN — EVIDENCE
// ============================================================
const EvidencePage = () => {
  const items = [
    { student: 'María Couoh', project: 'Milpa Maya', file: 'siembra-calabaza-12may.jpg', type: 'Imagen', date: '12 May 2026' },
    { student: 'Carlos Uc',   project: 'Milpa Maya', file: 'reporte-composta.pdf',        type: 'PDF',    date: '12 May 2026' },
    { student: 'Sofía Tzul',  project: 'Salud',      file: 'brigada-yaxcaba-01.jpg',      type: 'Imagen', date: '11 May 2026' },
    { student: 'Ana Balam',   project: 'Alfabetización', file: 'taller-tableta.jpg',      type: 'Imagen', date: '11 May 2026' },
    { student: 'Pamela Dzul', project: 'Lengua Maya', file: 'material-bilingue.pdf',      type: 'PDF',    date: '10 May 2026' },
    { student: 'Luis Pat',    project: 'Memoria Oral', file: 'entrevista-don-pablo.pdf',  type: 'PDF',    date: '10 May 2026' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Documentación"
        title="Evidencias"
        subtitle="1,107 archivos cargados · 86 esta semana"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((e, i) => (
          <div
            key={i}
            className="rounded-lg border bg-white/40 overflow-hidden group hover:bg-white/60 transition-all"
            style={{ borderColor: 'rgba(26,26,23,0.1)' }}
          >
            <div
              className="aspect-[4/3] flex items-center justify-center relative"
              style={{
                background: e.type === 'PDF'
                  ? 'linear-gradient(135deg, rgba(193,110,79,0.12), rgba(193,110,79,0.04))'
                  : 'linear-gradient(135deg, rgba(30,58,47,0.12), rgba(30,58,47,0.04))',
              }}
            >
              <div className="font-display text-5xl tracking-tight opacity-30">
                {e.type === 'PDF' ? 'PDF' : 'IMG'}
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(30,58,47,0.6)' }}>
                <button className="p-2 rounded-md" style={{ background: '#F2EBDD' }}><Eye size={14} /></button>
                <button className="p-2 rounded-md" style={{ background: '#F2EBDD' }}><Download size={14} /></button>
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm font-medium truncate">{e.file}</div>
              <div className="text-[11px] opacity-60 mt-1">
                {e.student} · {e.project}
              </div>
              <div className="text-[10px] opacity-50 mt-1.5 uppercase tracking-wider">{e.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// ADMIN — REPORTS
// ============================================================
const ReportsPage = () => {
  const types = [
    { title: 'Reporte por estudiante', desc: 'Horas, proyectos y evidencias por participante', icon: User },
    { title: 'Reporte por proyecto',   desc: 'Estudiantes asignados y avance de actividades',  icon: FolderKanban },
    { title: 'Reporte de horas',       desc: 'Acumulado de horas por periodo y proyecto',      icon: Clock },
    { title: 'Reporte de evidencias',  desc: 'Listado de archivos cargados al sistema',        icon: FileImage },
    { title: 'Reporte general',        desc: 'Visión global del estado del sistema',           icon: FileBarChart },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Análisis"
        title="Generación de reportes"
        subtitle="Exporta información en formato PDF o Excel"
      />

      {/* Filters card */}
      <div className="p-4 sm:p-6 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
        <h3 className="font-display text-lg tracking-tight mb-4">Filtros</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="Periodo"     options={['Ene–Jun 2026', 'Ago–Dic 2025', 'Todos']} />
          <FilterSelect label="Proyecto"    options={['Todos', 'Milpa Maya', 'Salud Itinerante']} />
          <FilterSelect label="Estudiante"  options={['Todos', 'Por carrera', 'Por universidad']} />
          <FilterSelect label="Estado"      options={['Activo', 'Completado', 'Todos']} />
        </div>
      </div>

      {/* Report types */}
      <div>
        <h3 className="font-display text-2xl tracking-tight mb-5">Tipos de reporte</h3>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {types.map((t, i) => (
            <div
              key={i}
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
                <button className="px-3 py-1.5 rounded-md text-xs border flex items-center gap-1.5"
                  style={{ borderColor: 'rgba(26,26,23,0.15)' }}>
                  <Download size={12} /> PDF
                </button>
                <button className="px-3 py-1.5 rounded-md text-xs border flex items-center gap-1.5"
                  style={{ borderColor: 'rgba(26,26,23,0.15)' }}>
                  <Download size={12} /> Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, options }) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.2em] opacity-60 block mb-2">{label}</label>
    <select className="w-full text-sm bg-white/60 border rounded-md px-3 py-2"
      style={{ borderColor: 'rgba(26,26,23,0.15)' }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

// ============================================================
// STUDENT — DASHBOARD
// ============================================================
const StudentDashboard = () => (
  <div className="space-y-10">
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: '#C16E4F' }}>
        Periodo Enero – Junio 2026
      </p>
      <h2 className="font-display text-3xl sm:text-4xl tracking-tight leading-tight max-w-xl">
        Hola, Diego. <em className="italic font-light opacity-70">Vas por buen camino.</em>
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
            142<span className="text-3xl opacity-50">/240</span>
          </div>
          <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(242,235,221,0.15)' }}>
            <div className="h-full rounded-full" style={{ width: '59%', background: '#C16E4F' }} />
          </div>
          <p className="text-xs opacity-70 mt-2">59% completado · 98 horas restantes</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-3">Mi proyecto</p>
          <div className="font-display text-2xl tracking-tight leading-tight">
            Milpa Maya Comunitaria
          </div>
          <p className="text-xs opacity-70 mt-2 flex items-center gap-1.5">
            <MapPin size={11} /> Tixkokob, Yucatán
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-3">Evidencias</p>
          <div className="font-display text-5xl sm:text-6xl tracking-tight leading-none">14</div>
          <p className="text-xs opacity-70 mt-3">Archivos cargados · última hace 2 días</p>
        </div>
      </div>
    </div>

    {/* Quick actions */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div
        className="flex items-center justify-between rounded-lg border bg-white/40 p-4 transition-all hover:bg-white/60 sm:p-6"
        style={{ borderColor: 'rgba(26,26,23,0.1)' }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Acción rápida</p>
          <h3 className="font-display text-xl sm:text-2xl tracking-tight">Registrar nuevas horas</h3>
          <p className="text-xs opacity-65 mt-1">Anota tu actividad de hoy</p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
          style={{ background: '#C16E4F' }}
        >
          <Plus size={20} style={{ color: '#F2EBDD' }} />
        </div>
      </div>

      <div
        className="flex items-center justify-between rounded-lg border bg-white/40 p-4 transition-all hover:bg-white/60 sm:p-6"
        style={{ borderColor: 'rgba(26,26,23,0.1)' }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Acción rápida</p>
          <h3 className="font-display text-xl sm:text-2xl tracking-tight">Subir evidencias</h3>
          <p className="text-xs opacity-65 mt-1">PDF o imagen, hasta 10 MB</p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
          style={{ background: '#1E3A2F' }}
        >
          <Upload size={18} style={{ color: '#F2EBDD' }} />
        </div>
      </div>
    </div>

    {/* History */}
    <div className="p-4 sm:p-6 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
      <h3 className="font-display text-lg tracking-tight mb-1">Últimos registros</h3>
      <p className="text-xs opacity-60 mb-5">Tus actividades más recientes</p>
      <div className="space-y-3">
        {[
          { date: '12 May', hours: 5, desc: 'Preparación de terreno y siembra de calabaza' },
          { date: '08 May', hours: 4, desc: 'Aplicación de composta orgánica' },
          { date: '05 May', hours: 6, desc: 'Capacitación con familias del oriente' },
          { date: '01 May', hours: 3, desc: 'Reunión de planeación mensual' },
        ].map((h, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3 py-2 sm:gap-5">
            <div className="text-xs font-mono opacity-70 w-16">{h.date}</div>
            <div className="font-display text-xl" style={{ color: '#C16E4F' }}>
              {h.hours}<span className="text-xs opacity-50 ml-0.5">h</span>
            </div>
            <div className="text-sm opacity-80 flex-1">{h.desc}</div>
            <CheckCircle2 size={14} style={{ color: '#1E3A2F' }} className="opacity-60" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// STUDENT — PROFILE
// ============================================================
const StudentProfile = () => (
  <div className="space-y-8">
    <PageHeader eyebrow="Mi cuenta" title="Información personal" />

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="p-4 sm:p-6 rounded-lg border bg-white/40 text-center" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
        <div
          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center font-display text-3xl mb-4"
          style={{ background: '#1E3A2F', color: '#F2EBDD' }}
        >
          DP
        </div>
        <h3 className="font-display text-2xl tracking-tight">Diego Pech Canul</h3>
        <p className="text-sm opacity-60 mt-1">diego.pech@uady.mx</p>
        <div className="mt-4 inline-block px-3 py-1 rounded-full text-[11px]"
          style={{ background: 'rgba(30,58,47,0.1)', color: '#1E3A2F' }}>
          Activo · 142h acumuladas
        </div>
      </div>

      <div className="space-y-5 rounded-lg border bg-white/40 p-4 sm:p-6 lg:col-span-2" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
        <InfoRow label="Nombre completo"   value="Diego Alejandro Pech Canul" />
        <InfoRow label="Correo electrónico" value="diego.pech@uady.mx" />
        <InfoRow label="Carrera"           value="Ingeniería en Sistemas Computacionales" />
        <InfoRow label="Universidad"        value="Universidad Autónoma de Yucatán (UADY)" />
        <InfoRow label="Periodo"           value="Enero – Junio 2026" />
        <InfoRow label="Proyecto asignado" value="Milpa Maya Comunitaria" last />
      </div>
    </div>
  </div>
);

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
const StudentProject = () => (
  <div className="space-y-8">
    <PageHeader eyebrow="Mi proyecto" title="Milpa Maya Comunitaria" />

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-lg border bg-white/40 p-5 sm:p-8 lg:col-span-2" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
        <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded"
          style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}>
          Agroecología
        </span>
        <h3 className="font-display text-3xl tracking-tight mt-4 leading-tight">
          Recuperación de prácticas agrícolas tradicionales
        </h3>
        <p className="text-sm opacity-75 leading-relaxed mt-4 max-w-prose">
          Trabajamos con familias del oriente de Yucatán para recuperar la milpa
          como sistema agrícola tradicional. El proyecto busca rescatar
          conocimientos ancestrales sobre la siembra de maíz, frijol y calabaza,
          mientras se promueven prácticas agroecológicas sostenibles que
          fortalezcan la seguridad alimentaria de las comunidades.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Detail label="Responsable" value="Dra. Luisa Cetina Tun" />
          <Detail label="Comunidad"   value="Tixkokob, Yucatán" />
          <Detail label="Estado"      value="Activo · en ejecución" />
          <Detail label="Inicio"      value="Enero 2026" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-lg" style={{ background: '#1E3A2F', color: '#F2EBDD' }}>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2">Mi progreso</p>
          <div className="font-display text-4xl tracking-tight">142h</div>
          <p className="text-xs opacity-70 mt-1">de 240 horas requeridas</p>
        </div>
        <div className="p-5 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2">Compañeros en el proyecto</p>
          <div className="font-display text-4xl tracking-tight">18</div>
          <p className="text-xs opacity-65 mt-1">estudiantes asignados</p>
        </div>
      </div>
    </div>
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">{label}</div>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

// ============================================================
// STUDENT — HOURS  (formulario)
// ============================================================
const StudentHours = () => (
  <div className="space-y-8">
    <PageHeader
      eyebrow="Registro"
      title="Registrar horas de servicio"
      subtitle="Documenta tu actividad del día"
    />

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <form
        className="space-y-6 rounded-lg border bg-white/40 p-5 sm:p-8 lg:col-span-2"
        style={{ borderColor: 'rgba(26,26,23,0.1)' }}
      >
        <FormField label="Proyecto">
          <select className="w-full bg-transparent outline-none text-sm py-2 border-b"
            style={{ borderColor: 'rgba(26,26,23,0.2)' }}>
            <option>Milpa Maya Comunitaria</option>
          </select>
        </FormField>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField label="Fecha de la actividad">
            <input type="date" defaultValue="2026-05-14"
              className="w-full bg-transparent outline-none text-sm py-2 border-b"
              style={{ borderColor: 'rgba(26,26,23,0.2)' }} />
          </FormField>
          <FormField label="Número de horas">
            <input type="number" defaultValue="4" min="0.5" step="0.5"
              className="w-full bg-transparent outline-none text-sm py-2 border-b font-display text-2xl"
              style={{ borderColor: 'rgba(26,26,23,0.2)' }} />
          </FormField>
        </div>

        <FormField label="Descripción de la actividad">
          <textarea
            rows="4"
            placeholder="Describe brevemente qué hiciste, con quiénes trabajaste y qué resultados obtuviste…"
            className="w-full bg-transparent outline-none text-sm py-2 border-b resize-none"
            style={{ borderColor: 'rgba(26,26,23,0.2)' }}
          />
        </FormField>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
            style={{ background: '#1E3A2F', color: '#F2EBDD' }}
          >
            Guardar registro <ArrowRight size={14} />
          </button>
          <button
            type="button"
            className="px-5 py-2.5 rounded-md text-sm font-medium border"
            style={{ borderColor: 'rgba(26,26,23,0.2)' }}
          >
            Cancelar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="p-5 rounded-lg border bg-white/40" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-3">Esta semana</p>
          <div className="font-display text-4xl tracking-tight">12h</div>
          <p className="text-xs opacity-65 mt-1">+ 4h promedio diario</p>
        </div>
        <div className="p-5 rounded-lg" style={{ background: 'rgba(193,110,79,0.12)', color: '#9F5235' }}>
          <div className="flex items-start gap-3">
            <TrendingUp size={16} className="mt-0.5" />
            <div>
              <p className="text-xs font-medium mb-1">Vas adelantado</p>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Si mantienes este ritmo, completarás tus 240 horas antes del 15 de junio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FormField = ({ label, children }) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.2em] opacity-60 block mb-2">{label}</label>
    {children}
  </div>
);

// ============================================================
// STUDENT — EVIDENCE  (upload)
// ============================================================
const StudentEvidence = () => (
  <div className="space-y-8">
    <PageHeader
      eyebrow="Documentación"
      title="Subir evidencias"
      subtitle="Carga archivos que respalden tu actividad"
    />

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Dropzone */}
        <div
          className="rounded-lg border-2 border-dashed bg-white/40 p-6 text-center transition-all hover:bg-white/60 sm:p-12"
          style={{ borderColor: 'rgba(30,58,47,0.25)' }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5"
            style={{ background: 'rgba(30,58,47,0.08)' }}
          >
            <Upload size={24} strokeWidth={1.5} style={{ color: '#1E3A2F' }} />
          </div>
          <h3 className="font-display text-2xl tracking-tight">Arrastra archivos aquí</h3>
          <p className="text-sm opacity-65 mt-2">
            o <span className="underline underline-offset-4">selecciona desde tu dispositivo</span>
          </p>
          <p className="text-[11px] opacity-50 mt-4 uppercase tracking-wider">
            PDF · JPG · PNG · hasta 10 MB
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5 rounded-lg border bg-white/40 p-4 sm:p-6" style={{ borderColor: 'rgba(26,26,23,0.1)' }}>
          <FormField label="Proyecto asociado">
            <select className="w-full bg-transparent outline-none text-sm py-2 border-b"
              style={{ borderColor: 'rgba(26,26,23,0.2)' }}>
              <option>Milpa Maya Comunitaria</option>
            </select>
          </FormField>
          <FormField label="Descripción breve">
            <input
              placeholder="Ej: Fotografía de la siembra de calabaza, 12 de mayo"
              className="w-full bg-transparent outline-none text-sm py-2 border-b"
              style={{ borderColor: 'rgba(26,26,23,0.2)' }}
            />
          </FormField>

          <button
            className="px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
            style={{ background: '#C16E4F', color: '#F2EBDD' }}
          >
            Subir evidencia <Upload size={14} />
          </button>
        </div>
      </div>

      {/* Recent uploads */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-3">Mis evidencias recientes</p>
        <div className="space-y-2">
          {[
            { name: 'siembra-12may.jpg', date: 'hace 2 días' },
            { name: 'reporte-mes.pdf',   date: 'hace 5 días' },
            { name: 'taller-equipo.jpg', date: 'hace 1 semana' },
            { name: 'composta.pdf',      date: 'hace 1 semana' },
          ].map((f, i) => (
            <div
              key={i}
              className="p-3 rounded-md border bg-white/40 flex items-center gap-3"
              style={{ borderColor: 'rgba(26,26,23,0.08)' }}
            >
              <div className="w-9 h-9 rounded flex items-center justify-center text-[10px] font-display"
                style={{
                  background: f.name.endsWith('.pdf') ? 'rgba(193,110,79,0.12)' : 'rgba(30,58,47,0.08)',
                  color: f.name.endsWith('.pdf') ? '#9F5235' : '#1E3A2F',
                }}>
                {f.name.endsWith('.pdf') ? 'PDF' : 'IMG'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{f.name}</div>
                <div className="text-[10px] opacity-50">{f.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default KUXAAN;
