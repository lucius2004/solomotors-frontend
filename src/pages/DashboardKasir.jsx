import { useState, useRef } from 'react'
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
  const [metode, setMetode]       = useState('tunai') // 'tunai' | 'qris' | 'transfer'
  const [tab, setTab]             = useState('kasir') // 'kasir' | 'riwayat'
  const [sukses, setSukses]       = useState(null)
  const trxCounter = useRef(1000)
  const [struk, setStruk]         = useState(null)
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
    if (keranjang.length === 0) return
    if (metode === 'tunai' && bayarNum < total) return

    const now = new Date()
    trxCounter.current += 1
    const trxId = 'TRX-' + String(trxCounter.current)

    const data = {
      total,
      bayar: metode === 'tunai' ? bayarNum : total,
      kembalian: metode === 'tunai' ? kembalian : 0,
      items: [...keranjang],
      metode,
      trxId,
      waktu: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      tanggal: now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      kasir: user.name || 'Kasir',
    }

    setSukses(data)
    setKeranjang([])
    setBayar('')
    setMetode('tunai')
  }

  function tutupSukses() { setSukses(null) }
  function lihatStruk()  { setStruk(sukses); setSukses(null) }
  function tutupStruk()  { setStruk(null) }

  function cetakStruk() {
    const el = document.getElementById('struk-print')
    if (!el) return
    const win = window.open('', '_blank', 'width=400,height=600')
    win.document.write(`
      <html><head><title>Struk</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 16px; max-width: 300px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; }
        .title { font-size: 16px; font-weight: bold; }
      </style></head>
      <body>${el.innerHTML}</body></html>
    `)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

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

              {/* Metode Pembayaran */}
              <div className="dk-metode-wrap">
                <label className="dk-metode-label">Metode Pembayaran</label>
                <div className="dk-metode-btns">
                  <button
                    className={`dk-metode-btn ${metode === 'tunai' ? 'active' : ''}`}
                    onClick={() => { setMetode('tunai'); setBayar('') }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Tunai
                  </button>
                  <button
                    className={`dk-metode-btn ${metode === 'qris' ? 'active' : ''}`}
                    onClick={() => { setMetode('qris'); setBayar('') }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                      <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3M21 21v-3"/>
                    </svg>
                    QRIS
                  </button>
                  <button
                    className={`dk-metode-btn ${metode === 'transfer' ? 'active' : ''}`}
                    onClick={() => { setMetode('transfer'); setBayar('') }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="17 1 21 5 17 9"/>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                      <polyline points="7 23 3 19 7 15"/>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                    </svg>
                    Transfer
                  </button>
                </div>
              </div>

              {/* Tunai — input uang bayar */}
              {metode === 'tunai' && (
                <>
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
                </>
              )}

              {/* QRIS */}
              {metode === 'qris' && (
                <div className="dk-qris-wrap">
                  <div className="dk-qris-box">
                    <svg viewBox="0 0 100 100" width="100" height="100">
                      {/* Simulasi QR code */}
                      <rect width="100" height="100" fill="white"/>
                      <rect x="10" y="10" width="30" height="30" fill="none" stroke="#1C1412" strokeWidth="4"/>
                      <rect x="17" y="17" width="16" height="16" fill="#1C1412"/>
                      <rect x="60" y="10" width="30" height="30" fill="none" stroke="#1C1412" strokeWidth="4"/>
                      <rect x="67" y="17" width="16" height="16" fill="#1C1412"/>
                      <rect x="10" y="60" width="30" height="30" fill="none" stroke="#1C1412" strokeWidth="4"/>
                      <rect x="17" y="67" width="16" height="16" fill="#1C1412"/>
                      <rect x="45" y="10" width="6" height="6" fill="#1C1412"/>
                      <rect x="45" y="20" width="6" height="6" fill="#1C1412"/>
                      <rect x="10" y="45" width="6" height="6" fill="#1C1412"/>
                      <rect x="20" y="45" width="6" height="6" fill="#1C1412"/>
                      <rect x="30" y="45" width="6" height="6" fill="#1C1412"/>
                      <rect x="45" y="45" width="6" height="6" fill="#1C1412"/>
                      <rect x="55" y="45" width="6" height="6" fill="#1C1412"/>
                      <rect x="65" y="45" width="6" height="6" fill="#1C1412"/>
                      <rect x="75" y="45" width="6" height="6" fill="#1C1412"/>
                      <rect x="85" y="45" width="6" height="6" fill="#1C1412"/>
                      <rect x="55" y="55" width="6" height="6" fill="#1C1412"/>
                      <rect x="65" y="65" width="6" height="6" fill="#1C1412"/>
                      <rect x="75" y="55" width="6" height="6" fill="#1C1412"/>
                      <rect x="85" y="65" width="6" height="6" fill="#1C1412"/>
                      <rect x="55" y="75" width="6" height="6" fill="#1C1412"/>
                      <rect x="75" y="75" width="6" height="6" fill="#1C1412"/>
                      <rect x="85" y="85" width="6" height="6" fill="#1C1412"/>
                    </svg>
                  </div>
                  <div className="dk-qris-info">
                    <div className="dk-qris-nominal">{fmt(total)}</div>
                    <p>Scan QR di atas menggunakan aplikasi pembayaran</p>
                    <div className="dk-qris-apps">
                      <span>GoPay</span><span>OVO</span><span>Dana</span><span>ShopeePay</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer */}
              {metode === 'transfer' && (
                <div className="dk-transfer-wrap">
                  <div className="dk-transfer-bank">
                    <div className="dk-bank-logo">BCA</div>
                    <div className="dk-bank-info">
                      <div className="dk-bank-label">Bank BCA</div>
                      <div className="dk-bank-rek">1234567890</div>
                      <div className="dk-bank-nama">Solo Motors</div>
                    </div>
                  </div>
                  <div className="dk-transfer-nominal">
                    <span>Transfer tepat sebesar</span>
                    <strong>{fmt(total)}</strong>
                  </div>
                  <p className="dk-transfer-note">
                    Konfirmasi transfer kepada kasir setelah pembayaran selesai
                  </p>
                </div>
              )}

              <button
                className="dk-btn-bayar"
                onClick={prosesBayar}
                disabled={
                  keranjang.length === 0 ||
                  (metode === 'tunai' && bayarNum < total)
                }
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                {metode === 'tunai' ? 'Proses Pembayaran' : metode === 'qris' ? 'Konfirmasi QRIS' : 'Konfirmasi Transfer'}
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
              <div><span>ID Transaksi</span><span style={{fontWeight:700}}>{sukses.trxId}</span></div>
              <div><span>Metode</span><span style={{textTransform:'capitalize'}}>{sukses.metode}</span></div>
              <div><span>Total</span><span>{fmt(sukses.total)}</span></div>
              {sukses.metode === 'tunai' && (
                <>
                  <div><span>Dibayar</span><span>{fmt(sukses.bayar)}</span></div>
                  <div className="highlight"><span>Kembalian</span><span>{fmt(sukses.kembalian)}</span></div>
                </>
              )}
              {sukses.metode !== 'tunai' && (
                <div className="highlight"><span>Status</span><span>Lunas ✓</span></div>
              )}
            </div>
            <div className="dk-modal-actions">
              <button className="dk-btn-struk" onClick={lihatStruk}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="15" y2="17"/>
                </svg>
                Lihat Struk
              </button>
              <button className="dk-btn-bayar" onClick={tutupSukses}>Transaksi Baru</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL STRUK ── */}
      {struk && (
        <div className="dk-modal-overlay" onClick={tutupStruk}>
          <div className="dk-struk-modal" onClick={e => e.stopPropagation()}>
            <div className="dk-struk-actions">
              <button className="dk-struk-act-btn" onClick={cetakStruk}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Cetak
              </button>
              <button className="dk-struk-act-btn close" onClick={tutupStruk}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Tutup
              </button>
            </div>
            <div className="dk-struk" id="struk-print">
              <div className="dk-struk-header">
                <div className="dk-struk-logo">Solo Motors</div>
                <div className="dk-struk-alamat">Jl. Raya Solo No. 123</div>
                <div className="dk-struk-alamat">Telp: (0271) 123456</div>
              </div>
              <div className="dk-struk-divider"/>
              <div className="dk-struk-meta">
                <div className="dk-struk-meta-row"><span>No. Transaksi</span><span>{struk.trxId}</span></div>
                <div className="dk-struk-meta-row"><span>Tanggal</span><span>{struk.tanggal}</span></div>
                <div className="dk-struk-meta-row"><span>Waktu</span><span>{struk.waktu}</span></div>
                <div className="dk-struk-meta-row"><span>Kasir</span><span>{struk.kasir}</span></div>
                <div className="dk-struk-meta-row"><span>Metode</span><span style={{textTransform:'capitalize'}}>{struk.metode}</span></div>
              </div>
              <div className="dk-struk-divider dashed"/>
              <div className="dk-struk-items">
                {struk.items.map((item, i) => (
                  <div key={i} className="dk-struk-item">
                    <div className="dk-struk-item-nama">{item.nama}</div>
                    <div className="dk-struk-item-detail">
                      <span>{item.qty} x {fmt(item.harga)}</span>
                      <span>{fmt(item.harga * item.qty)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dk-struk-divider dashed"/>
              <div className="dk-struk-total-wrap">
                <div className="dk-struk-total-row"><span>Subtotal</span><span>{fmt(struk.total)}</span></div>
                <div className="dk-struk-total-row bold"><span>TOTAL</span><span>{fmt(struk.total)}</span></div>
                {struk.metode === 'tunai' && (
                  <>
                    <div className="dk-struk-total-row"><span>Tunai</span><span>{fmt(struk.bayar)}</span></div>
                    <div className="dk-struk-total-row kembalian"><span>Kembalian</span><span>{fmt(struk.kembalian)}</span></div>
                  </>
                )}
                {struk.metode !== 'tunai' && (
                  <div className="dk-struk-total-row lunas"><span>Status</span><span>LUNAS ✓</span></div>
                )}
              </div>
              <div className="dk-struk-divider"/>
              <div className="dk-struk-footer">
                <p>Terima kasih telah berbelanja</p>
                <p>di Solo Motors!</p>
                <p style={{marginTop:'6px', fontSize:'0.68rem', color:'#A8A29E'}}>Barang yang sudah dibeli tidak dapat dikembalikan</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}