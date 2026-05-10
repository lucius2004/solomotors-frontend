import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-wrapper">
      <div className="bg-shape bg-shape-1" />
      <div className="bg-shape bg-shape-2" />

      {/* NAVBAR */}
      <nav className="home-nav">
        <span className="nav-brand">
          <span className="nav-dot" />
          Solo Motors Sistem
        </span>
        <button className="nav-lang">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Language
        </button>
      </nav>

      {/* MAIN */}
      <main className="home-main">
        <div className="hero-text">
          <h1>
            Selamat Datang di<br />
            <span>Solo Motors</span>
          </h1>
          <p>Pilih peran Anda untuk masuk ke sistem operasional harian.</p>
        </div>

        <div className="cards">
          {/* Kasir Card */}
          <div className="card" onClick={() => navigate('/login/kasir')}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="10" width="20" height="11" rx="2" />
                <path d="M6 10V7a6 6 0 0 1 12 0v3" />
                <path d="M12 14v3M9 14v1M15 14v1" />
              </svg>
            </div>
            <h2>Kasir</h2>
            <p>Akses terminal penjualan, kelola transaksi, dan shift kasir.</p>
            <div className="card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>

          {/* Warehouse Card */}
          <div className="card card-warehouse" onClick={() => navigate('/login/warehouse')}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
                <path d="M3 8l9 5 9-5M12 13v8" />
              </svg>
            </div>
            <h2>Warehouse Staff</h2>
            <p>Kelola inventaris, penerimaan barang, dan manajemen stok.</p>
            <div className="card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="home-footer">
        <span>
          <span className="footer-brand">BizManager</span> &copy; 2024 BizManager Systems. All rights reserved.
        </span>
        <nav className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support</a>
        </nav>
      </footer>
    </div>
  )
}