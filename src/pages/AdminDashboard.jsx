import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminDashboard.css'

// ── DATA ──
const INIT_USERS = [
  { id: 1, name: 'Agus Setiawan',  role: 'Kasir',     status: 'Online',  avatar: 'AS', lastLogin: 'Hari ini, 08:30' },
  { id: 2, name: 'Dewi Lestari',   role: 'Warehouse',  status: 'Online',  avatar: 'DL', lastLogin: 'Hari ini, 09:02' },
  { id: 3, name: 'Budi Santoso',   role: 'Kasir',     status: 'Offline', avatar: 'BS', lastLogin: 'Kemarin, 17:45' },
  { id: 4, name: 'Sari Wulandari', role: 'Warehouse',  status: 'Offline', avatar: 'SW', lastLogin: 'Kemarin, 16:30' },
]

const INIT_TRX = [
  { id: '#TRX-99021', item: 'Ban Pirelli Rosso 110/70',    total: 'Rp 850.000',  status: 'Lunas'   },
  { id: '#TRX-99020', item: 'Oli Shell Advance 1L (x2)',   total: 'Rp 180.000',  status: 'Lunas'   },
  { id: '#TRX-99019', item: 'Busi NGK Iridium',            total: 'Rp 95.000',   status: 'Pending' },
  { id: '#TRX-99018', item: 'Kampas Rem Depan Honda',      total: 'Rp 45.000',   status: 'Lunas'   },
]

const INIT_ACTIVITY = [
  { time: '09:45', staff: 'Agus Setiawan',  act: 'Melakukan transaksi #TRX-99021' },
  { time: '09:12', staff: 'Dewi Lestari',   act: 'Update stok Busi NGK Iridium IX' },
  { time: '08:30', staff: 'Agus Setiawan',  act: 'Login Kasir' },
]

const SPARE_PARTS = [
  { name: 'Synthorq 10W-40',  stok: '45 Botol',      pct: 82, color: '#006c49' },
  { name: 'Radial Sport Tire', stok: '4 Set (Kritis)', pct: 12, color: '#ba1a1a' },
  { name: 'NGK Iridium IX',   stok: '120 Pcs',        pct: 64, color: '#00714d' },
  { name: 'Gir & Rantai Set', stok: '12 Set',         pct: 38, color: '#7c839b' },
]

const AVATAR_COLORS = ['#131b2e','#006c49','#ba1a1a','#3f465c','#00714d']

function nowStr() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

// ── MODAL ──
function UserModal({ mode, user, onClose, onSave }) {
  const [form, setForm] = useState(
    mode === 'edit' && user
      ? { name: user.name, role: user.role, password: '' }
      : { name: '', role: 'Kasir', password: '' }
  )
  const [err, setErr] = useState('')

  function save() {
    if (!form.name.trim()) { setErr('Nama wajib diisi'); return }
    onSave(form); setErr('')
  }

  return (
    <div className="ad-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ad-modal">
        <div className="ad-modal-head">
          <div>
            <div className="ad-modal-title">{mode === 'add' ? 'Tambah Staff Baru' : 'Edit Staff'}</div>
            <div className="ad-modal-sub">{mode === 'add' ? 'Isi data untuk akun baru' : 'Perbarui data staff'}</div>
          </div>
          <button className="ad-icon-btn" onClick={onClose}>✕</button>
        </div>

        {err && <div className="ad-form-error">{err}</div>}

        <div className="ad-form-group">
          <label className="ad-label">Nama Lengkap</label>
          <input className="ad-input" value={form.name} placeholder="Nama staff"
            onChange={e => { setForm(f => ({...f, name: e.target.value})); setErr('') }} />
        </div>
        <div className="ad-form-group">
          <label className="ad-label">Peran</label>
          <select className="ad-select" value={form.role}
            onChange={e => setForm(f => ({...f, role: e.target.value}))}>
            <option value="Kasir">Kasir</option>
            <option value="Warehouse">Warehouse Staff</option>
          </select>
        </div>
        <div className="ad-form-group">
          <label className="ad-label">Password {mode === 'edit' && <span style={{fontWeight:400,color:'#76777d'}}>(kosongkan jika tidak diubah)</span>}</label>
          <input className="ad-input" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
        </div>

        <div className="ad-modal-foot">
          <button className="ad-btn ad-btn-ghost" onClick={onClose}>Batal</button>
          <button className="ad-btn ad-btn-primary" onClick={save}>Simpan</button>
        </div>
      </div>
    </div>
  )
}

// ── CONFIRM ──
function Confirm({ msg, onConfirm, onCancel }) {
  return (
    <div className="ad-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="ad-modal" style={{maxWidth:360}}>
        <div className="ad-modal-head">
          <div className="ad-modal-title">Konfirmasi</div>
          <button className="ad-icon-btn" onClick={onCancel}>✕</button>
        </div>
        <p style={{fontSize:'0.86rem',color:'#45464d',margin:'0 0 20px'}}>{msg}</p>
        <div className="ad-modal-foot">
          <button className="ad-btn ad-btn-ghost" onClick={onCancel}>Batal</button>
          <button className="ad-btn ad-btn-danger" onClick={onConfirm}>Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  )
}

// ── TOAST ──
function Toast({ msg, type }) {
  return (
    <div className={`ad-toast ad-toast-${type}`}>{msg}</div>
  )
}

// ── NAV ITEMS ──
const NAV = [
  { id: 'dashboard', label: 'Dashboard',        icon: '⊞' },
  { id: 'staff',     label: 'Staff Management', icon: '👥' },
]

// ── MAIN ──
export default function AdminDashboard() {
  const navigate  = useNavigate()
  const [tab, setTab]         = useState('dashboard')
  const [users, setUsers]     = useState(INIT_USERS)
  const [activity, setActivity] = useState(INIT_ACTIVITY)
  const [modal, setModal]     = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast]     = useState(null)
  const [search, setSearch]   = useState('')

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2600)
  }

  function addActivity(text) {
    setActivity(prev => [{ time: nowStr(), staff: 'Admin', act: text }, ...prev])
  }

  function handleSave(form) {
    setModal(null)
    if (modal.mode === 'add') {
      const initials = form.name.trim().split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
      setUsers(prev => [...prev, {
        id: Math.random().toString(36).slice(2),
        name: form.name.trim(), role: form.role,
        status: 'Offline', avatar: initials,
        lastLogin: 'Belum pernah',
      }])
      addActivity(`Menambahkan staff baru: ${form.name.trim()}`)
      showToast(`${form.name.trim()} berhasil ditambahkan`)
    } else {
      setUsers(prev => prev.map(u => u.id === modal.user.id
        ? { ...u, name: form.name.trim(), role: form.role } : u))
      addActivity(`Mengubah data: ${form.name.trim()}`)
      showToast(`Data ${form.name.trim()} diperbarui`)
    }
  }

  function handleToggle(user) {
    setConfirm({
      msg: `${user.status === 'Online' ? 'Nonaktifkan' : 'Aktifkan'} akun ${user.name}?`,
      onConfirm: () => {
        setConfirm(null)
        setUsers(prev => prev.map(u => u.id === user.id
          ? { ...u, status: u.status === 'Online' ? 'Offline' : 'Online' } : u))
        addActivity(`${user.status === 'Online' ? 'Menonaktifkan' : 'Mengaktifkan'} akun ${user.name}`)
        showToast(`Akun ${user.name} diperbarui`)
      }
    })
  }

  function handleExport() {
    const rows = [['Nama','Peran','Status','Login Terakhir'],
      ...users.map(u => [u.name, u.role, u.status, u.lastLogin])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'}))
    a.download = 'staff-solo-motors.csv'; a.click()
    showToast('Data diekspor ke CSV')
  }

  function handleLogout() {
    sessionStorage.clear()
    navigate('/')
  }

  const onlineCount = users.filter(u => u.status === 'Online').length

  return (
    <div className="ad-wrapper">

      {/* ── SIDEBAR ── */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-brand">
          <h1 className="ad-brand-name">Solo Motors</h1>
          <p className="ad-brand-sub">Admin Panel</p>
        </div>

        <nav className="ad-nav">
          {NAV.map(n => (
            <button key={n.id}
              className={`ad-nav-item ${tab === n.id ? 'active' : ''}`}
              onClick={() => setTab(n.id)}>
              <span className="ad-nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <div className="ad-main">

        {/* TOPBAR */}
        <header className="ad-topbar">
          <div className="ad-search-wrap">
            <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="ad-search" placeholder="Cari transaksi atau spare part..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="ad-topbar-right">
            <div className="ad-avatar-sm">A</div>
            <button className="ad-logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Keluar
            </button>
          </div>
        </header>

        {/* ══ DASHBOARD TAB ══ */}
        {tab === 'dashboard' && (
          <main className="ad-content">

            {/* Welcome */}
            <div className="ad-welcome-row">
              <div>
                <h2 className="ad-welcome-title">Ringkasan Operasional</h2>
                <p className="ad-welcome-sub">Halo Manager, berikut adalah performa bisnis hari ini.</p>
              </div>
              <button className="ad-btn ad-btn-outline" onClick={handleExport}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Laporan
              </button>
            </div>

            {/* Summary Cards */}
            <div className="ad-summary-grid">
              <div className="ad-summary-card">
                <div className="ad-summary-top">
                  <span className="ad-summary-label">Total Pendapatan</span>
                  <span className="ad-badge ad-badge-green">+12.5%</span>
                </div>
                <div className="ad-summary-val">Rp 42.850.000</div>
                <div className="ad-summary-note">Bulan ini vs bulan lalu</div>
              </div>
              <div className="ad-summary-card">
                <div className="ad-summary-top">
                  <span className="ad-summary-label">Volume Transaksi</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#76777d" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <div className="ad-summary-val">156</div>
                <div className="ad-summary-note">hari ini</div>
              </div>
              <div className="ad-summary-card">
                <div className="ad-summary-top">
                  <span className="ad-summary-label">Stok Kritis</span>
                  <span className="ad-badge ad-badge-red">12 Item</span>
                </div>
                <div className="ad-summary-val" style={{color:'#ba1a1a'}}>7 Item</div>
                <div className="ad-summary-note" style={{textDecoration:'underline',cursor:'pointer'}}>Lihat Inventaris</div>
              </div>
              <div className="ad-summary-card">
                <div className="ad-summary-top">
                  <span className="ad-summary-label">Staff Aktif</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#76777d" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="ad-summary-val">{onlineCount} / {users.length}</div>
                <div className="ad-summary-note">Shift pagi & sore</div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="ad-content-grid">
              <div className="ad-col-left">

                {/* Recent Transactions */}
                <div className="ad-panel">
                  <div className="ad-panel-head">
                    <h4 className="ad-panel-title">Transaksi Terakhir</h4>
                    <a className="ad-link">Lihat Semua</a>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th>ID Transaksi</th>
                          <th>Item</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INIT_TRX.map((t, i) => (
                          <tr key={i} className="zebra">
                            <td className="ad-mono">{t.id}</td>
                            <td className="ad-muted">{t.item}</td>
                            <td className="ad-bold">{t.total}</td>
                            <td>
                              <span className={`ad-status-badge ${t.status === 'Lunas' ? 'ad-status-lunas' : 'ad-status-pending'}`}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Staff Status */}
                <div className="ad-panel">
                  <div className="ad-panel-head">
                    <h4 className="ad-panel-title">Status Staff</h4>
                  </div>
                  <div className="ad-staff-grid">
                    {users.map(u => (
                      <div key={u.id} className="ad-staff-item">
                        <div className="ad-avatar" style={{background: AVATAR_COLORS[u.id % AVATAR_COLORS.length] || '#131b2e'}}>
                          {u.avatar}
                        </div>
                        <div className="ad-staff-info">
                          <div className="ad-staff-name">{u.name}</div>
                          <div className="ad-staff-role">{u.role}</div>
                        </div>
                        <div className="ad-staff-status">
                          <div className={`ad-status-dot ${u.status === 'Online' ? 'dot-online' : 'dot-offline'}`} />
                          <span className={u.status === 'Online' ? 'ad-online-txt' : 'ad-offline-txt'}>
                            {u.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Log */}
                <div className="ad-panel">
                  <div className="ad-panel-head">
                    <h4 className="ad-panel-title">Log Aktivitas Staf</h4>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th>Waktu</th>
                          <th>Staf</th>
                          <th>Aktivitas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.map((a, i) => (
                          <tr key={i} className="zebra">
                            <td className="ad-mono">{a.time}</td>
                            <td className="ad-bold">{a.staff}</td>
                            <td className="ad-muted">{a.act}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right: Spare Parts */}
              <div className="ad-col-right">
                <div className="ad-panel">
                  <div className="ad-panel-head">
                    <h4 className="ad-panel-title">Top 5 Spare Part Terlaris</h4>
                  </div>
                  <div className="ad-parts-list">
                    {SPARE_PARTS.map((p, i) => (
                      <div key={i} className="ad-part-item">
                        <div className="ad-part-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <div className="ad-part-info">
                          <div className="ad-part-row">
                            <span className="ad-part-name">{p.name}</span>
                            <span className="ad-part-pct" style={{color: p.color}}>{p.pct}%</span>
                          </div>
                          <div className="ad-part-stok">{p.stok}</div>
                          <div className="ad-part-bar-bg">
                            <div className="ad-part-bar-fill" style={{width:`${p.pct}%`, background: p.color}} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ══ STAFF MANAGEMENT TAB ══ */}
        {tab === 'staff' && (
          <main className="ad-content">
            <div className="ad-welcome-row">
              <div>
                <h2 className="ad-welcome-title">Staff Management</h2>
                <p className="ad-welcome-sub">Kelola akun dan akses staff sistem.</p>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button className="ad-btn ad-btn-outline" onClick={handleExport}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export
                </button>
                <button className="ad-btn ad-btn-primary" onClick={() => setModal({mode:'add'})}>
                  + Tambah Staff
                </button>
              </div>
            </div>

            <div className="ad-panel">
              <div className="ad-panel-head">
                <h4 className="ad-panel-title">Daftar Staff</h4>
                <span className="ad-muted" style={{fontSize:'0.76rem'}}>{users.length} pengguna</span>
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Peran</th>
                      <th>Status</th>
                      <th>Login Terakhir</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="zebra">
                        <td>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <div className="ad-avatar" style={{width:32,height:32,fontSize:'0.68rem',background: AVATAR_COLORS[u.id % AVATAR_COLORS.length] || '#131b2e'}}>
                              {u.avatar}
                            </div>
                            <span className="ad-bold">{u.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`ad-role-badge ${u.role === 'Kasir' ? 'role-kasir' : 'role-wh'}`}>
                            {u.role === 'Warehouse' ? 'Warehouse Staff' : u.role}
                          </span>
                        </td>
                        <td>
                          <div style={{display:'flex',alignItems:'center',gap:6}}>
                            <div className={`ad-status-dot ${u.status === 'Online' ? 'dot-online' : 'dot-offline'}`} />
                            <span className={u.status === 'Online' ? 'ad-online-txt' : 'ad-offline-txt'} style={{fontSize:'0.76rem',fontWeight:700}}>
                              {u.status}
                            </span>
                          </div>
                        </td>
                        <td className="ad-muted" style={{fontSize:'0.76rem'}}>{u.lastLogin}</td>
                        <td>
                          <div style={{display:'flex',gap:6}}>
                            <button className="ad-action-btn edit" onClick={() => setModal({mode:'edit',user:u})}>Edit</button>
                            <button className="ad-action-btn toggle" onClick={() => handleToggle(u)}>
                              {u.status === 'Online' ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Log */}
            <div className="ad-panel">
              <div className="ad-panel-head">
                <h4 className="ad-panel-title">Log Aktivitas</h4>
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th>Waktu</th><th>Staf</th><th>Aktivitas</th></tr>
                  </thead>
                  <tbody>
                    {activity.map((a, i) => (
                      <tr key={i} className="zebra">
                        <td className="ad-mono">{a.time}</td>
                        <td className="ad-bold">{a.staff}</td>
                        <td className="ad-muted">{a.act}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* MODALS */}
      {modal   && <UserModal mode={modal.mode} user={modal.user} onClose={() => setModal(null)} onSave={handleSave} />}
      {confirm && <Confirm msg={confirm.msg} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {toast   && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}