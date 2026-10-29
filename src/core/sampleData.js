/**
 * sampleData.js
 * Master Data Lawan Transaksi & Master Barang / Jasa Sesuai Tampilan Coretax DJP
 * CV. Istana Barcode Computer
 */

const SAMPLE_CUSTOMERS = [
  {
    id: 'CUST-001',
    tipeWp: 'BADAN',
    name: 'PT. SUMBER ALFARIA RETAIL TBK',
    npwpOrNik: '0134567890123000',
    nitku: '0134567890123000000001',
    address: 'Jl. MH Thamrin No. 9, Cikokol, Tangerang, Banten 15117',
    email: 'tax.ap@alfamart.co.id',
    phone: '021-55755999',
    defaultKodeTransaksi: '01',
    isPemotongPph23: true
  },
  {
    id: 'CUST-002',
    tipeWp: 'BADAN',
    name: 'PT. MULTI RETAIL LOGISTIK INDONESIA',
    npwpOrNik: '0245678901234000',
    nitku: '0245678901234000000000',
    address: 'Kawasan Industri Pulogadung Blok B No. 45, Cakung, Jakarta Timur 13930',
    email: 'finance.tax@multiretail.co.id',
    phone: '021-46801234',
    defaultKodeTransaksi: '04', // DPP Nilai Lain
    isPemotongPph23: true
  },
  {
    id: 'CUST-003',
    tipeWp: 'BADAN',
    name: 'CV. JAYA MAKMUR MINIMARKET',
    npwpOrNik: '0356789012345000',
    nitku: '0356789012345000000000',
    address: 'Jl. Raya Darmo Permai No. 88, Surabaya, Jawa Timur 60189',
    email: 'jayamakmur.pos@gmail.com',
    phone: '031-7341234',
    defaultKodeTransaksi: '01',
    isPemotongPph23: false
  },
  {
    id: 'CUST-004',
    tipeWp: 'ORANG_PRIBADI',
    name: 'HENDRO WIJAYA (TOKO KASIR SENTOSA)',
    npwpOrNik: '3174051208850003',
    nitku: '3174051208850003000000',
    address: 'Pusat Grosir Mangga Dua Lt. 2 Blok B No. 15, Jakarta Pusat',
    email: 'hendro.kasir@yahoo.com',
    phone: '0813-8899-7711',
    defaultKodeTransaksi: '01',
    isPemotongPph23: false
  },
  {
    id: 'CUST-005',
    tipeWp: 'BADAN',
    name: 'PT. POS LOGISTIK INDONESIA (PERSERO)',
    npwpOrNik: '0100055540510000',
    nitku: '0100055540510000000000',
    address: 'Gedung Pos Ibukota Lt. 2, Jl. Lapangan Banteng Utara No. 1, Jakarta Pusat',
    email: 'perpajakan@poslogistics.co.id',
    phone: '021-3844567',
    defaultKodeTransaksi: '03',
    isPemotongPph23: true
  }
];

const SAMPLE_PRODUCTS = [
  // --- KELOMPOK JASA (JKP - OBJEK PPH 23 & PPN NILAI LAIN 12%) ---
  {
    sku: 'SRV-PAYROLL-001',
    tipe: 'Jasa',
    kodeCoretax: '000000 - Jasa',
    name: 'Jasa Pembuatan Aplikasi Sistem Informasi Manajemen Payroll',
    satuan: 'Lainnya',
    unitPrice: 75000000,
    isDppNilaiLain: true,
    dppNilaiLainCustom: 68750000,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23: true,
    pph23Rate: 2
  },
  {
    sku: 'SRV-POS-APP',
    tipe: 'Jasa',
    kodeCoretax: '000000 - Jasa',
    name: 'Jasa Pengembangan & Integrasi Software Kasir POS Barcode Cloud',
    satuan: 'Paket',
    unitPrice: 35000000,
    isDppNilaiLain: true,
    dppNilaiLainCustom: 32083333,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23: true,
    pph23Rate: 2
  },
  {
    sku: 'SRV-INSTALASI-001',
    tipe: 'Jasa',
    kodeCoretax: '000000 - Jasa',
    name: 'Jasa Instalasi, Setting Hardware Barcode Scanner & Printer Kasir',
    satuan: 'Paket',
    unitPrice: 3500000,
    isDppNilaiLain: false,
    dppNilaiLainCustom: null,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23: true,
    pph23Rate: 2
  },
  {
    sku: 'SRV-MNT-KONTRAK',
    tipe: 'Jasa',
    kodeCoretax: '000000 - Jasa',
    name: 'Jasa Pemeliharaan & Troubleshooting Sistem Kasir (Maintenance Kontrak)',
    satuan: 'Bulan',
    unitPrice: 5000000,
    isDppNilaiLain: false,
    dppNilaiLainCustom: null,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23: true,
    pph23Rate: 2
  },

  // --- KELOMPOK BARANG (BKP) ---
  {
    sku: 'BAR-SCN-001',
    tipe: 'Barang',
    kodeCoretax: '45281001 - Scanner Optik',
    name: 'Barcode Scanner 2D Honeywell Voyager 1400g (USB Auto-Sense)',
    satuan: 'Unit',
    unitPrice: 1250000,
    isDppNilaiLain: false,
    dppNilaiLainCustom: null,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23: false
  },
  {
    sku: 'BAR-PRN-001',
    tipe: 'Barang',
    kodeCoretax: '45262002 - Printer Label',
    name: 'Printer Barcode Thermal Transfer TSC TTP-244 Pro',
    satuan: 'Unit',
    unitPrice: 3200000,
    isDppNilaiLain: false,
    dppNilaiLainCustom: null,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23: false
  },
  {
    sku: 'POS-PRN-001',
    tipe: 'Barang',
    kodeCoretax: '45262001 - Printer Kasir',
    name: 'Printer Kasir Thermal 80mm Epson TM-T82X (Auto-Cutter)',
    satuan: 'Unit',
    unitPrice: 1950000,
    isDppNilaiLain: false,
    dppNilaiLainCustom: null,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23: false
  },
  {
    sku: 'CSM-RBN-001',
    tipe: 'Barang',
    kodeCoretax: '38912001 - Pita Ribbon',
    name: 'Ribbon Barcode Wax 110mm x 300m (Face Out - Core 1 Inch)',
    satuan: 'Roll',
    unitPrice: 65000,
    isDppNilaiLain: false,
    dppNilaiLainCustom: null,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23: false
  },
  {
    sku: 'CSM-LBL-001',
    tipe: 'Barang',
    kodeCoretax: '32199002 - Kertas Label',
    name: 'Label Barcode Semicoat 33mm x 15mm (3 Line Gap - 5000 Pcs)',
    satuan: 'Roll',
    unitPrice: 55000,
    isDppNilaiLain: false,
    dppNilaiLainCustom: null,
    ppnRate: 12,
    ppnBmRate: 0,
    isObjekPph23: false
  }
];

module.exports = {
  SAMPLE_CUSTOMERS,
  SAMPLE_PRODUCTS
};
