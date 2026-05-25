import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'


export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="hi">

      {/* MAIN */}
      <main className="hi-main">
        <p className="hi-label">Pilih peran Anda untuk masuk</p>
        <h1 className="hi-title">Selamat Datang</h1>

        <div className="hi-cards">

          <button className="hi-card" onClick={() => navigate('/login/kasir')}>
            <div className="hi-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="10" width="20" height="11" rx="2"/>
                <path d="M6 10V7a6 6 0 0 1 12 0v3"/>
                <path d="M12 14v3M9 14v1M15 14v1"/>
              </svg>
            </div>
            <div className="hi-card-text">
              <div className="hi-card-name">Kasir</div>
              <div className="hi-card-desc">Penjualan & transaksi harian</div>
            </div>
            <div className="hi-card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>
          </button>

          <button className="hi-card hi-card--green" onClick={() => navigate('/login/warehouse')}>
            <div className="hi-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/>
                <path d="M3 8l9 5 9-5M12 13v8"/>
              </svg>
            </div>
            <div className="hi-card-text">
              <div className="hi-card-name">Warehouse</div>
              <div className="hi-card-desc">Inventaris & manajemen stok</div>
            </div>
            <div className="hi-card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>
          </button>

        </div>
      </main>


    </div>
  )
}