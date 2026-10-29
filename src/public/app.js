/**
 * app.js
 * Logika Antarmuka Pembuatan Nota & e-Faktur Coretax DJP
 * CV. Istana Barcode Computer
 */

let catalogProducts = [];
let sampleCustomers = [];
let currentTaxCalculation = null;
let savedInvoiceData = null;

// Format Rupiah Standar Akuntansi Indonesia
function formatRupiah(num) {
  const val = Number(num || 0);
  return 'Rp' + val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function generateNewInvoiceNo() {
  const d = new Date();
  const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV/IBC/${yearMonth}/${randomSuffix}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  initFormDefaults();
  await loadProductCatalog();
  await loadCustomerMaster();
  await loadSellerProfile();
  setupEventListeners();
  setupInitialSampleData(); // Memasang data contoh yang mirip analogi user
  triggerRecalculate();
  loadInvoiceHistory();
});

async function loadCustomerMaster() {
  try {
    const res = await fetch('/api/invoices/customers');
    const data = await res.json();
    if (data.success) {
      sampleCustomers = data.data;
      const select = document.getElementById('quickCustomerSelect');
      sampleCustomers.forEach(cust => {
        const opt = document.createElement('option');
        opt.value = cust.id;
        opt.textContent = `[${cust.tipeWp}] ${cust.name}`;
        select.appendChild(opt);
      });
    }
  } catch (err) {
    console.error('Gagal mengambil master lawan transaksi:', err);
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');

      if (tab.dataset.tab === 'invoice-list') {
        loadInvoiceHistory();
      } else if (tab.dataset.tab === 'master-customers') {
        renderCustomerMasterTable();
      } else if (tab.dataset.tab === 'master-products') {
        renderProductMasterTable();
      }
    });
  });
}

function initFormDefaults() {
  document.getElementById('invoiceNo').value = generateNewInvoiceNo();
  document.getElementById('invoiceDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('npwpOrNik').value = '0937832202506000';
  document.getElementById('nitku').value = '0937832202506000000000';
  document.getElementById('customerName').value = 'PT. SUKUN WARTONO INDONESIA';
  const picEl = document.getElementById('customerPic');
  if (picEl) picEl.value = 'Chaulanna R. Wartono, SE., MA.';
  const jabEl = document.getElementById('customerJabatan');
  if (jabEl) jabEl.value = 'Manager HRD';
  const phoneEl = document.getElementById('customerPhone');
  if (phoneEl) phoneEl.value = '0291-432xxx';
  const emailEl = document.getElementById('customerEmail');
  if (emailEl) emailEl.value = 'hrd@sukun.co.id';
  document.getElementById('customerAddress').value = 'Jl. Raya PR Sukun, 01, Gondosari Gebog, Kab. Kudus, Jawa Tengah 59354';
  document.getElementById('ppnRate').value = '12';
  document.getElementById('chkDppNilaiLain').checked = true;
  document.getElementById('chkPph23').checked = true;
  document.getElementById('pph23Rate').value = '2';
}

function setupInitialSampleData() {
  // Pasang 4 rincian item persis sesuai Invoice PT. Sukun Wartono Indonesia
  const tbody = document.getElementById('itemsTableBody');
  tbody.innerHTML = '';

  addItemRow({
    sku: 'SRV-PAYROLL-01',
    name: 'Pengembangan Sistem SIM Payroll Terintegrasi (Sekali bayar)',
    kategori: 'Jasa',
    unitPrice: 60000000
  });

  addItemRow({
    sku: 'SRV-WAGW-01',
    name: 'Integrasi & Setup WhatsApp Gateway (Internal) (Sekali bayar)',
    kategori: 'Jasa',
    unitPrice: 9500000
  });

  addItemRow({
    sku: 'SRV-CLOUD-01',
    name: 'Sewa Cloud Server & Setup Domain (Dibayar per bulan)',
    kategori: 'Jasa',
    unitPrice: 4000000
  });

  addItemRow({
    sku: 'SRV-TRAIN-01',
    name: 'Jasa Training & Implementasi (Sekali bayar)',
    kategori: 'Jasa',
    unitPrice: 1500000
  });

  // Isi custom DPP Nilai Lain Rp 68.750.000
  document.getElementById('customDppNilaiLain').value = '68750000';
}

async function loadProductCatalog() {
  try {
    const res = await fetch('/api/invoices/products');
    const data = await res.json();
    if (data.success) {
      catalogProducts = data.data;
      const select = document.getElementById('quickCatalogSelect');
      catalogProducts.forEach(prod => {
        const opt = document.createElement('option');
        opt.value = prod.sku;
        opt.textContent = `[${prod.kategori}] ${prod.name} (${formatRupiah(prod.unitPrice)})`;
        select.appendChild(opt);
      });
    }
  } catch (err) {
    console.error('Gagal mengambil katalog produk:', err);
  }
}

let sellerProfileData = null;

async function loadSellerProfile() {
  try {
    const res = await fetch('/api/invoices/seller-profile');
    const data = await res.json();
    if (data.success) {
      sellerProfileData = data.data;
      document.getElementById('sellerBadge').textContent = `NPWP: ${data.data.npwp16}`;

      // Isi form settings
      const sName = document.getElementById('sellerName');
      if (sName) sName.value = data.data.name || '';
      const sTagline = document.getElementById('sellerTagline');
      if (sTagline) sTagline.value = data.data.tagline || 'Official IT Solution & POS Barcode Hardware System';
      const sPhone = document.getElementById('sellerPhone');
      if (sPhone) sPhone.value = data.data.phone || '';
      const sNpwp = document.getElementById('sellerNpwp16');
      if (sNpwp) sNpwp.value = data.data.npwp16 || '';
      const sNitku = document.getElementById('sellerNitku');
      if (sNitku) sNitku.value = data.data.nitku || '';
      const sAddr = document.getElementById('sellerAddress');
      if (sAddr) sAddr.value = data.data.address || '';
      const sBank = document.getElementById('sellerBankName');
      if (sBank) sBank.value = data.data.bankName || 'Bank BCA';
      const sAcc = document.getElementById('sellerBankAccount');
      if (sAcc) sAcc.value = data.data.bankAccount || '';
      const sAccName = document.getElementById('sellerBankAccountName');
      if (sAccName) sAccName.value = data.data.bankAccountName || '';
      const sEmail = document.getElementById('sellerEmailTax');
      if (sEmail) sEmail.value = data.data.email || '';
      const sNotes = document.getElementById('sellerDefaultNotes');
      if (sNotes) sNotes.value = data.data.defaultNotes || '';

      // Set default ke form nota jika ada
      if (data.data.defaultNotes) {
        document.getElementById('invoiceNotes').value = data.data.defaultNotes;
      }

      // Update logo UI jika tersimpan
      if (data.data.logoBase64) {
        updateLogoInUI(data.data.logoBase64);
      }

      // Update stempel UI jika tersimpan
      if (data.data.stempelBase64) {
        updateStempelInUI(data.data.stempelBase64);
      }

      // Isi penandatangan manager
      const mgrName = document.getElementById('sellerManagerName');
      if (mgrName) mgrName.value = data.data.managerName || 'Djohan Hutagalung, S.Kom.';
      const mgrTitle = document.getElementById('sellerManagerTitle');
      if (mgrTitle) mgrTitle.value = data.data.managerTitle || 'Manager CV. Istana Barcode Computer';
    }
  } catch (err) {
    console.error('Gagal memuat profil penjual:', err);
  }
}

function setupEventListeners() {
  document.getElementById('btnAddItem').addEventListener('click', () => addItemRow());

  // Pilih dari katalog cepat produk
  document.getElementById('quickCatalogSelect').addEventListener('change', (e) => {
    const sku = e.target.value;
    if (!sku) return;
    const prod = catalogProducts.find(p => p.sku === sku);
    if (prod) addItemRow(prod);
    e.target.value = '';
  });

  // Pilih dari master lawan transaksi (Customer Coretax)
  document.getElementById('quickCustomerSelect').addEventListener('change', (e) => {
    const custId = e.target.value;
    if (!custId) return;
    const cust = sampleCustomers.find(c => c.id === custId);
    if (cust) {
      document.getElementById('tipeWp').value = cust.tipeWp;
      document.getElementById('customerName').value = cust.name;
      document.getElementById('npwpOrNik').value = cust.npwpOrNik;
      document.getElementById('nitku').value = cust.nitku;
      document.getElementById('customerAddress').value = cust.address || '';
      document.getElementById('customerPhone').value = cust.phone || '';
      const picField = document.getElementById('customerPic');
      if (picField) picField.value = cust.pic || '';
      const jabField = document.getElementById('customerJabatan');
      if (jabField) jabField.value = cust.jabatan || '';
      const emailField = document.getElementById('customerEmail');
      if (emailField) emailField.value = cust.email || '';
      if (cust.defaultKodeTransaksi) {
        document.getElementById('kodeTransaksi').value = cust.defaultKodeTransaksi;
        if (cust.defaultKodeTransaksi === '04') {
          document.getElementById('chkDppNilaiLain').checked = true;
          document.getElementById('boxCustomDppLain').style.display = 'flex';
        }
      }
      document.getElementById('chkPph23').checked = Boolean(cust.isPemotongPph23);
      triggerRecalculate();
    }
  });

  // Opsi DPP Nilai Lain & PPh 23
  document.getElementById('chkDppNilaiLain').addEventListener('change', (e) => {
    document.getElementById('boxCustomDppLain').style.display = e.target.checked ? 'flex' : 'none';
    if (e.target.checked) {
      document.getElementById('kodeTransaksi').value = '04';
    } else {
      document.getElementById('kodeTransaksi').value = '01';
    }
    triggerRecalculate();
  });

  document.getElementById('customDppNilaiLain').addEventListener('input', triggerRecalculate);

  document.getElementById('chkPph23').addEventListener('change', (e) => {
    document.getElementById('boxPph23Rate').style.display = e.target.checked ? 'flex' : 'none';
    triggerRecalculate();
  });

  document.getElementById('pph23Rate').addEventListener('input', triggerRecalculate);
  document.getElementById('ppnRate').addEventListener('change', triggerRecalculate);
  document.getElementById('kodeTransaksi').addEventListener('change', (e) => {
    if (e.target.value === '04') {
      document.getElementById('chkDppNilaiLain').checked = true;
      document.getElementById('boxCustomDppLain').style.display = 'flex';
    }
    triggerRecalculate();
  });

  // NPWP validation input
  document.getElementById('npwpOrNik').addEventListener('input', (e) => {
    const clean = e.target.value.replace(/\D/g, '');
    e.target.value = clean;
    const nitkuInput = document.getElementById('nitku');
    if (clean.length === 16 && (!nitkuInput.value || nitkuInput.value.length < 22)) {
      nitkuInput.value = clean + '000000';
    }
  });

  document.getElementById('nitku').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  // Reset Form
  document.getElementById('btnResetForm').addEventListener('click', () => {
    if (confirm('Buat nota baru dan kosongkan data form?')) {
      document.getElementById('notaForm').reset();
      document.getElementById('itemsTableBody').innerHTML = '';
      initFormDefaults();
      addItemRow();
      triggerRecalculate();
      document.getElementById('btnDownloadXml').disabled = true;
      savedInvoiceData = null;
    }
  });

  // Simpan Nota
  document.getElementById('btnSaveInvoice').addEventListener('click', saveCurrentInvoice);

  // Download XML
  document.getElementById('btnDownloadXml').addEventListener('click', () => {
    if (!savedInvoiceData || !savedInvoiceData.invoiceNo) {
      alert('Silakan simpan nota terlebih dahulu sebelum mendownload file XML Coretax.');
      return;
    }
    window.location.href = `/api/invoices/${encodeURIComponent(savedInvoiceData.invoiceNo)}/export-xml`;
  });

  // Print Modal
  document.getElementById('btnPrintPreview').addEventListener('click', openPrintModal);
  document.getElementById('btnCloseModal').addEventListener('click', closePrintModal);
  document.getElementById('btnCancelModal').addEventListener('click', closePrintModal);
  document.getElementById('btnRefreshList').addEventListener('click', loadInvoiceHistory);

  // Master Lawan Transaksi Listeners
  document.getElementById('btnOpenAddCustomerModal').addEventListener('click', () => openCustomerModal());
  document.getElementById('btnCloseCustomerModal').addEventListener('click', () => closeCustomerModal());
  document.getElementById('btnBatalCustomerModal').addEventListener('click', () => closeCustomerModal());
  document.getElementById('btnSimpanCustomerModal').addEventListener('click', () => saveCustomerMaster());

  // Master Produk & Jasa Listeners
  document.getElementById('btnOpenAddProductModal').addEventListener('click', () => openProductModal());
  document.getElementById('btnCloseProductModal').addEventListener('click', () => closeProductModal());
  document.getElementById('btnBatalProductModal').addEventListener('click', () => closeProductModal());
  document.getElementById('btnSimpanProductModal').addEventListener('click', () => saveProductMaster());

  // Simpan Pengaturan Profil & Rekening Toko
  const btnSaveSeller = document.getElementById('btnSaveSellerSettings');
  if (btnSaveSeller) {
    btnSaveSeller.addEventListener('click', saveSellerSettingsHandler);
  }

  // Upload Logo Toko Handlers
  const btnBrowseLogo = document.getElementById('btnBrowseLogo');
  const logoFileInput = document.getElementById('logoFileInput');
  const btnRemoveLogo = document.getElementById('btnRemoveLogo');

  if (btnBrowseLogo && logoFileInput) {
    btnBrowseLogo.addEventListener('click', () => logoFileInput.click());

    logoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB!');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64 = evt.target.result;
        updateLogoInUI(base64);
        if (sellerProfileData) {
          sellerProfileData.logoBase64 = base64;
        } else {
          sellerProfileData = { logoBase64: base64 };
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRemoveLogo) {
    btnRemoveLogo.addEventListener('click', () => {
      if (confirm('Hapus logo perusahaan?')) {
        updateLogoInUI(null);
        if (sellerProfileData) {
          sellerProfileData.logoBase64 = null;
        }
      }
    });
  }

  // Upload Stempel Toko Handlers
  const btnBrowseStempel = document.getElementById('btnBrowseStempel');
  const stempelFileInput = document.getElementById('stempelFileInput');
  const btnRemoveStempel = document.getElementById('btnRemoveStempel');

  if (btnBrowseStempel && stempelFileInput) {
    btnBrowseStempel.addEventListener('click', () => stempelFileInput.click());

    stempelFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB!');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64 = evt.target.result;
        updateStempelInUI(base64);
        if (sellerProfileData) {
          sellerProfileData.stempelBase64 = base64;
        } else {
          sellerProfileData = { stempelBase64: base64 };
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRemoveStempel) {
    btnRemoveStempel.addEventListener('click', () => {
      if (confirm('Hapus stempel perusahaan?')) {
        updateStempelInUI(null);
        if (sellerProfileData) {
          sellerProfileData.stempelBase64 = null;
        }
      }
    });
  }

  // Auto-sync NITKU saat NPWP Master berubah
  document.getElementById('custMasterNpwp').addEventListener('input', (e) => {
    const clean = e.target.value.replace(/\D/g, '');
    e.target.value = clean;
    const nitkuEl = document.getElementById('custMasterNitku');
    if (clean.length === 16 && (!nitkuEl.value || nitkuEl.value.length < 22)) {
      nitkuEl.value = clean + '000000';
    }
  });

  // Add Transaction Modal (Coretax DJP Style)
  document.getElementById('btnOpenAddModal').addEventListener('click', () => openAddTransactionModal());
  document.getElementById('btnCloseAddModal').addEventListener('click', () => closeAddTransactionModal());
  document.getElementById('btnBatalAddModal').addEventListener('click', () => closeAddTransactionModal());
  document.getElementById('btnSimpanAddModal').addEventListener('click', () => saveTransactionFromModal());

  // Radio Tipe Barang vs Jasa
  document.querySelectorAll('input[name="modalTipe"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const kodeSelect = document.getElementById('modalKode');
      kodeSelect.innerHTML = '';
      if (e.target.value === 'Jasa') {
        kodeSelect.innerHTML = `
          <option value="000000 - Jasa" selected>000000 - Jasa</option>
          <option value="83141001 - Jasa Software & Instalasi POS">83141001 - Jasa Software & Instalasi POS</option>
          <option value="87151001 - Jasa Maintenance Perangkat Barcode">87151001 - Jasa Maintenance Perangkat Barcode</option>
        `;
        document.getElementById('modalSatuan').value = 'Lainnya';
      } else {
        kodeSelect.innerHTML = `
          <option value="45281001 - Barcode Scanner 1D/2D" selected>45281001 - Barcode Scanner 1D/2D</option>
          <option value="45262002 - Printer Label Barcode">45262002 - Printer Label Barcode</option>
          <option value="45262001 - Printer Kasir Thermal">45262001 - Printer Kasir Thermal</option>
          <option value="38912001 - Ribbon Barcode">38912001 - Ribbon Barcode</option>
          <option value="32199002 - Label Barcode Semicoat/Thermal">32199002 - Label Barcode Semicoat/Thermal</option>
        `;
        document.getElementById('modalSatuan').value = 'Unit';
      }
    });
  });

  // Event kalkulasi dalam Add Transaction Modal
  ['modalHargaSatuan', 'modalQty', 'modalPotongan', 'modalTarifPpn', 'modalTarifPpnBm', 'modalDppNilaiLainVal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateModalTransaction);
  });

  document.getElementById('modalChkDppNilaiLain').addEventListener('change', calculateModalTransaction);
  document.getElementById('modalTarifPpn').addEventListener('change', calculateModalTransaction);
}

// Parse string rupiah / angka Indonesia menjadi Number
function parseIndoNumber(str) {
  if (!str) return 0;
  // Hapus "Rp", spasi, dan ganti titik ribuan, ganti koma desimal jadi titik
  const cleaned = String(str).replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.');
  return Number(cleaned) || 0;
}

// Format number ke format Coretax (e.g. 75.000.000,00)
function formatCoretaxNumber(num) {
  const val = Number(num || 0);
  return val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculateModalTransaction() {
  const hargaSatuan = parseIndoNumber(document.getElementById('modalHargaSatuan').value);
  const qty = parseIndoNumber(document.getElementById('modalQty').value) || 1;
  const potongan = parseIndoNumber(document.getElementById('modalPotongan').value);

  const totalHarga = Math.max(0, (hargaSatuan * qty));
  const dpp = Math.max(0, totalHarga - potongan);

  document.getElementById('modalTotalHarga').value = formatCoretaxNumber(totalHarga);
  document.getElementById('modalDpp').value = formatCoretaxNumber(dpp);

  const isDppLain = document.getElementById('modalChkDppNilaiLain').checked;
  let dppLain = dpp;
  if (isDppLain) {
    const currentLainInput = parseIndoNumber(document.getElementById('modalDppNilaiLainVal').value);
    // Jika belum diisi atau user baru mencentang, hitung proporsi 11/12
    if (!currentLainInput || currentLainInput === dpp) {
      dppLain = Math.round(dpp * (11 / 12));
      document.getElementById('modalDppNilaiLainVal').value = formatCoretaxNumber(dppLain);
    } else {
      dppLain = currentLainInput;
    }
  } else {
    document.getElementById('modalDppNilaiLainVal').value = '0,00';
  }

  const tarifPpn = Number(document.getElementById('modalTarifPpn').value || 12);
  const basePpn = isDppLain ? dppLain : dpp;
  const ppn = Math.round(basePpn * (tarifPpn / 100));

  document.getElementById('modalPpnVal').value = formatCoretaxNumber(ppn);

  const tarifPpnBm = parseIndoNumber(document.getElementById('modalTarifPpnBm').value);
  const ppnBm = Math.round(basePpn * (tarifPpnBm / 100));
  document.getElementById('modalPpnBmVal').value = formatCoretaxNumber(ppnBm);
}

function openAddTransactionModal() {
  document.getElementById('addTransactionModal').classList.add('show');
  calculateModalTransaction();
}

function closeAddTransactionModal() {
  document.getElementById('addTransactionModal').classList.remove('show');
}

function saveTransactionFromModal() {
  const tipe = document.querySelector('input[name="modalTipe"]:checked').value;
  const kode = document.getElementById('modalKode').value;
  const nama = document.getElementById('modalNama').value.trim();
  const satuan = document.getElementById('modalSatuan').value;
  const hargaSatuan = parseIndoNumber(document.getElementById('modalHargaSatuan').value);
  const qty = parseIndoNumber(document.getElementById('modalQty').value) || 1;
  const potongan = parseIndoNumber(document.getElementById('modalPotongan').value);
  const isDppLain = document.getElementById('modalChkDppNilaiLain').checked;
  const dppLain = parseIndoNumber(document.getElementById('modalDppNilaiLainVal').value);

  if (!nama) {
    alert('Nama transaksi wajib diisi!');
    return;
  }

  // Tambahkan ke tabel nota penjualan
  addItemRow({
    sku: kode.split(' ')[0] || (tipe === 'Jasa' ? 'SRV-001' : 'BAR-001'),
    name: nama,
    kategori: tipe,
    unitPrice: hargaSatuan,
    discount: potongan,
    qty: qty
  });

  if (isDppLain) {
    document.getElementById('chkDppNilaiLain').checked = true;
    document.getElementById('customDppNilaiLain').value = String(dppLain);
    document.getElementById('boxCustomDppLain').style.display = 'flex';
    document.getElementById('kodeTransaksi').value = '04';
  }

  if (tipe === 'Jasa') {
    document.getElementById('chkPph23').checked = true;
  }

  closeAddTransactionModal();
  triggerRecalculate();
}

function addItemRow(prod = null) {
  const tbody = document.getElementById('itemsTableBody');
  const rowCount = tbody.children.length + 1;
  const tr = document.createElement('tr');

  const defaultSku = prod ? prod.sku : `SKU-${String(rowCount).padStart(3, '0')}`;
  const defaultName = prod ? prod.name : '';
  const defaultKategori = prod ? prod.kategori : 'Hardware';
  const defaultPrice = prod ? prod.unitPrice : 0;

  tr.innerHTML = `
    <td class="text-center row-num">${rowCount}</td>
    <td>
      <input type="text" class="item-sku-input" value="${defaultSku}" placeholder="SKU Barcode">
    </td>
    <td>
      <input type="text" class="item-name-input" value="${defaultName}" placeholder="Nama Produk/Jasa">
      <input type="hidden" class="item-kategori-input" value="${defaultKategori}">
    </td>
    <td>
      <input type="number" class="item-qty-input" value="1" min="1" style="width: 70px;">
    </td>
    <td>
      <input type="number" class="item-price-input" value="${defaultPrice}" min="0" step="1000">
    </td>
    <td>
      <input type="number" class="item-disc-input" value="0" min="0" step="1000">
    </td>
    <td>
      <span class="subtotal-val">${formatRupiah(defaultPrice)}</span>
    </td>
    <td class="text-center">
      <button type="button" class="btn-remove-row" title="Hapus Baris">&times;</button>
    </td>
  `;

  tbody.appendChild(tr);

  tr.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', triggerRecalculate);
  });

  tr.querySelector('.btn-remove-row').addEventListener('click', () => {
    if (tbody.children.length > 1) {
      tr.remove();
      updateRowNumbers();
      triggerRecalculate();
    } else {
      alert('Nota minimal memiliki 1 baris barang.');
    }
  });

  updateRowNumbers();
  triggerRecalculate();
}

function updateRowNumbers() {
  const rows = document.querySelectorAll('#itemsTableBody tr');
  rows.forEach((row, idx) => {
    row.querySelector('.row-num').textContent = idx + 1;
  });
}

function getItemsFromTable() {
  const rows = document.querySelectorAll('#itemsTableBody tr');
  const items = [];

  rows.forEach(row => {
    const sku = row.querySelector('.item-sku-input').value.trim();
    const name = row.querySelector('.item-name-input').value.trim();
    const kategori = row.querySelector('.item-kategori-input').value || 'Hardware';
    const qty = Number(row.querySelector('.item-qty-input').value || 1);
    const unitPrice = Number(row.querySelector('.item-price-input').value || 0);
    const discount = Number(row.querySelector('.item-disc-input').value || 0);

    items.push({ sku, name, kategori, qty, unitPrice, discount });
  });

  return items;
}

async function triggerRecalculate() {
  const items = getItemsFromTable();
  const ppnRate = Number(document.getElementById('ppnRate').value || 12);
  const kodeTransaksi = document.getElementById('kodeTransaksi').value;
  const useDppNilaiLain = document.getElementById('chkDppNilaiLain').checked;
  const customDppNilaiLain = document.getElementById('customDppNilaiLain').value;
  const hasPph23 = document.getElementById('chkPph23').checked;
  const pph23Rate = Number(document.getElementById('pph23Rate').value || 2);

  try {
    const res = await fetch('/api/invoices/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        options: {
          ppnRate,
          kodeTransaksi,
          useDppNilaiLain,
          customDppNilaiLain: customDppNilaiLain ? Number(customDppNilaiLain) : null,
          hasPph23,
          pph23Rate
        }
      })
    });

    const data = await res.json();
    if (data.success) {
      currentTaxCalculation = data.data;
      renderTaxSummary(data.data);
    }
  } catch (err) {
    console.error('Kalkulasi pajak gagal:', err);
  }
}

// Render RINGKASAN PEMBAYARAN Persis Analogi User
function renderTaxSummary(calc) {
  const rows = document.querySelectorAll('#itemsTableBody tr');
  calc.items.forEach((item, idx) => {
    if (rows[idx]) {
      rows[idx].querySelector('.subtotal-val').textContent = formatRupiah(item.total);
    }
  });

  const { summary, useDppNilaiLain, ppnRate, hasPph23, pph23Rate } = calc;

  // 1. Subtotal (DPP)
  document.getElementById('summarySubtotalDpp').textContent = formatRupiah(summary.subtotalDpp);

  // 2. DPP Nilai Lain & Label PPN
  const lineDppLain = document.getElementById('lineDppNilaiLain');
  const labelPpn = document.getElementById('labelPpnText');
  if (useDppNilaiLain && summary.dppNilaiLain) {
    lineDppLain.style.display = 'flex';
    document.getElementById('summaryDppNilaiLain').textContent = formatRupiah(summary.dppNilaiLain);
    labelPpn.textContent = `PPN (${ppnRate}% dari DPP Nilai Lain ${formatRupiah(summary.dppNilaiLain)}):`;
  } else {
    lineDppLain.style.display = 'none';
    labelPpn.textContent = `PPN (${ppnRate}% dari DPP):`;
  }

  // 3. PPN
  document.getElementById('summaryPpn').textContent = formatRupiah(summary.totalPpn);

  // 4. Total Tagihan
  document.getElementById('summaryTotalTagihan').textContent = formatRupiah(summary.totalTagihan);

  // 5. Potongan PPh 23
  const linePph = document.getElementById('linePph23');
  const labelPph23 = document.getElementById('labelPph23Text');
  if (hasPph23 && summary.pph23Amount > 0) {
    linePph.style.display = 'flex';
    labelPph23.textContent = `Potongan PPh Pasal 23 (${pph23Rate}% x ${formatRupiah(summary.subtotalDpp)}) - dipotong PT:`;
    document.getElementById('summaryPph23').textContent = `(${formatRupiah(summary.pph23Amount)})`;
  } else {
    linePph.style.display = 'none';
  }

  // 6. Total Ditransfer / Dibayarkan
  document.getElementById('summaryTotalDitransfer').textContent = formatRupiah(summary.totalDitransfer);
  document.getElementById('terbilangDisplay').textContent = summary.terbilang;
}

// Simpan Nota
async function saveCurrentInvoice() {
  const invoiceNo = document.getElementById('invoiceNo').value.trim();
  const invoiceDate = document.getElementById('invoiceDate').value;
  const customerName = document.getElementById('customerName').value.trim();
  const customerPic = document.getElementById('customerPic') ? document.getElementById('customerPic').value.trim() : '';
  const customerJabatan = document.getElementById('customerJabatan') ? document.getElementById('customerJabatan').value.trim() : '';
  const customerPhone = document.getElementById('customerPhone') ? document.getElementById('customerPhone').value.trim() : '';
  const customerEmail = document.getElementById('customerEmail') ? document.getElementById('customerEmail').value.trim() : '';
  const npwpOrNik = document.getElementById('npwpOrNik').value.trim();
  const nitku = document.getElementById('nitku').value.trim();
  const customerAddress = document.getElementById('customerAddress').value.trim();
  const tipeWp = document.getElementById('tipeWp').value;
  const ppnRate = Number(document.getElementById('ppnRate').value || 12);
  const kodeTransaksi = document.getElementById('kodeTransaksi').value;
  const useDppNilaiLain = document.getElementById('chkDppNilaiLain').checked;
  const customDppNilaiLain = document.getElementById('customDppNilaiLain').value;
  const hasPph23 = document.getElementById('chkPph23').checked;
  const pph23Rate = Number(document.getElementById('pph23Rate').value || 2);

  if (!customerName) {
    alert('Nama pembeli / PT rekanan wajib diisi!');
    return;
  }

  const items = getItemsFromTable();
  if (items.length === 0 || !items.some(i => i.name.trim() !== '')) {
    alert('Mohon isi minimal satu barang/jasa dalam nota.');
    return;
  }

  const payload = {
    invoiceNo,
    invoiceDate,
    customer: {
      name: customerName,
      pic: customerPic,
      jabatan: customerJabatan,
      tipeWp,
      npwpOrNik,
      nitku,
      address: customerAddress,
      phone: customerPhone,
      email: customerEmail
    },
    items,
    options: {
      ppnRate,
      kodeTransaksi,
      useDppNilaiLain,
      customDppNilaiLain: customDppNilaiLain ? Number(customDppNilaiLain) : null,
      hasPph23,
      pph23Rate
    }
  };

  try {
    const res = await fetch('/api/invoices/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      savedInvoiceData = data.data;
      document.getElementById('btnDownloadXml').disabled = false;
      alert(`✅ Nota ${invoiceNo} berhasil disimpan!\nRingkasan Pembayaran & Nilai Coretax tervalidasi.\nFile XML Coretax sekarang dapat diunduh.`);
    } else {
      alert(`Gagal menyimpan: ${(data.errors || []).join(', ')}`);
    }
  } catch (err) {
    console.error('Error saat menyimpan nota:', err);
    alert('Terjadi kesalahan koneksi saat menyimpan nota.');
  }
}

function updateLogoInUI(base64) {
  const logoPreviewImg = document.getElementById('logoPreviewImg');
  const logoPlaceholder = document.getElementById('logoPlaceholder');
  const btnRemoveLogo = document.getElementById('btnRemoveLogo');
  const headerLogoImg = document.getElementById('headerLogoImg');
  const headerDefaultIcon = document.getElementById('headerDefaultIcon');
  const printLogoBox = document.getElementById('printLogoBox');
  const printLogoImg = document.getElementById('printLogoImg');

  if (base64) {
    if (logoPreviewImg) {
      logoPreviewImg.src = base64;
      logoPreviewImg.style.display = 'block';
    }
    if (logoPlaceholder) logoPlaceholder.style.display = 'none';
    if (btnRemoveLogo) btnRemoveLogo.style.display = 'inline-flex';
    if (headerLogoImg) {
      headerLogoImg.src = base64;
      headerLogoImg.style.display = 'block';
    }
    if (headerDefaultIcon) headerDefaultIcon.style.display = 'none';
    if (printLogoImg) printLogoImg.src = base64;
    if (printLogoBox) printLogoBox.style.display = 'flex';
  } else {
    if (logoPreviewImg) {
      logoPreviewImg.src = '';
      logoPreviewImg.style.display = 'none';
    }
    if (logoPlaceholder) logoPlaceholder.style.display = 'block';
    if (btnRemoveLogo) btnRemoveLogo.style.display = 'none';
    if (headerLogoImg) {
      headerLogoImg.src = '';
      headerLogoImg.style.display = 'none';
    }
    if (headerDefaultIcon) headerDefaultIcon.style.display = 'inline-block';
    if (printLogoImg) printLogoImg.src = '';
    if (printLogoBox) printLogoBox.style.display = 'none';
  }
}

function updateStempelInUI(base64) {
  const stempelPreviewImg = document.getElementById('stempelPreviewImg');
  const stempelPlaceholder = document.getElementById('stempelPlaceholder');
  const btnRemoveStempel = document.getElementById('btnRemoveStempel');
  const printStempelImg = document.getElementById('printStempelImg');

  if (base64) {
    if (stempelPreviewImg) {
      stempelPreviewImg.src = base64;
      stempelPreviewImg.style.display = 'block';
    }
    if (stempelPlaceholder) stempelPlaceholder.style.display = 'none';
    if (btnRemoveStempel) btnRemoveStempel.style.display = 'inline-flex';
    if (printStempelImg) {
      printStempelImg.src = base64;
      printStempelImg.style.display = 'block';
    }
  } else {
    if (stempelPreviewImg) {
      stempelPreviewImg.src = '';
      stempelPreviewImg.style.display = 'none';
    }
    if (stempelPlaceholder) stempelPlaceholder.style.display = 'block';
    if (btnRemoveStempel) btnRemoveStempel.style.display = 'none';
    if (printStempelImg) {
      printStempelImg.src = '';
      printStempelImg.style.display = 'none';
    }
  }
}

// Buka Modal Cetak Nota Sesuai Analogi
function openPrintModal() {
  if (!currentTaxCalculation) {
    alert('Silakan lengkapi nota terlebih dahulu.');
    return;
  }

  const invoiceNo = document.getElementById('invoiceNo').value;
  const invoiceDate = document.getElementById('invoiceDate').value;
  const paymentStatus = document.getElementById('paymentStatus').value;
  const customerName = document.getElementById('customerName').value;
  const npwpOrNik = document.getElementById('npwpOrNik').value;
  const nitku = document.getElementById('nitku').value;
  const customerAddress = document.getElementById('customerAddress').value;
  const notes = document.getElementById('invoiceNotes').value;

  const { summary, useDppNilaiLain, ppnRate, hasPph23, pph23Rate } = currentTaxCalculation;

  // Render Data Perusahaan & Logo
  const sProfile = sellerProfileData || {};
  if (sProfile.name) {
    const titleEl = document.getElementById('printCompanyTitle');
    if (titleEl) titleEl.textContent = sProfile.name;
    const sigComp = document.getElementById('printSigCompany');
    if (sigComp) sigComp.textContent = sProfile.name;
  }
  const subEl = document.getElementById('printCompanySub');
  if (subEl) {
    subEl.textContent = sProfile.tagline || 'Official IT Solution & POS Barcode Hardware System';
  }
  if (sProfile.address) {
    const addrEl = document.getElementById('printCompanyAddr');
    if (addrEl) addrEl.textContent = sProfile.address + (sProfile.phone ? ` | Telp/WA: ${sProfile.phone}` : '');
  }
  if (sProfile.npwp16) {
    const npwpEl = document.getElementById('printCompanyNpwp');
    if (npwpEl) npwpEl.textContent = sProfile.npwp16;
  }
  if (sProfile.nitku) {
    const nitkuEl = document.getElementById('printCompanyNitku');
    if (nitkuEl) nitkuEl.textContent = sProfile.nitku;
  }

  // Logo Toko
  const printLogoBox = document.getElementById('printLogoBox');
  const printLogoImg = document.getElementById('printLogoImg');
  if (sProfile.logoBase64) {
    if (printLogoImg) printLogoImg.src = sProfile.logoBase64;
    if (printLogoBox) printLogoBox.style.display = 'flex';
  } else {
    if (printLogoBox) printLogoBox.style.display = 'none';
  }

  // Meta Nota
  document.getElementById('printInvNo').textContent = invoiceNo;
  document.getElementById('printInvDate').textContent = invoiceDate;
  const statusEl = document.getElementById('printInvStatus');
  if (statusEl) {
    statusEl.textContent = paymentStatus;
    if (paymentStatus === 'LUNAS') {
      statusEl.style.background = '#dcfce7';
      statusEl.style.color = '#15803d';
    } else {
      statusEl.style.background = '#fef3c7';
      statusEl.style.color = '#b45309';
    }
  }

  // Customer Info Rapi
  const customerPic = document.getElementById('customerPic') ? document.getElementById('customerPic').value.trim() : '';
  const customerJabatan = document.getElementById('customerJabatan') ? document.getElementById('customerJabatan').value.trim() : '';
  const customerPhone = document.getElementById('customerPhone') ? document.getElementById('customerPhone').value.trim() : '';

  document.getElementById('printCustName').textContent = customerName || '-';
  document.getElementById('printCustNpwp').textContent = npwpOrNik || '0000000000000000';
  document.getElementById('printCustNitku').textContent = nitku || '-';
  document.getElementById('printCustAddress').textContent = customerAddress || '-';

  const picRow = document.getElementById('printCustPicRow');
  const printCustPic = document.getElementById('printCustPic');
  if (customerPic || customerJabatan) {
    if (picRow) picRow.style.display = 'flex';
    if (printCustPic) {
      if (customerPic && customerJabatan) {
        printCustPic.textContent = `${customerPic} (${customerJabatan})`;
      } else {
        printCustPic.textContent = customerPic || customerJabatan;
      }
    }
  } else {
    if (picRow) picRow.style.display = 'none';
  }

  const phoneRow = document.getElementById('printCustPhoneRow');
  const printCustPhone = document.getElementById('printCustPhone');
  if (customerPhone) {
    if (phoneRow) phoneRow.style.display = 'flex';
    if (printCustPhone) printCustPhone.textContent = customerPhone;
  } else {
    if (phoneRow) phoneRow.style.display = 'none';
  }

  // Tanda Tangan Pembeli (Jika ada nama PIC / pembeli, langsung dicetak rapi)
  const sigCustName = document.getElementById('printSigCustomerName');
  if (sigCustName) {
    if (customerPic) {
      sigCustName.textContent = `( ${customerPic} )`;
    } else if (customerName) {
      sigCustName.textContent = `( ${customerName} )`;
    } else {
      sigCustName.textContent = '( .................................................... )';
    }
  }
  const sigCustSub = document.getElementById('printSigCustomerSub');
  if (sigCustSub) {
    if (customerJabatan) {
      sigCustSub.textContent = customerJabatan + (customerName ? ` - ${customerName}` : '');
    } else if (customerName) {
      sigCustSub.textContent = customerName;
    } else {
      sigCustSub.textContent = 'Pelanggan / Rekanan';
    }
  }

  document.getElementById('printNotes').textContent = notes;
  document.getElementById('printTerbilang').textContent = summary.terbilang;

  // Stempel & Tanda Tangan Manager Toko
  const printStempelImg = document.getElementById('printStempelImg');
  if (sProfile.stempelBase64) {
    if (printStempelImg) {
      printStempelImg.src = sProfile.stempelBase64;
      printStempelImg.style.display = 'block';
    }
  } else {
    if (printStempelImg) {
      printStempelImg.src = '';
      printStempelImg.style.display = 'none';
    }
  }

  const sigMgrName = document.getElementById('printSigManagerName');
  if (sigMgrName) {
    sigMgrName.textContent = `( ${sProfile.managerName || 'Djohan Hutagalung, S.Kom.'} )`;
  }
  const sigMgrTitle = document.getElementById('printSigManagerTitle');
  if (sigMgrTitle) {
    sigMgrTitle.textContent = sProfile.managerTitle || 'Manager CV. Istana Barcode Computer';
  }

  // Print Summary Table
  document.getElementById('printSubtotalDpp').textContent = formatRupiah(summary.subtotalDpp);

  const printRowDppLain = document.getElementById('printRowDppLain');
  const printLabelPpn = document.getElementById('printLabelPpn');
  if (useDppNilaiLain && summary.dppNilaiLain) {
    printRowDppLain.style.display = 'table-row';
    document.getElementById('printDppLain').textContent = formatRupiah(summary.dppNilaiLain);
    printLabelPpn.textContent = `PPN (${ppnRate}% dari DPP Nilai Lain ${formatRupiah(summary.dppNilaiLain)})`;
  } else {
    printRowDppLain.style.display = 'none';
    printLabelPpn.textContent = `PPN (${ppnRate}% dari DPP)`;
  }

  document.getElementById('printPpn').textContent = formatRupiah(summary.totalPpn);
  document.getElementById('printTotalTagihan').textContent = formatRupiah(summary.totalTagihan);

  const printRowPph = document.getElementById('printRowPph23');
  const printLabelPph = document.getElementById('printLabelPph23');
  if (hasPph23 && summary.pph23Amount > 0) {
    printRowPph.style.display = 'table-row';
    printLabelPph.textContent = `Potongan PPh Pasal 23 (${pph23Rate}% x ${formatRupiah(summary.subtotalDpp)}) - dipotong PT`;
    document.getElementById('printPph23').textContent = `(${formatRupiah(summary.pph23Amount)})`;
  } else {
    printRowPph.style.display = 'none';
  }

  document.getElementById('printTotalDitransfer').textContent = formatRupiah(summary.totalDitransfer);

  // Render Baris Cetak
  const tbody = document.getElementById('printItemsBody');
  tbody.innerHTML = '';
  currentTaxCalculation.items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-center">${item.urutan}</td>
      <td><strong class="input-mono">${item.sku}</strong></td>
      <td><strong>${item.name}</strong></td>
      <td class="text-center">${item.qty}</td>
      <td class="text-right input-mono">${formatRupiah(item.unitPrice)}</td>
      <td class="text-right input-mono"><strong>${formatRupiah(item.total)}</strong></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('printModal').classList.add('show');
}

function closePrintModal() {
  document.getElementById('printModal').classList.remove('show');
}

async function loadInvoiceHistory() {
  try {
    const res = await fetch('/api/invoices/list');
    const data = await res.json();
    const tbody = document.getElementById('invoiceListBody');
    tbody.innerHTML = '';

    if (!data.success || data.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 24px; color: #64748b;">Belum ada riwayat nota yang tersimpan.</td></tr>`;
      return;
    }

    data.data.forEach(inv => {
      const summary = inv.taxCalculation?.summary || {};
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong class="input-mono">${inv.invoiceNo}</strong></td>
        <td>${inv.invoiceDate}</td>
        <td><strong>${inv.customer?.name || '-'}</strong>${inv.customer?.pic ? `<br><small style="color: #2563eb;">👤 Up: ${inv.customer.pic}</small>` : ''}</td>
        <td class="text-right">${formatRupiah(summary.subtotalDpp)}</td>
        <td class="text-right text-success">${formatRupiah(summary.totalPpn)}</td>
        <td class="text-right text-danger">${summary.pph23Amount ? '(' + formatRupiah(summary.pph23Amount) + ')' : '-'}</td>
        <td class="text-right"><strong>${formatRupiah(summary.totalDitransfer)}</strong></td>
        <td>
          <a href="/api/invoices/${encodeURIComponent(inv.invoiceNo)}/export-xml" class="btn btn-sm btn-success" title="Download XML Coretax">
            📥 XML
          </a>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Gagal memuat riwayat nota:', err);
  }
}

// ==========================================
// MASTER LAWAN TRANSAKSI (CUSTOMER) CRUD
// ==========================================

async function renderCustomerMasterTable() {
  await loadCustomerMaster();
  const tbody = document.getElementById('customerTableBody');
  tbody.innerHTML = '';

  if (!sampleCustomers || sampleCustomers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding: 24px; color: #64748b;">Belum ada master lawan transaksi.</td></tr>`;
    return;
  }

  sampleCustomers.forEach(cust => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="input-mono" style="font-size: 11px;">${cust.id}</span></td>
      <td><span class="pill-info">${cust.tipeWp}</span></td>
      <td><strong>${cust.name}</strong>${cust.pic ? `<br><small style="color: #2563eb;">👤 Up: ${cust.pic}${cust.jabatan ? ` (${cust.jabatan})` : ''}</small>` : ''}</td>
      <td><span class="input-mono">${cust.npwpOrNik}</span></td>
      <td><span class="input-mono" style="font-size: 11px;">${cust.nitku}</span></td>
      <td><small>${cust.address || '-'}</small><br><small style="color: #64748b;">${cust.phone || ''}</small></td>
      <td class="text-center"><span class="badge badge-seller">${cust.defaultKodeTransaksi || '01'}</span></td>
      <td class="text-center">${cust.isPemotongPph23 ? '✅ Ya (2%)' : '❌ Tidak'}</td>
      <td>
        <button type="button" class="btn btn-sm btn-secondary" onclick="editCustomer('${cust.id}')">✏️</button>
        <button type="button" class="btn btn-sm btn-outline text-danger" onclick="deleteCustomerMaster('${cust.id}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openCustomerModal(cust = null) {
  document.getElementById('formCustomerMaster').reset();
  if (cust) {
    document.getElementById('custModalTitle').textContent = 'Edit Master Lawan Transaksi';
    document.getElementById('custMasterId').value = cust.id;
    document.getElementById('custMasterTipe').value = cust.tipeWp;
    document.getElementById('custMasterNama').value = cust.name;
    const picInput = document.getElementById('custMasterPic');
    if (picInput) picInput.value = cust.pic || '';
    const jabInput = document.getElementById('custMasterJabatan');
    if (jabInput) jabInput.value = cust.jabatan || '';
    document.getElementById('custMasterNpwp').value = cust.npwpOrNik;
    document.getElementById('custMasterNitku').value = cust.nitku;
    document.getElementById('custMasterAlamat').value = cust.address || '';
    document.getElementById('custMasterEmail').value = cust.email || '';
    document.getElementById('custMasterPhone').value = cust.phone || '';
    document.getElementById('custMasterKodeTrx').value = cust.defaultKodeTransaksi || '01';
    document.getElementById('custMasterPph23').checked = Boolean(cust.isPemotongPph23);
  } else {
    document.getElementById('custModalTitle').textContent = 'Tambah Master Lawan Transaksi Coretax';
    document.getElementById('custMasterId').value = '';
    const picInput = document.getElementById('custMasterPic');
    if (picInput) picInput.value = '';
    const jabInput = document.getElementById('custMasterJabatan');
    if (jabInput) jabInput.value = '';
    document.getElementById('custMasterKodeTrx').value = '01';
    document.getElementById('custMasterPph23').checked = true;
  }
  document.getElementById('customerModal').classList.add('show');
}

function closeCustomerModal() {
  document.getElementById('customerModal').classList.remove('show');
}

window.editCustomer = function(id) {
  const cust = sampleCustomers.find(c => c.id === id);
  if (cust) openCustomerModal(cust);
};

window.deleteCustomerMaster = async function(id) {
  if (!confirm(`Hapus master lawan transaksi ID: ${id}?`)) return;
  try {
    const res = await fetch(`/api/invoices/customers/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      await renderCustomerMasterTable();
      refreshCustomerDropdown();
    } else {
      alert('Gagal menghapus rekanan');
    }
  } catch (err) {
    console.error('Error delete customer:', err);
  }
};

async function saveCustomerMaster() {
  const id = document.getElementById('custMasterId').value.trim();
  const tipeWp = document.getElementById('custMasterTipe').value;
  const name = document.getElementById('custMasterNama').value.trim();
  const pic = document.getElementById('custMasterPic') ? document.getElementById('custMasterPic').value.trim() : '';
  const jabatan = document.getElementById('custMasterJabatan') ? document.getElementById('custMasterJabatan').value.trim() : '';
  const npwpOrNik = document.getElementById('custMasterNpwp').value.trim();
  let nitku = document.getElementById('custMasterNitku').value.trim();
  const address = document.getElementById('custMasterAlamat').value.trim();
  const email = document.getElementById('custMasterEmail').value.trim();
  const phone = document.getElementById('custMasterPhone').value.trim();
  const defaultKodeTransaksi = document.getElementById('custMasterKodeTrx').value;
  const isPemotongPph23 = document.getElementById('custMasterPph23').checked;

  if (!name || !npwpOrNik) {
    alert('Nama dan NPWP 16/NIK wajib diisi!');
    return;
  }

  if (npwpOrNik.length === 16 && (!nitku || nitku.length < 22)) {
    nitku = npwpOrNik + '000000';
  }

  const payload = {
    id: id || undefined,
    tipeWp,
    name,
    pic,
    jabatan,
    npwpOrNik,
    nitku: nitku || '0000000000000000000000',
    address,
    email,
    phone,
    defaultKodeTransaksi,
    isPemotongPph23
  };

  try {
    const res = await fetch('/api/invoices/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeCustomerModal();
      await renderCustomerMasterTable();
      refreshCustomerDropdown();
      alert('✅ Master Lawan Transaksi berhasil disimpan!');
    } else {
      alert(`Gagal: ${data.message}`);
    }
  } catch (err) {
    console.error('Gagal menyimpan master customer:', err);
  }
}

function refreshCustomerDropdown() {
  const select = document.getElementById('quickCustomerSelect');
  select.innerHTML = '<option value="">-- Pilih Lawan Transaksi Coretax --</option>';
  sampleCustomers.forEach(cust => {
    const opt = document.createElement('option');
    opt.value = cust.id;
    opt.textContent = `[${cust.tipeWp}] ${cust.name}`;
    select.appendChild(opt);
  });
}

// ==========================================
// MASTER BARANG & JASA (PRODUCTS & SERVICES) CRUD
// ==========================================

async function renderProductMasterTable() {
  await loadProductCatalog();
  const tbody = document.getElementById('productTableBody');
  tbody.innerHTML = '';

  if (!catalogProducts || catalogProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding: 24px; color: #64748b;">Belum ada master barang atau jasa.</td></tr>`;
    return;
  }

  catalogProducts.forEach(prod => {
    const isJasa = prod.tipe === 'Jasa';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="input-mono"><strong>${prod.sku}</strong></span></td>
      <td><span class="badge ${isJasa ? 'badge-coretax' : 'badge-seller'}">${prod.tipe || 'Barang'}</span></td>
      <td><small class="input-mono">${prod.kodeCoretax || '-'}</small></td>
      <td><strong>${prod.name}</strong></td>
      <td>${prod.satuan || 'Unit'}</td>
      <td class="text-right"><strong>${formatRupiah(prod.unitPrice)}</strong></td>
      <td class="text-center">${prod.isDppNilaiLain ? '✅ Ya (11/12)' : '❌ Normal'}</td>
      <td class="text-center">${prod.isObjekPph23 ? '✅ Ya (2%)' : '❌ Tidak'}</td>
      <td>
        <button type="button" class="btn btn-sm btn-secondary" onclick="editProduct('${prod.sku}')">✏️</button>
        <button type="button" class="btn btn-sm btn-outline text-danger" onclick="deleteProductMaster('${prod.sku}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openProductModal(prod = null) {
  document.getElementById('formProductMaster').reset();
  if (prod) {
    document.getElementById('prodModalTitle').textContent = 'Edit Master Barang / Jasa';
    document.getElementById('prodMasterTipe').value = prod.tipe || 'Barang';
    document.getElementById('prodMasterSku').value = prod.sku;
    document.getElementById('prodMasterSku').readOnly = true;
    document.getElementById('prodMasterNama').value = prod.name;
    document.getElementById('prodMasterKodeCoretax').value = prod.kodeCoretax || '000000 - Jasa';
    document.getElementById('prodMasterSatuan').value = prod.satuan || 'Unit';
    document.getElementById('prodMasterHarga').value = prod.unitPrice || 0;
    document.getElementById('prodMasterDppLain').checked = Boolean(prod.isDppNilaiLain);
    document.getElementById('prodMasterPph23').checked = Boolean(prod.isObjekPph23);
  } else {
    document.getElementById('prodModalTitle').textContent = 'Tambah Master Barang / Jasa Coretax';
    document.getElementById('prodMasterSku').readOnly = false;
    document.getElementById('prodMasterTipe').value = 'Jasa';
    document.getElementById('prodMasterKodeCoretax').value = '000000 - Jasa';
    document.getElementById('prodMasterSatuan').value = 'Lainnya';
    document.getElementById('prodMasterDppLain').checked = true;
    document.getElementById('prodMasterPph23').checked = true;
  }
  document.getElementById('productModal').classList.add('show');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('show');
}

window.editProduct = function(sku) {
  const prod = catalogProducts.find(p => p.sku === sku);
  if (prod) openProductModal(prod);
};

window.deleteProductMaster = async function(sku) {
  if (!confirm(`Hapus master produk/jasa SKU: ${sku}?`)) return;
  try {
    const res = await fetch(`/api/invoices/products/${encodeURIComponent(sku)}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      await renderProductMasterTable();
      refreshProductDropdown();
    } else {
      alert('Gagal menghapus produk/jasa');
    }
  } catch (err) {
    console.error('Error delete product:', err);
  }
};

async function saveProductMaster() {
  const tipe = document.getElementById('prodMasterTipe').value;
  const sku = document.getElementById('prodMasterSku').value.trim();
  const name = document.getElementById('prodMasterNama').value.trim();
  const kodeCoretax = document.getElementById('prodMasterKodeCoretax').value.trim();
  const satuan = document.getElementById('prodMasterSatuan').value;
  const unitPrice = Number(document.getElementById('prodMasterHarga').value || 0);
  const isDppNilaiLain = document.getElementById('prodMasterDppLain').checked;
  const isObjekPph23 = document.getElementById('prodMasterPph23').checked;

  if (!sku || !name) {
    alert('Kode SKU dan Nama Barang/Jasa wajib diisi!');
    return;
  }

  const payload = {
    sku,
    tipe,
    name,
    kategori: tipe,
    kodeCoretax,
    satuan,
    unitPrice,
    isDppNilaiLain,
    dppNilaiLainCustom: isDppNilaiLain ? Math.round(unitPrice * (11 / 12)) : null,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23,
    pph23Rate: isObjekPph23 ? 2 : 0
  };

  try {
    const res = await fetch('/api/invoices/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeProductModal();
      await renderProductMasterTable();
      refreshProductDropdown();
      alert('✅ Master Barang/Jasa berhasil disimpan!');
    } else {
      alert(`Gagal: ${data.message}`);
    }
  } catch (err) {
    console.error('Gagal menyimpan master produk:', err);
  }
}

function refreshProductDropdown() {
  const select = document.getElementById('quickCatalogSelect');
  select.innerHTML = '<option value="">-- Pilih Produk CV. Istana Barcode --</option>';
  catalogProducts.forEach(prod => {
    const opt = document.createElement('option');
    opt.value = prod.sku;
    opt.textContent = `[${prod.tipe || prod.kategori}] ${prod.name} (${formatRupiah(prod.unitPrice)})`;
    select.appendChild(opt);
  });
}

async function saveSellerSettingsHandler() {
  const name = document.getElementById('sellerName').value.trim();
  const tagline = document.getElementById('sellerTagline') ? document.getElementById('sellerTagline').value.trim() : 'Official IT Solution & POS Barcode Hardware System';
  const phone = document.getElementById('sellerPhone').value.trim();
  const npwp16 = document.getElementById('sellerNpwp16').value.trim();
  const nitku = document.getElementById('sellerNitku').value.trim();
  const address = document.getElementById('sellerAddress').value.trim();
  const bankName = document.getElementById('sellerBankName').value.trim();
  const bankAccount = document.getElementById('sellerBankAccount').value.trim();
  const bankAccountName = document.getElementById('sellerBankAccountName').value.trim();
  const email = document.getElementById('sellerEmailTax').value.trim();
  const managerName = document.getElementById('sellerManagerName') ? document.getElementById('sellerManagerName').value.trim() : 'Djohan Hutagalung, S.Kom.';
  const managerTitle = document.getElementById('sellerManagerTitle') ? document.getElementById('sellerManagerTitle').value.trim() : 'Manager CV. Istana Barcode Computer';
  let defaultNotes = document.getElementById('sellerDefaultNotes').value.trim();

  // Jika notes kosong, buat dari data rekening
  if (!defaultNotes) {
    defaultNotes = `1. Pembayaran ditransfer ke rekening: ${bankName} ${bankAccount} a.n ${bankAccountName}.\n2. Bukti potong PPh Pasal 23 (e-Bupot Unifikasi) mohon diemail ke ${email}.\n3. Garansi sistem barcode 1 tahun service.`;
    document.getElementById('sellerDefaultNotes').value = defaultNotes;
  }

  const payload = {
    name,
    tagline,
    phone,
    npwp16,
    nitku,
    address,
    bankName,
    bankAccount,
    bankAccountName,
    email,
    managerName,
    managerTitle,
    defaultNotes,
    logoBase64: sellerProfileData?.logoBase64 || null,
    stempelBase64: sellerProfileData?.stempelBase64 || null
  };

  try {
    const res = await fetch('/api/invoices/seller-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      sellerProfileData = data.data;
      document.getElementById('sellerBadge').textContent = `NPWP: ${data.data.npwp16}`;
      document.getElementById('invoiceNotes').value = defaultNotes;
      const feedback = document.getElementById('sellerSaveFeedback');
      if (feedback) {
        feedback.textContent = '✅ Profil toko & rekening berhasil disimpan!';
        setTimeout(() => { feedback.textContent = ''; }, 4000);
      }
      alert('✅ Profil toko & instruksi transfer berhasil diperbarui!\nCatatan ini akan otomatis muncul pada setiap nota baru.');
    }
  } catch (err) {
    console.error('Gagal menyimpan profil seller:', err);
    alert('Terjadi kesalahan saat menyimpan pengaturan toko.');
  }
}
