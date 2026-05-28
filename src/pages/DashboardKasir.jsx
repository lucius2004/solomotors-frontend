import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/DashboardKasir.css'

// Sample produk
const PRODUK = [
  { id: 1, nama: 'Oli Mesin 1L',       harga: 45000,  stok: 24, kategori: 'Oli' },
  { id: 2, nama: 'Oli Mesin 2L',       harga: 85000,  stok: 18, kategori: 'Oli' },
  { id: 3, nama: 'Ban Dalam 70/90',    harga: 35000,  stok: 12, kategori: 'Ban' },
  { id: 4, nama: 'Ban Dalam 80/90',    harga: 38000,  stok: 10, kategori: 'Ban' },
  { id: 5, nama: 'Busi NGK',           harga: 25000,  stok: 30, kategori: 'Spare Part' },
  { id: 6, nama: 'Kampas Rem Depan',   harga: 55000,  stok: 8,  kategori: 'Spare Part' },
  { id: 7, nama: 'Kampas Rem Belakang',harga: 50000,  stok: 6,  kategori: 'Spare Part' },
  { id: 8, nama: 'Filter Udara',       harga: 40000,  stok: 15, kategori: 'Spare Part' },
  { id: 9, nama: 'Rantai Motor',       harga: 120000, stok: 5,  kategori: 'Spare Part' },
  { id:10, nama: 'Aki Motor 5Ah',      harga: 180000, stok: 7,  kategori: 'Aki' },
  { id:11, nama: 'Aki Motor 7Ah',      harga: 230000, stok: 4,  kategori: 'Aki' },
  { id:12, nama: 'Lampu LED Depan',    harga: 65000,  stok: 20, kategori: 'Lampu' },
]

const KATEGORI = ['Semua', 'Oli', 'Ban', 'Spare Part', 'Aki', 'Lampu']

const RIWAYAT_SAMPLE = [
  { id: 'TRX-001', waktu: '08:15', items: 3, total: 155000, bayar: 200000 },
  { id: 'TRX-002', waktu: '09:02', items: 1, total: 45000,  bayar: 50000  },
  { id: 'TRX-003', waktu: '10:30', items: 2, total: 305000, bayar: 350000 },
]

function fmt(n) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export default function DashboardKasir() {
  const navigate   = useNavigate()
  const user       = JSON.parse(sessionStorage.getItem('user') || '{}')

  const [kategori, setKategori]   = useState('Semua')
  const [keranjang, setKeranjang] = useState([])
  const [bayar, setBayar]         = useState('')
  const [tab, setTab]             = useState('kasir') // 'kasir' | 'riwayat'
  const [sukses, setSukses]       = useState(null)
  const [search, setSearch]       = useState('')

  const produkFilter = PRODUK.filter(p =>
    (kategori === 'Semua' || p.kategori === kategori) &&
    p.nama.toLowerCase().includes(search.toLowerCase())
  )

  const total      = keranjang.reduce((s, i) => s + i.harga * i.qty, 0)
  const kembalian  = parseInt(bayar.replace(/\D/g, '') || 0) - total
  const bayarNum   = parseInt(bayar.replace(/\D/g, '') || 0)

  function tambahKeranjang(p) {
    setKeranjang(prev => {
      const ada = prev.find(i => i.id === p.id)
      if (ada) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...p, qty: 1 }]
    })
  }

  function ubahQty(id, val) {
    if (val < 1) return hapusItem(id)
    setKeranjang(prev => prev.map(i => i.id === id ? { ...i, qty: val } : i))
  }

  function hapusItem(id) {
    setKeranjang(prev => prev.filter(i => i.id !== id))
  }

  function prosesBayar() {
    if (keranjang.length === 0 || bayarNum < total) return
    setSukses({ total, bayar: bayarNum, kembalian, items: keranjang.length })
    setKeranjang([])
    setBayar('')
  }

  function tutupSukses() { setSukses(null) }

  function handleLogout() {
    sessionStorage.clear()
    navigate('/login/kasir')
  }

  return (
    <div className="dk-wrapper">

      {/* NAVBAR */}
      <nav className="dk-nav">
        <span className="dk-nav-brand">
          <span className="dk-nav-dot" />
          Solo Motors — Kasir
        </span>
        <div className="dk-nav-right">
          <span className="dk-nav-user">
            <span className="dk-avatar">{(user.name || 'K')[0].toUpperCase()}</span>
            {user.name || 'Kasir'}
          </span>
          <button className="dk-nav-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Keluar
          </button>
        </div>
      </nav>

      {/* TAB */}
      <div className="dk-tabs">
        <button className={`dk-tab ${tab === 'kasir' ? 'active' : ''}`} onClick={() => setTab('kasir')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="10" width="20" height="11" rx="2"/>
            <path d="M6 10V7a6 6 0 0 1 12 0v3"/>
          </svg>
          Terminal Kasir
        </button>
        <button className={`dk-tab ${tab === 'riwayat' ? 'active' : ''}`} onClick={() => setTab('riwayat')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          Riwayat Transaksi
        </button>
      </div>

      {/* ── TERMINAL KASIR ── */}
      {tab === 'kasir' && (
        <div className="dk-content">

          {/* KIRI — Produk */}
          <div className="dk-produk-panel">
            {/* Search + Filter */}
            <div className="dk-toolbar">
              <div className="dk-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  placeholder="Cari produk..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="dk-kategori">
                {KATEGORI.map(k => (
                  <button
                    key={k}
                    className={`dk-kat-btn ${kategori === k ? 'active' : ''}`}
                    onClick={() => setKategori(k)}
                  >{k}</button>
                ))}
              </div>
            </div>

            {/* Grid Produk */}
            <div className="dk-produk-grid">
              {produkFilter.map(p => (
                <button
                  key={p.id}
                  className="dk-produk-card"
                  onClick={() => tambahKeranjang(p)}
                  disabled={p.stok === 0}
                >
                  <div className="dk-produk-kat">{p.kategori}</div>
                  <div className="dk-produk-nama">{p.nama}</div>
                  <div className="dk-produk-harga">{fmt(p.harga)}</div>
                  <div className={`dk-produk-stok ${p.stok < 5 ? 'low' : ''}`}>
                    Stok: {p.stok}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* KANAN — Keranjang */}
          <div className="dk-keranjang-panel">
            <div className="dk-keranjang-header">
              <span className="dk-keranjang-title">Keranjang</span>
              {keranjang.length > 0 && (
                <button className="dk-clear-btn" onClick={() => setKeranjang([])}>Kosongkan</button>
              )}
            </div>

            {/* Item keranjang */}
            <div className="dk-keranjang-list">
              {keranjang.length === 0 ? (
                <div className="dk-keranjang-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <p>Keranjang kosong</p>
                  <span>Pilih produk di sebelah kiri</span>
                </div>
              ) : (
                keranjang.map(item => (
                  <div key={item.id} className="dk-keranjang-item">
                    <div className="dk-item-info">
                      <div className="dk-item-nama">{item.nama}</div>
                      <div className="dk-item-harga">{fmt(item.harga)}</div>
                    </div>
                    <div className="dk-item-qty">
                      <button onClick={() => ubahQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => ubahQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <div className="dk-item-subtotal">{fmt(item.harga * item.qty)}</div>
                    <button className="dk-item-hapus" onClick={() => hapusItem(item.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Summary */}
            <div className="dk-summary">
              <div className="dk-summary-row">
                <span>Subtotal ({keranjang.reduce((s,i) => s+i.qty, 0)} item)</span>
                <span>{fmt(total)}</span>
              </div>
              <div className="dk-summary-row total">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>

              {/* Input bayar */}
              <div className="dk-bayar-wrap">
                <label>Uang Bayar</label>
                <div className="dk-bayar-input">
                  <span>Rp</span>
                  <input
                    type="text"
                    placeholder="0"
                    value={bayar}
                    onChange={e => setBayar(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))}
                  />
                </div>
              </div>

              {/* Nominal cepat */}
              <div className="dk-nominal-cepat">
                {[50000, 100000, 200000, 500000].map(n => (
                  <button key={n} onClick={() => setBayar(n.toLocaleString('id-ID'))}>{fmt(n)}</button>
                ))}
              </div>

              {bayarNum >= total && total > 0 && (
                <div className="dk-kembalian">
                  <span>Kembalian</span>
                  <span>{fmt(kembalian)}</span>
                </div>
              )}

              <button
                className="dk-btn-bayar"
                onClick={prosesBayar}
                disabled={keranjang.length === 0 || bayarNum < total}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Proses Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RIWAYAT ── */}
      {tab === 'riwayat' && (
        <div className="dk-riwayat">
          <div className="dk-riwayat-header">
            <h2>Riwayat Transaksi Hari Ini</h2>
            <span>{new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
          </div>
          <table className="dk-riwayat-table">
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Waktu</th>
                <th>Jumlah Item</th>
                <th>Total</th>
                <th>Uang Bayar</th>
                <th>Kembalian</th>
              </tr>
            </thead>
            <tbody>
              {RIWAYAT_SAMPLE.map(r => (
                <tr key={r.id}>
                  <td><span className="dk-trx-id">{r.id}</span></td>
                  <td>{r.waktu}</td>
                  <td>{r.items} item</td>
                  <td>{fmt(r.total)}</td>
                  <td>{fmt(r.bayar)}</td>
                  <td>{fmt(r.bayar - r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="dk-riwayat-summary">
            <span>Total transaksi hari ini: <strong>{RIWAYAT_SAMPLE.length} transaksi</strong></span>
            <span>Total pendapatan: <strong>{fmt(RIWAYAT_SAMPLE.reduce((s,r) => s+r.total, 0))}</strong></span>
          </div>
        </div>
      )}

      {/* ── MODAL SUKSES ── */}
      {sukses && (
        <div className="dk-modal-overlay" onClick={tutupSukses}>
          <div className="dk-modal" onClick={e => e.stopPropagation()}>
            <div className="dk-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Pembayaran Berhasil!</h2>
            <div className="dk-modal-detail">
              <div><span>Total</span><span>{fmt(sukses.total)}</span></div>
              <div><span>Dibayar</span><span>{fmt(sukses.bayar)}</span></div>
              <div className="highlight"><span>Kembalian</span><span>{fmt(sukses.kembalian)}</span></div>
            </div>
            <button className="dk-btn-bayar" onClick={tutupSukses}>Transaksi Baru</button>
          </div>
        </div>
      )}
    </div>
  )
}