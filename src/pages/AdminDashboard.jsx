import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminDashboard.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const AVATAR_COLORS = ['ua-orange', 'ua-blue', 'ua-green', 'ua-deep']

// ── Helpers ──────────────────────────────────────────────────
function getInitials(name = '') {
  return name.trim().split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
}
function getAvatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}
function formatDateTime(val) {
  if (!val) return 'Belum pernah'
  const d = new Date(val)
  return d.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
}
function roleLabel(role) {
  return { admin: 'Admin', kasir: 'Kasir', warehouse: 'Warehouse' }[role] || role
}

// ── Sub-komponen ──────────────────────────────────────────────
function RoleBadge({ role }) {
  const map = { Admin: 'badge-owner', Warehouse: 'badge-warehouse', Kasir: 'badge-kasir' }
  return (
    <span className={`badge ${map[role] || 'badge-kasir'}`}>
      <span className="badge-dot" />
      {role === 'Warehouse' ? 'Warehouse Staff' : role}
    </span>
  )
}

function StatusBadge({ active }) {
  return (
    <span className={`status-badge ${active ? 'status-active' : 'status-inactive'}`}>
      <span className="badge-dot" />
      {active ? 'Aktif' : 'Nonaktif'}
    </span>
  )
}

function ActivityIcon({ type }) {
  const map = { login: 'ai-login', create: 'ai-create', edit: 'ai-edit', disable: 'ai-disable', failed: 'ai-delete' }
  const icons = {
    login:   <><polyline points="15 3 21 3 21 9"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    create:  <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:    <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    disable: <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>,
    failed:  <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  }
  return (
    <div className={`activity-icon ${map[type] || 'ai-login'}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[type] || icons.login}
      </svg>
    </div>
  )
}

// ── Modal Tambah/Edit User ────────────────────────────────────
function UserModal({ mode, user, onClose, onSave, loading }) {
  const [form, setForm] = useState(
    mode === 'edit' && user
      ? { name: user.name, username: user.username, email: user.email || '', role: roleLabel(user.role), password: '' }
      : { name: '', username: '', email: '', role: '', password: '' }
  )
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSave() {
    if (!form.name.trim()) { setError('Nama wajib diisi'); return }
    if (!form.username.trim() && mode === 'add') { setError('Username wajib diisi'); return }
    if (!form.role) { setError('Role wajib dipilih'); return }
    if (mode === 'add' && (!form.password || form.password.length < 6)) {
      setError('Password minimal 6 karakter'); return
    }
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
          <label className="form-label">
            Password {mode === 'edit' && <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(kosongkan jika tidak diubah)</span>}
          </label>
          <input name="password" type="password" className="form-input" placeholder="Min. 6 karakter" value={form.password} onChange={handleChange} />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Batal</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Menyimpan...' : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Simpan Pengguna
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────
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

// ── Toast ─────────────────────────────────────────────────────
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

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()

  const [users, setUsers]           = useState([])
  const [activities, setActivities] = useState([])
  const [modal, setModal]           = useState(null)
  const [confirm, setConfirm]       = useState(null)
  const [toast, setToast]           = useState(null)
  const [activeNav, setActiveNav]   = useState('users')
  const [loadingData, setLoadingData] = useState(true)
  const [savingUser, setSavingUser]   = useState(false)
  const [errorData, setErrorData]     = useState('')

  const token     = sessionStorage.getItem('token')
  const adminUser = JSON.parse(sessionStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!token) navigate('/login/admin')
  }, [token, navigate])

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  // ── Fetch users ──
  const fetchUsers = useCallback(async () => {
    setLoadingData(true)
    setErrorData('')
    try {
      const res  = await fetch(`${API_URL}/users`, { headers: authHeaders })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Gagal mengambil data')
      setUsers(data.data)
    } catch (err) {
      setErrorData(err.message)
    } finally {
      setLoadingData(false)
    }
  }, [token])

  // ── Fetch log aktivitas dari database ──
  const fetchLogs = useCallback(async () => {
    try {
      const res  = await fetch(`${API_URL}/auth/logs`, { headers: authHeaders })
      const data = await res.json()
      if (!res.ok) return
      // Konversi data log ke format aktivitas
      const mapped = data.data.map(log => ({
        id:   log.id,
        type: log.status === 'failed' ? 'failed' : 'login',
        text: [
          { bold: true,  val: log.nama_lengkap || log.username },
          { bold: false, val: log.status === 'failed'
            ? ` gagal login sebagai ${roleLabel(log.role)}`
            : ` login sebagai ${roleLabel(log.role)}` },
        ],
        time: formatDateTime(log.created_at),
      }))
      setActivities(mapped)
    } catch (_) {}
  }, [token])

  useEffect(() => {
    fetchUsers()
    fetchLogs()
  }, [fetchUsers, fetchLogs])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2800)
  }

  // ── Save user ──
  async function handleSaveUser(form) {
    setSavingUser(true)
    try {
      const isAdd  = modal.mode === 'add'
      const url    = isAdd ? `${API_URL}/users` : `${API_URL}/users/${modal.user.id}`
      const method = isAdd ? 'POST' : 'PUT'

      const res  = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify({
          name:     form.name,
          username: form.username,
          email:    form.email,
          role:     form.role === 'Warehouse Staff' ? 'Warehouse' : form.role,
          password: form.password,
        })
      })
      const data = await res.json()

      if (!res.ok) {
        showToast(data.message || 'Gagal menyimpan data.', 'error')
        return
      }

      setModal(null)
      await fetchUsers()
      await fetchLogs()
      showToast(data.message)

    } catch {
      showToast('Tidak dapat terhubung ke server.', 'error')
    } finally {
      setSavingUser(false)
    }
  }

  // ── Toggle status ──
  function handleToggleStatus(user) {
    const willActivate = user.is_active === 0
    const action = willActivate ? 'aktifkan' : 'nonaktifkan'
    setConfirm({
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} akun ${user.name}?`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          const res  = await fetch(`${API_URL}/users/${user.id}/status`, {
            method:  'PATCH',
            headers: authHeaders,
            body:    JSON.stringify({ is_active: willActivate ? 1 : 0 })
          })
          const data = await res.json()
          if (!res.ok) { showToast(data.message || 'Gagal mengubah status.', 'error'); return }
          await fetchUsers()
          showToast(data.message, willActivate ? 'success' : 'warning')
        } catch {
          showToast('Tidak dapat terhubung ke server.', 'error')
        }
      }
    })
  }

  // ── Logout ──
  async function handleLogout() {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', headers: authHeaders })
    } catch (_) {}
    sessionStorage.clear()
    navigate('/login/admin')
  }

  // ── Export CSV ──
  function handleExport() {
    const header = ['Nama', 'Username', 'Email', 'Role', 'Status', 'Login Terakhir']
    const rows   = users.map(u => [
      u.name, u.username, u.email || '-',
      roleLabel(u.role),
      u.is_active ? 'Aktif' : 'Nonaktif',
      formatDateTime(u.last_login)
    ])
    const csv  = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'pengguna-solo-motors.csv'; a.click()
    URL.revokeObjectURL(url)
    showToast('Data berhasil diekspor ke CSV')
  }

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
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
            <NavItem active={activeNav === 'users'} onClick={() => setActiveNav('users')} label="Manajemen Pengguna"
              icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Sistem</div>
          <ul className="sidebar-nav">
            <NavItem active={false} onClick={handleLogout} label="Keluar"
              icon={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />
          </ul>
        </div>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="avatar">{getInitials(adminUser.nama || 'Admin')}</div>
            <div className="admin-info">
              <div className="admin-name">{adminUser.nama || 'Admin Sistem'}</div>
              <div className="admin-role">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
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

              {loadingData ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
                  Memuat data pengguna...
                </div>
              ) : errorData ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
                  {errorData} — <button className="btn btn-ghost" onClick={fetchUsers}>Coba lagi</button>
                </div>
              ) : (
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
                      {users.map((u, i) => (
                        <tr key={u.id}>
                          <td>
                            <div className="user-cell">
                              <div className={`user-avatar ${getAvatarColor(i)}`}>{getInitials(u.name)}</div>
                              <div>
                                <div className="user-name">{u.name}</div>
                                <div className="user-email">{u.email || u.username}</div>
                              </div>
                            </div>
                          </td>
                          <td><RoleBadge role={roleLabel(u.role)} /></td>
                          <td><StatusBadge active={u.is_active === 1} /></td>
                          <td><span className="last-login">{formatDateTime(u.last_login)}</span></td>
                          <td><span className="last-login">{formatDateTime(u.last_logout)}</span></td>
                          <td>
                            <div className="action-group">
                              <button className="icon-btn edit" title="Edit" onClick={() => setModal({ mode: 'edit', user: u })}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </button>
                              <button
                                className={`icon-btn ${u.is_active ? 'toggle-inactive' : 'toggle-active'}`}
                                title={u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                onClick={() => handleToggleStatus(u)}
                              >
                                {u.is_active
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
              )}

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
                    <div className="panel-subtitle">Riwayat login pengguna dari database</div>
                  </div>
                  <button className="btn btn-ghost" style={{ fontSize: '12px' }} onClick={fetchLogs}>
                    Refresh
                  </button>
                </div>
                <div className="activity-list">
                  {activities.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)', fontSize: '14px' }}>
                      Belum ada aktivitas login.
                    </div>
                  ) : activities.map(a => (
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

      {/* MODALS */}
      {modal && (
        <UserModal
          mode={modal.mode}
          user={modal.user}
          onClose={() => setModal(null)}
          onSave={handleSaveUser}
          loading={savingUser}
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