import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginKasir.css'

export default function LoginKasir() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState(false)

  function handleLogin() {
    if (!username.trim() || !password) {
      setError(true)
      return
    }
    setError(false)
    navigate('/dashboard/kasir')
  }

  return (
    <div className="lk-wrapper">
      <div className="lk-bg-shape lk-bg-shape-1" />
      <div className="lk-bg-shape lk-bg-shape-2" />

      {/* NAVBAR */}
      <nav className="lk-nav">
        <span className="lk-nav-brand">
          <span className="lk-nav-dot" />
          Solo Motors Sistem
        </span>
        <button className="lk-nav-back" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6"/>
          </svg>
          Kembali
        </button>
      </nav>

      {/* MAIN */}
      <main className="lk-main">
        <div className="lk-login-wrap">
          <h1 className="lk-heading">
            Masuk sebagai <span>Kasir</span>
          </h1>

          <div className="lk-card">
            {/* ERROR */}
            {error && (
              <div className="lk-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Username atau password tidak boleh kosong. Silakan coba lagi.
              </div>
            )}

            {/* USERNAME */}
            <div className="lk-field">
              <label className="lk-label">Username</label>
              <div className="lk-input-wrap">
                <span className="lk-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="lk-input"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(false) }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="lk-field">
              <label className="lk-label">Password</label>
              <div className="lk-input-wrap">
                <span className="lk-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="lk-input"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(false) }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button className="lk-toggle-pass" type="button" onClick={() => setShowPass(v => !v)}>
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
            <button className="lk-btn-login" onClick={handleLogin}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Masuk ke Sistem
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="lk-footer">
        <span>
          <span className="lk-footer-brand">Solo Motors</span> &copy; 2024. All rights reserved.
        </span>
      </footer>
    </div>
  )
}