import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginWarehouse.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function LoginWarehouse() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username: username.trim(), password, role: 'warehouse' }),
    })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Login gagal. Silakan coba lagi.')
        return
      }

      // Simpan token & data user
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user', JSON.stringify(data.user))

      navigate('/dashboard/warehouse')

    } catch {
      setError('Tidak dapat terhubung ke server. Periksa koneksi Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lw-wrapper">
      <div className="lw-bg-shape lw-bg-shape-1" />
      <div className="lw-bg-shape lw-bg-shape-2" />

      {/* NAVBAR */}
      <nav className="lw-nav">
        <span className="lw-nav-brand">
          <span className="lw-nav-dot" />
          Solo Motors Sistem
        </span>
        <button className="lw-nav-back" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6"/>
          </svg>
          Kembali
        </button>
      </nav>

      {/* MAIN */}
      <main className="lw-main">
        <div className="lw-login-wrap">
          <h1 className="lw-heading">
            Masuk sebagai <span>Warehouse Staff</span>
          </h1>

          <div className="lw-card">
            {/* ERROR */}
            {error && (
              <div className="lw-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* USERNAME */}
            <div className="lw-field">
              <label className="lw-label">Username</label>
              <div className="lw-input-wrap">
                <span className="lw-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="lw-input"
                  placeholder="Masukkan username"
                  value={username}
                  disabled={loading}
                  onChange={e => { setUsername(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="lw-field">
              <label className="lw-label">Password</label>
              <div className="lw-input-wrap">
                <span className="lw-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="lw-input"
                  placeholder="Masukkan password"
                  value={password}
                  disabled={loading}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button className="lw-toggle-pass" type="button" onClick={() => setShowPass(v => !v)}>
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

            {/* SUBMIT */}
            <button className="lw-btn-login" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Masuk ke Sistem
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="lw-footer">
        <span>
          <span className="lw-footer-brand">Solo Motors</span> &copy; 2024. All rights reserved.
        </span>
      </footer>
    </div>
  )
}
