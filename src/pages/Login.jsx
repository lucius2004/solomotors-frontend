import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const ROLES = [
  { value: 'kasir',     label: 'Kasir (Toko/Outlet)',       route: '/dashboard/kasir'     },
  { value: 'warehouse', label: 'Admin Gudang (Inventaris)',  route: '/dashboard/warehouse' },
  { value: 'admin',     label: 'Manajer Operasional',        route: '/admin'               },
]

export default function Login() {
  const navigate  = useNavigate()
  const [role,     setRole]     = useState('kasir')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res  = await fetch(`${API_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username: username.trim(), password, role }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || 'Login gagal. Silakan coba lagi.')
        return
      }
      if (role === 'admin') sessionStorage.setItem('adminAuth', 'true')
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user',  JSON.stringify(data.user))
      navigate(ROLES.find(r => r.value === role).route)
    } catch {
      setError('Tidak dapat terhubung ke server. Periksa koneksi Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sl-wrapper">

      {/* ── KIRI ── */}
      <div className="sl-left">
        <div className="sl-left-overlay" />
        <div className="sl-left-content">
          <div className="sl-brand">
            <div className="sl-brand-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <div className="sl-brand-name">Solo Motors</div>
              <div className="sl-brand-sub">Industrial Excellence</div>
            </div>
          </div>
          <h2 className="sl-left-title">
            Solusi Operasional Bengkel &amp; Sparepart Motor.
          </h2>
        </div>
      </div>

      {/* ── KANAN ── */}
      <div className="sl-right">

        {/* Header mobile */}
        <header className="sl-right-header">
          <div className="sl-mobile-brand">
            <div className="sl-brand-icon small">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"/>
              </svg>
            </div>
            <span>Solo Motors</span>
          </div>
        </header>

        {/* Form area */}
        <div className="sl-form-area">
          <div className="sl-form-inner">

            <div className="sl-heading">
              <h3>Selamat Datang Kembali</h3>
              <p>Silakan masuk untuk mengakses panel operasional Anda.</p>
            </div>

            <form className="sl-form" onSubmit={handleLogin}>

              {error && (
                <div className="sl-error">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Role */}
              <div className="sl-field">
                <label className="sl-label">Pilih Peran</label>
                <div className="sl-select-wrap">
                  <select
                    className="sl-select"
                    value={role}
                    disabled={loading}
                    onChange={e => { setRole(e.target.value); setError('') }}
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <svg className="sl-select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* Username */}
              <div className="sl-field">
                <label className="sl-label">Email atau Username</label>
                <input
                  type="text"
                  className="sl-input"
                  placeholder="nama@perusahaan.com"
                  value={username}
                  disabled={loading}
                  onChange={e => { setUsername(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
                />
              </div>

              {/* Password */}
              <div className="sl-field">
                <label className="sl-label">Kata Sandi</label>
                <div className="sl-input-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="sl-input"
                    placeholder="••••••••"
                    value={password}
                    disabled={loading}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
                  />
                  <button type="button" className="sl-toggle-pass" onClick={() => setShowPass(v => !v)}>
                    {showPass ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="sl-btn" disabled={loading}>
                {loading ? (
                  <span className="sl-dots">
                    <span /><span /><span />
                  </span>
                ) : (
                  'Masuk'
                )}
              </button>

            </form>
          </div>
        </div>

        <footer className="sl-footer">
          <span>© 2024 Solo Motors Sistem. Seluruh hak cipta dilindungi.</span>
        </footer>
      </div>

    </div>
  )
}