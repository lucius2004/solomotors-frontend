import { useState } from 'react'
import '../styles/AdminDashboard.css'

// ── INITIAL DATA ──
const INITIAL_USERS = [
  { id: 1, name: 'Budi Santoso',  username: 'budi.s',  email: 'budi@solomotors.id',  role: 'Owner',     avatar: 'BS', color: 'ua-orange', status: 'Aktif',    lastLogin: 'Hari ini, 08:14',  lastLogout: 'Hari ini, 08:00' },
  { id: 2, name: 'Sari Dewi',     username: 'sari.d',  email: 'sari@solomotors.id',  role: 'Warehouse',  avatar: 'SD', color: 'ua-blue',   status: 'Aktif',    lastLogin: 'Hari ini, 09:02',  lastLogout: 'Kemarin, 17:45' },
  { id: 3, name: 'Ahmad Fauzi',   username: 'ahmad.f', email: 'ahmad@solomotors.id', role: 'Owner',     avatar: 'AF', color: 'ua-green',  status: 'Aktif',    lastLogin: 'Hari ini, 07:55',  lastLogout: 'Kemarin, 16:30' },
]

const INITIAL_ACTIVITIES = [
  { id: 1, type: 'login',  text: [{ bold: false, val: '' }, { bold: true, val: 'Sari Dewi' }, { bold: false, val: ' login sebagai Warehouse' }], time: '09:02 — Hari ini' },
  { id: 2, type: 'create', text: [{ bold: true, val: 'Admin Sistem' }, { bold: false, val: ' menambahkan pengguna ' }, { bold: true, val: 'Sari Dewi' }], time: '08:47 — Hari ini' },
  { id: 3, type: 'edit',   text: [{ bold: true, val: 'Admin Sistem' }, { bold: false, val: ' mengubah data ' }, { bold: true, val: 'Ahmad Fauzi' }], time: '08:30 — Hari ini' },
  { id: 4, type: 'login',  text: [{ bold: true, val: 'Budi Santoso' }, { bold: false, val: ' login sebagai Owner' }], time: 'Kemarin, 07:45' },
]

const AVATAR_COLORS = ['ua-orange', 'ua-blue', 'ua-green', 'ua-deep']

function now() {
  const d = new Date()
  return `Hari ini, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

// ── ROLE BADGE ──
function RoleBadge({ role }) {
  const map = { Owner: 'badge-owner', Warehouse: 'badge-warehouse', Kasir: 'badge-kasir' }
  const cls = map[role] || 'badge-owner'
  const label = role === 'Warehouse' ? 'Warehouse Staff' : role
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {label}
    </span>
  )
}

// ── STATUS BADGE ──
function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status === 'Aktif' ? 'status-active' : 'status-inactive'}`}>
      <span className="badge-dot" />
      {status}
    </span>
  )
}

// ── ACTIVITY ICON ──
function ActivityIcon({ type }) {
  const map = { login: 'ai-login', create: 'ai-create', edit: 'ai-edit', delete: 'ai-delete', disable: 'ai-disable' }
  const icons = {
    login: <><polyline points="15 3 21 3 21 9"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    create: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    delete: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></>,
    disable: <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>,
  }
  return (
    <div className={`activity-icon ${map[type] || 'ai-login'}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[type] || icons.login}
      </svg>
    </div>
  )
}

// ── MODAL ──
function UserModal({ mode, user, onClose, onSave }) {
  const [form, setForm] = useState(
    mode === 'edit' && user
      ? { name: user.name, username: user.username, email: user.email, role: user.role, password: '' }
      : { name: '', username: '', email: '', role: '', password: '' }
  )
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSave() {
    if (!form.name.trim()) { setError('Nama wajib diisi'); return }
    if (!form.role) { setError('Role wajib dipilih'); return }
    onSave(form)
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{mode === 'edit' ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</div>
            <div className="modal-sub">{mode === 'edit' ? 'Perbarui data pengguna' : 'Isi data pengguna dan tetapkan role'}</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input name="name" className="form-input" placeholder="Masukkan nama" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input name="username" className="form-input" placeholder="username" value={form.username} onChange={handleChange} disabled={mode === 'edit'} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input name="email" type="email" className="form-input" placeholder="email@solomotors.id" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <select name="role" className="form-select" value={form.role} onChange={handleChange}>
            <option value="">Pilih Role</option>
            <option value="Kasir">Kasir</option>
            <option value="Warehouse">Warehouse Staff</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Password {mode === 'edit' && <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(kosongkan jika tidak diubah)</span>}</label>
          <input name="password" type="password" className="form-input" placeholder="Min. 8 karakter" value={form.password} onChange={handleChange} />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Simpan Pengguna
          </button>
        </div>
      </div>
    </div>
  )
}

// ── CONFIRM DIALOG ──
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Konfirmasi</div>
            <div className="modal-sub">{message}</div>
          </div>
          <button className="modal-close" onClick={onCancel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Batal</button>
          <button className="btn btn-danger" onClick={onConfirm}>Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  )
}

// ── TOAST ──
function Toast({ message, type }) {
  return (
    <div className={`toast toast-${type}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {type === 'success'
          ? <polyline points="20 6 9 17 4 12"/>
          : <><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/><circle cx="12" cy="12" r="10"/></>
        }
      </svg>
      {message}
    </div>
  )
}

// ── SIDEBAR NAV ITEM ──
function NavItem({ active, onClick, icon, label }) {
  return (
    <li>
      <a className={active ? 'active' : ''} onClick={onClick} style={{ cursor: 'pointer' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
        <span className="nav-label">{label}</span>
      </a>
    </li>
  )
}

// ── MAIN COMPONENT ──
export default function AdminDashboard() {
  const [users, setUsers]           = useState(INITIAL_USERS)
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES)
  const [modal, setModal]           = useState(null)   // null | { mode: 'add'|'edit', user? }
  const [confirm, setConfirm]       = useState(null)   // null | { message, onConfirm }
  const [toast, setToast]           = useState(null)   // null | { message, type }
  const [activeNav, setActiveNav]   = useState('users')

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2800)
  }

  function addActivity(type, textParts) {
    setActivities(prev => [
      { id: prev.length + Date.now(), type, text: textParts, time: now() },
      ...prev,
    ])
  }

  // ── SAVE USER (add / edit) ──
  function handleSaveUser(form) {
    setModal(null)
    if (modal.mode === 'add') {
      const initials = form.name.trim().split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
      const newUser = {
        id: Math.random().toString(36).slice(2),
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role || 'Kasir',
        avatar: initials,
        color: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
        status: 'Aktif',
        lastLogin: 'Belum pernah login',
        lastLogout: '—',
      }
      setUsers(prev => [...prev, newUser])
      addActivity('create', [
        { bold: true, val: 'Admin Sistem' },
        { bold: false, val: ' menambahkan pengguna ' },
        { bold: true, val: form.name.trim() },
      ])
      showToast(`Pengguna ${form.name.trim()} berhasil ditambahkan`)
    } else {
      setUsers(prev => prev.map(u =>
        u.id === modal.user.id
          ? { ...u, name: form.name.trim(), email: form.email.trim(), role: form.role }
          : u
      ))
      addActivity('edit', [
        { bold: true, val: 'Admin Sistem' },
        { bold: false, val: ' mengubah data ' },
        { bold: true, val: form.name.trim() },
      ])
      showToast(`Data ${form.name.trim()} berhasil diperbarui`)
    }
  }

  // ── TOGGLE STATUS ──
  function handleToggleStatus(user) {
    const action = user.status === 'Aktif' ? 'nonaktifkan' : 'aktifkan'
    setConfirm({
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} akun ${user.name}?`,
      onConfirm: () => {
        setConfirm(null)
        const newStatus = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif'
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
        addActivity('disable', [
          { bold: true, val: 'Admin Sistem' },
          { bold: false, val: ` ${action === 'nonaktifkan' ? 'menonaktifkan' : 'mengaktifkan'} akun ` },
          { bold: true, val: user.name },
        ])
        showToast(`Akun ${user.name} berhasil di${action}kan`, newStatus === 'Aktif' ? 'success' : 'warning')
      }
    })
  }

  // ── EXPORT ──
  function handleExport() {
    const header = ['Nama', 'Username', 'Email', 'Role', 'Status', 'Login Terakhir']
    const rows = users.map(u => [u.name, u.username, u.email, u.role, u.status, u.lastLogin])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'pengguna-solo-motors.csv'; a.click()
    URL.revokeObjectURL(url)
    showToast('Data berhasil diekspor ke CSV')
  }

  return (
    <div className="admin-wrapper">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
            </svg>
          </div>
          <div className="logo-text">Solo Motors<span>Admin Panel</span></div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Utama</div>
          <ul className="sidebar-nav">
            <NavItem active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')} label="Dashboard"
              icon={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>} />
            <NavItem active={activeNav === 'users'} onClick={() => setActiveNav('users')} label="Manajemen Pengguna"
              icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Operasional</div>
          <ul className="sidebar-nav">
            <NavItem active={activeNav === 'inventory'} onClick={() => setActiveNav('inventory')} label="Inventaris"
              icon={<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>} />
            <NavItem active={activeNav === 'transactions'} onClick={() => setActiveNav('transactions')} label="Transaksi"
              icon={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>} />
            <NavItem active={activeNav === 'reports'} onClick={() => setActiveNav('reports')} label="Laporan"
              icon={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>} />
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Sistem</div>
          <ul className="sidebar-nav">
            <NavItem active={false} onClick={() => {}} label="Keluar"
              icon={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />
          </ul>
        </div>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="avatar">AS</div>
            <div className="admin-info">
              <div className="admin-name">Admin Sistem</div>
              <div className="admin-role">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <h1>Manajemen Pengguna</h1>
            <p>Kelola akun pengguna sistem</p>
          </div>
          <div className="topbar-right">
            <button className="btn btn-ghost" onClick={handleExport}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
            <button className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Tambah Pengguna
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="content">
          <div className="two-col">

            {/* USER TABLE */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">Daftar Pengguna</div>
                  <div className="panel-subtitle">Pengguna terdaftar dalam sistem</div>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Pengguna</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Login Terakhir</th>
                      <th>Logout Terakhir</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-cell">
                            <div className={`user-avatar ${u.color}`}>{u.avatar}</div>
                            <div>
                              <div className="user-name">{u.name}</div>
                              <div className="user-email">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><RoleBadge role={u.role} /></td>
                        <td><StatusBadge status={u.status} /></td>
                        <td><span className="last-login">{u.lastLogin}</span></td>
                        <td><span className="last-login">{u.lastLogout || '—'}</span></td>
                        <td>
                          <div className="action-group">
                            <button
                              className="icon-btn edit"
                              title="Edit"
                              onClick={() => setModal({ mode: 'edit', user: u })}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button
                              className={`icon-btn ${u.status === 'Aktif' ? 'toggle-inactive' : 'toggle-active'}`}
                              title={u.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                              onClick={() => handleToggleStatus(u)}
                            >
                              {u.status === 'Aktif'
                                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              }
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span>Menampilkan {users.length} pengguna</span>
              </div>
            </div>

            {/* ACTIVITY LOG */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <div className="panel-title">Log Aktivitas</div>
                    <div className="panel-subtitle">Aktivitas terbaru pengguna</div>
                  </div>
                </div>
                <div className="activity-list">
                  {activities.map(a => (
                    <div className="activity-item" key={a.id}>
                      <ActivityIcon type={a.type} />
                      <div className="activity-content">
                        <div className="activity-text">
                          {a.text.map((seg, i) =>
                            seg.bold ? <strong key={i}>{seg.val}</strong> : <span key={i}>{seg.val}</span>
                          )}
                        </div>
                        <div className="activity-time">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MODALS & OVERLAYS ── */}
      {modal && (
        <UserModal
          mode={modal.mode}
          user={modal.user}
          onClose={() => setModal(null)}
          onSave={handleSaveUser}
        />
      )}

      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type || 'success'} />}
    </div>
  )
}