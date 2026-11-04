// Replace this URL after deploying Apps Script as a Web App.
const API_URL = 'PASTE_APPS_SCRIPT_WEB_APP_URL_HERE';

const app = document.getElementById('app');
const statusEl = document.getElementById('status');
const titleEl = document.getElementById('pageTitle');

const pages = {
  dashboard: renderDashboard,
  inventory: () => placeholder('Inventory', 'Stok bahan, lot, nilai HPP, dan stock movement.'),
  purchases: () => placeholder('Pembelian', 'Pembelian supplier dan pembentukan lot.'),
  processing: () => placeholder('Sorting / Processing', 'Sorting size, thawing, packing, yield, dan penyesuaian stok.'),
  production: () => placeholder('Produksi', 'Recipe, batch produksi, input bahan, output produk, dan HPP.'),
  supply: () => placeholder('Supply Toka', 'Satu-satunya jalur penjualan Nuwil: Nuwil → Toka.'),
  finance: () => placeholder('Finance', 'Kas, transaksi, HPP, laba rugi, arus kas, modal, dan nilai inventory.'),
  settings: () => placeholder('Pengaturan', 'Master data, kode, unit, kategori, dan konfigurasi sistem.')
};

document.querySelectorAll('.sidebar button').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const page = btn.dataset.page;
  titleEl.textContent = btn.textContent;
  pages[page]();
}));

async function api(action, payload={}) {
  if (API_URL.includes('PASTE_')) throw new Error('API URL belum diisi di frontend/app.js');
  const res = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action,...payload}) });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data;
}

async function renderDashboard(){
  app.innerHTML = '<div class="panel">Memuat dashboard...</div>';
  try {
    const d = await api('dashboard');
    statusEl.textContent = 'Connected';
    app.innerHTML = `
      <div class="cards">
        ${card('Kas', rupiah(d.cash))}
        ${card('Inventory', rupiah(d.inventoryValue))}
        ${card('Supply ke Toka', rupiah(d.supplyThisMonth))}
        ${card('Lot Aktif', d.activeLots)}
        ${card('Batch Produksi', d.productionBatches)}
      </div>
      <div class="panel"><h3>Kondisi Nuwil</h3><p class="muted">Dashboard dibuat ringkas. Detail keuangan tetap berada di tab Finance.</p></div>`;
  } catch(e) {
    statusEl.textContent = 'Not connected';
    app.innerHTML = `<div class="panel"><b>Backend belum terhubung.</b><p class="muted">${escapeHtml(e.message)}</p></div>`;
  }
}

function placeholder(title, desc){ app.innerHTML = `<div class="panel"><h3>${title}</h3><p class="muted">${desc}</p><div class="empty">Modul siap dibangun di atas schema yang sama.</div></div>`; }
function card(label,value){return `<div class="card"><div class="label">${label}</div><div class="value">${value}</div></div>`}
function rupiah(n){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(n)||0)}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

renderDashboard();
