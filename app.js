// ==========================================
// NUWIL FRONTEND
// ==========================================

// URL Web App Google Apps Script
const API_URL =
  'https://script.google.com/macros/s/AKfycbxf99Aqb7AGM6PHM--mFa9ajn-TczwR6hsHFbzob4seZQfy3zNAuUqyi5aNMCsL2CJl/exec';


// ==========================================
// ELEMENT
// ==========================================

const app =
  document.getElementById('app');

const pageTitle =
  document.getElementById('pageTitle');

const statusEl =
  document.getElementById('status');


// ==========================================
// INIT
// ==========================================

document.addEventListener(
  'DOMContentLoaded',
  function () {

    setupNavigation();

    loadDashboard();

  }
);


// ==========================================
// NAVIGATION
// ==========================================

function setupNavigation() {

  const buttons =
    document.querySelectorAll(
      'nav button'
    );


  buttons.forEach(function (button) {

    button.addEventListener(
      'click',
      function () {

        buttons.forEach(
          function (item) {
            item.classList.remove(
              'active'
            );
          }
        );


        button.classList.add(
          'active'
        );


        const page =
          button.dataset.page;


        loadPage(page);

      }
    );

  });

}


// ==========================================
// LOAD PAGE
// ==========================================

function loadPage(page) {

  switch (page) {

    case 'dashboard':

      loadDashboard();

      break;


    default:

      showComingSoon(page);

      break;

  }

}


// ==========================================
// DASHBOARD
// ==========================================

async function loadDashboard() {

  pageTitle.textContent =
    'Dashboard';

  statusEl.textContent =
    'Connecting...';


  app.innerHTML = `
    <div class="panel">
      <div class="empty-state">
        Menghubungkan ke database NUWIL...
      </div>
    </div>
  `;


  try {

    const response =
      await fetch(
        API_URL +
        '?action=dashboard'
      );


    if (!response.ok) {

      throw new Error(
        'HTTP ' +
        response.status
      );

    }


    const result =
      await response.json();


    if (!result.ok) {

      throw new Error(
        result.error ||
        'Backend error'
      );

    }


    statusEl.textContent =
      'Online';


    renderDashboard(
      result.data
    );


  } catch (error) {

    console.error(error);


    statusEl.textContent =
      'Offline';


    app.innerHTML = `
      <div class="panel">
        <h3>Koneksi Backend Gagal</h3>

        <div class="empty-state">
          ${escapeHtml(
            error.message
          )}
        </div>

        <div class="empty-state">
          Pastikan Web App Apps Script
          sudah di-deploy dan dapat diakses.
        </div>
      </div>
    `;

  }

}


// ==========================================
// RENDER DASHBOARD
// ==========================================

function renderDashboard(
  data
) {

  const cash =
    Number(
      data.cash || 0
    );


  const inventoryValue =
    Number(
      data.inventoryValue || 0
    );


  const supplyThisMonth =
    Number(
      data.supplyThisMonth || 0
    );


  const activeLots =
    Number(
      data.activeLots || 0
    );


  const productionBatches =
    Number(
      data.productionBatches || 0
    );


  app.innerHTML = `

    <div class="topbar">

      <div>
        <h2>
          Dashboard NUWIL
        </h2>

        <p>
          Ringkasan kondisi usaha
        </p>
      </div>

      <div class="date">
        ${formatDate(
          new Date()
        )}
      </div>

    </div>


    <div class="cards">

      <div class="card">
        <span>
          Kas
        </span>

        <strong>
          ${formatRupiah(
            cash
          )}
        </strong>
      </div>


      <div class="card">
        <span>
          Nilai Inventory
        </span>

        <strong>
          ${formatRupiah(
            inventoryValue
          )}
        </strong>
      </div>


      <div class="card">
        <span>
          Supply Toka Bulan Ini
        </span>

        <strong>
          ${formatRupiah(
            supplyThisMonth
          )}
        </strong>
      </div>


      <div class="card">
        <span>
          Active Lots
        </span>

        <strong>
          ${activeLots}
        </strong>
      </div>

    </div>


    <div class="content-grid">

      <div class="panel">

        <h3>
          Produksi
        </h3>

        <div class="empty-state">

          ${productionBatches}

          batch produksi tercatat

        </div>

      </div>


      <div class="panel">

        <h3>
          Status Sistem
        </h3>

        <div class="empty-state">

          Backend NUWIL terhubung.

          <br><br>

          Database Google Sheets aktif.

        </div>

      </div>

    </div>

  `;

}


// ==========================================
// COMING SOON
// ==========================================

function showComingSoon(
  page
) {

  const titles = {

    inventory:
      'Inventory',

    purchases:
      'Pembelian',

    processing:
      'Sorting / Processing',

    production:
      'Produksi',

    supply:
      'Supply Toka',

    finance:
      'Finance',

    settings:
      'Pengaturan'

  };


  pageTitle.textContent =
    titles[page] ||
    'NUWIL';


  statusEl.textContent =
    'Online';


  app.innerHTML = `

    <div class="panel">

      <h3>
        ${escapeHtml(
          titles[page] ||
          'Halaman'
        )}
      </h3>

      <div class="empty-state">

        Modul ini akan kita bangun
        setelah koneksi backend
        terverifikasi.

      </div>

    </div>

  `;

}


// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(
  value
) {

  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }
  ).format(value);

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(
  date
) {

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  ).format(date);

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHtml(
  value
) {

  return String(value)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

}
