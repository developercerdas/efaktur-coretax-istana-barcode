/**
 * app.js
 * Logika Antarmuka Pembuatan Nota & e-Faktur Coretax DJP
 * CV. Istana Barcode Computer
 */

// ========================================================
// STATIC FALLBACK & GITHUB PAGES DUAL-MODE SUPPORT
// ========================================================
const DEFAULT_STATIC_SELLER = {
  npwp16: '0868643701506000',
  nitku: '-',
  name: 'CV. ISTANA BARCODE COMPUTER',
  address: 'Jl. KH. Moh. Arwani No. 7 Kota Kudus',
  email: 'istanabarcodecomputer@gmail.com',
  phone: '085 640 433 307',
  bankName: 'Bank BCA',
  bankAccount: '0310588628',
  bankAccountName: 'Djohan Hutagalung',
  tagline: 'Official IT Solution & POS Barcode Hardware System',
  managerName: 'Djohan Hutagalung, S.Kom.',
  managerTitle: 'Manager CV. Istana Barcode Computer',
  logoUrl: 'assets/logo_ibc.png',
  stempelUrl: 'assets/stempel_ibc.png',
  defaultNotes: '1. Pembayaran ditransfer ke rekening: Bank BCA 0310588628 a.n Djohan Hutagalung.\n2. Bukti potong PPh Pasal 23 (e-Bupot Unifikasi) mohon diemail ke istanabarcodecomputer@gmail.com.\n3. Garansi sistem barcode 1 tahun service.'
};

const DEFAULT_STATIC_CUSTOMERS = [
  {
    id: 'CUST-RETAIL-01',
    tipeWp: 'ORANG_PRIBADI',
    name: 'PELANGGAN UMUM / TOKO RETAIL (NON-PAJAK)',
    pic: 'Kasir / Pembeli Langsung',
    jabatan: 'Customer',
    npwpOrNik: '-',
    nitku: '-',
    address: 'Kota Kudus & Sekitarnya',
    email: '-',
    phone: '-',
    defaultKodeTransaksi: '01',
    isPemotongPph23: false,
    isNonPajak: true
  },
  {
    id: 'CUST-SUKUN-01',
    tipeWp: 'BADAN',
    name: 'PT. SUKUN WARTONO INDONESIA',
    pic: 'Chaulanna R. Wartono, SE., MA.',
    jabatan: 'Manager HRD',
    npwpOrNik: '0937832202506000',
    nitku: '0937832202506000000000',
    address: 'Jl. Raya PR Sukun, 01, Gondosari Gebog, Kab. Kudus, Jawa Tengah 59354',
    email: 'hrd@sukun.co.id',
    phone: '0291-432xxx',
    defaultKodeTransaksi: '04',
    isPemotongPph23: true
  },
  {
    id: 'CUST-001',
    tipeWp: 'BADAN',
    name: 'PT. SUMBER ALFARIA RETAIL TBK',
    pic: 'Bp. Budi Santoso',
    jabatan: 'Finance / AP',
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
    pic: 'Ibu Ratna',
    jabatan: 'Purchasing Manager',
    npwpOrNik: '0245678901234000',
    nitku: '0245678901234000000000',
    address: 'Kawasan Industri Pulogadung Blok B No. 45, Cakung, Jakarta Timur 13930',
    email: 'finance.tax@multiretail.co.id',
    phone: '021-46801234',
    defaultKodeTransaksi: '04',
    isPemotongPph23: true
  },
  {
    id: 'CUST-004',
    tipeWp: 'ORANG_PRIBADI',
    name: 'HENDRO WIJAYA (TOKO KASIR SENTOSA)',
    pic: 'Hendro Wijaya',
    jabatan: 'Pemilik Toko',
    npwpOrNik: '3174051208850003',
    nitku: '3174051208850003000000',
    address: 'Pusat Grosir Mangga Dua Lt. 2 Blok B No. 15, Jakarta Pusat',
    email: 'hendro.kasir@yahoo.com',
    phone: '0813-8899-7711',
    defaultKodeTransaksi: '01',
    isPemotongPph23: false
  }
];

const DEFAULT_STATIC_PRODUCTS = [
  {
    sku: 'SRV-PAYROLL-01',
    tipe: 'Jasa',
    kategori: 'Jasa',
    kodeCoretax: '000000 - Jasa',
    name: 'Pengembangan Sistem SIM Payroll Terintegrasi (Sekali bayar)',
    satuan: 'Paket',
    unitPrice: 60000000,
    isDppNilaiLain: true,
    isObjekPph23: true
  },
  {
    sku: 'SRV-WAGW-01',
    tipe: 'Jasa',
    kategori: 'Jasa',
    kodeCoretax: '000000 - Jasa',
    name: 'Integrasi & Setup WhatsApp Gateway (Internal) (Sekali bayar)',
    satuan: 'Paket',
    unitPrice: 9500000,
    isDppNilaiLain: true,
    isObjekPph23: true
  },
  {
    sku: 'SRV-CLOUD-01',
    tipe: 'Jasa',
    kategori: 'Jasa',
    kodeCoretax: '000000 - Jasa',
    name: 'Sewa Cloud Server & Setup Domain (Dibayar per bulan)',
    satuan: 'Bulan',
    unitPrice: 4000000,
    isDppNilaiLain: true,
    isObjekPph23: true
  },
  {
    sku: 'SRV-TRAIN-01',
    tipe: 'Jasa',
    kategori: 'Jasa',
    kodeCoretax: '000000 - Jasa',
    name: 'Jasa Training & Implementasi (Sekali bayar)',
    satuan: 'Paket',
    unitPrice: 1500000,
    isDppNilaiLain: true,
    isObjekPph23: true
  },
  {
    sku: 'BCS-2D-HW1',
    tipe: 'Barang',
    kategori: 'Hardware',
    kodeCoretax: '45281001 - Barcode Scanner 1D/2D',
    name: 'Honeywell HF680 2D Omnidirectional Presentation Barcode Scanner',
    satuan: 'Unit',
    unitPrice: 1850000,
    isDppNilaiLain: true,
    isObjekPph23: false
  },
  {
    sku: 'PRT-LBL-TSC',
    tipe: 'Barang',
    kategori: 'Hardware',
    kodeCoretax: '45262002 - Printer Label Barcode',
    name: 'TSC TE200 Barcode Label Printer USB Direct Thermal & Thermal Transfer',
    satuan: 'Unit',
    unitPrice: 3200000,
    isDppNilaiLain: true,
    isObjekPph23: false
  }
];

function terbilangRupiahClient(nominal) {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  const angka = Math.floor(Math.abs(nominal));
  if (angka < 12) return bilangan[angka];
  if (angka < 20) return terbilangRupiahClient(angka - 10) + ' Belas';
  if (angka < 100) return terbilangRupiahClient(Math.floor(angka / 10)) + ' Puluh ' + terbilangRupiahClient(angka % 10);
  if (angka < 200) return 'Seratus ' + terbilangRupiahClient(angka - 100);
  if (angka < 1000) return terbilangRupiahClient(Math.floor(angka / 100)) + ' Ratus ' + terbilangRupiahClient(angka % 100);
  if (angka < 2000) return 'Seribu ' + terbilangRupiahClient(angka - 1000);
  if (angka < 1000000) return terbilangRupiahClient(Math.floor(angka / 1000)) + ' Ribu ' + terbilangRupiahClient(angka % 1000);
  if (angka < 1000000000) return terbilangRupiahClient(Math.floor(angka / 1000000)) + ' Juta ' + terbilangRupiahClient(angka % 1000000);
  if (angka < 1000000000000) return terbilangRupiahClient(Math.floor(angka / 1000000000)) + ' Miliar ' + terbilangRupiahClient(angka % 1000000000);
  return terbilangRupiahClient(Math.floor(angka / 1000000000000)) + ' Triliun ' + terbilangRupiahClient(angka % 1000000000000);
}

function calculateClientSide(items, options) {
  const isNonPajak = Boolean(options.isNonPajak ?? false);
  const ppnRate = isNonPajak ? 0 : Number(options.ppnRate ?? 12);
  const kodeTransaksi = isNonPajak ? '00' : (options.kodeTransaksi || '01');
  const useDppNilaiLain = isNonPajak ? false : Boolean(options.useDppNilaiLain || kodeTransaksi === '04');
  const hasPph23 = isNonPajak ? false : Boolean(options.hasPph23 ?? false);
  const pph23Rate = isNonPajak ? 0 : Number(options.pph23Rate ?? 2);

  let totalBruto = 0;
  let totalDiskon = 0;

  const processedItems = items.map((item, index) => {
    const qty = Math.max(0, Number(item.qty || 1));
    const unitPrice = Math.max(0, Number(item.unitPrice || 0));
    const discount = Math.max(0, Number(item.discount || 0));
    const gross = qty * unitPrice;
    const netGross = Math.max(0, gross - discount);
    totalBruto += gross;
    totalDiskon += discount;
    return {
      urutan: index + 1,
      sku: item.sku || ('ITEM-' + (index + 1)),
      name: item.name || 'Barang/Jasa Barcode',
      kategori: item.kategori || 'Hardware',
      qty,
      unitPrice,
      discount,
      gross,
      netGross,
      total: netGross
    };
  });

  const subtotalDppDasar = Math.max(0, totalBruto - totalDiskon);
  let dppPajak = subtotalDppDasar;
  if (!isNonPajak && useDppNilaiLain) {
    if (options.customDppNilaiLain && Number(options.customDppNilaiLain) > 0) {
      dppPajak = Number(options.customDppNilaiLain);
    } else {
      dppPajak = Math.round(subtotalDppDasar * (11 / 12));
    }
  }

  const totalPpn = isNonPajak ? 0 : Math.round(dppPajak * (ppnRate / 100));
  const totalTagihan = subtotalDppDasar + totalPpn;
  let pph23Amount = 0;
  if (!isNonPajak && hasPph23) {
    pph23Amount = Math.round(subtotalDppDasar * (pph23Rate / 100));
  }
  const totalDitransfer = totalTagihan - pph23Amount;

  return {
    isNonPajak,
    kodeTransaksi,
    ppnRate,
    useDppNilaiLain,
    hasPph23,
    pph23Rate,
    items: processedItems,
    summary: {
      totalBruto,
      totalDiskon,
      subtotalDpp: subtotalDppDasar,
      totalDpp: isNonPajak ? subtotalDppDasar : dppPajak,
      dppNilaiLain: (useDppNilaiLain && !isNonPajak) ? dppPajak : 0,
      totalPpn,
      totalTagihan: isNonPajak ? subtotalDppDasar : totalTagihan,
      pph23Amount,
      totalDitransfer: isNonPajak ? subtotalDppDasar : totalDitransfer,
      terbilang: terbilangRupiahClient(isNonPajak ? subtotalDppDasar : totalDitransfer).trim() + ' Rupiah'
    }
  };
}

function generateClientCoretaxXML(inv) {
  const seller = inv.seller || sellerProfileData || DEFAULT_STATIC_SELLER;
  const customer = inv.customer || {};
  const tax = inv.taxCalculation || {};
  const summary = tax.summary || {};
  const items = tax.items || inv.items || [];
  const invoiceDate = inv.invoiceDate || new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<TaxInvoiceBulk xmlns="http://djp.pajak.go.id/coretax/efaktur/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n';
  xml += '  <TaxInvoice>\n';
  xml += '    <InvoiceHeader>\n';
  xml += '      <InvoiceNumber>' + (inv.invoiceNo || 'INV-001') + '</InvoiceNumber>\n';
  xml += '      <InvoiceDate>' + invoiceDate + '</InvoiceDate>\n';
  xml += '      <TransactionCode>' + (tax.kodeTransaksi || '04') + '</TransactionCode>\n';
  xml += '      <TaxPeriod>' + invoiceDate.substring(5, 7) + '</TaxPeriod>\n';
  xml += '      <TaxYear>' + invoiceDate.substring(0, 4) + '</TaxYear>\n';
  xml += '      <ReferenceDocNumber>' + (inv.invoiceNo || 'INV-001') + '</ReferenceDocNumber>\n';
  xml += '      <Currency>IDR</Currency>\n';
  xml += '    </InvoiceHeader>\n';
  xml += '    <Seller>\n';
  xml += '      <Tin16>' + (seller.npwp16 || '0868643701506000') + '</Tin16>\n';
  xml += '      <Nitku>' + (seller.nitku || '-') + '</Nitku>\n';
  xml += '      <Name>' + (seller.name || 'CV. ISTANA BARCODE COMPUTER') + '</Name>\n';
  xml += '      <Address>' + (seller.address || 'Jl. KH. Moh. Arwani No. 7 Kota Kudus') + '</Address>\n';
  xml += '      <Email>' + (seller.email || 'istanabarcodecomputer@gmail.com') + '</Email>\n';
  xml += '      <Phone>' + (seller.phone || '085 640 433 307') + '</Phone>\n';
  xml += '    </Seller>\n';
  xml += '    <Buyer>\n';
  xml += '      <Tin16>' + (customer.npwpOrNik || '0000000000000000') + '</Tin16>\n';
  xml += '      <Nitku>' + (customer.nitku || '-') + '</Nitku>\n';
  xml += '      <Name>' + (customer.name || '-') + '</Name>\n';
  xml += '      <Address>' + (customer.address || '-') + '</Address>\n';
  xml += '      <Email>' + (customer.email || '-') + '</Email>\n';
  xml += '      <Phone>' + (customer.phone || '-') + '</Phone>\n';
  xml += '      <CustomerType>' + (customer.tipeWp || 'BADAN') + '</CustomerType>\n';
  xml += '    </Buyer>\n';
  xml += '    <GoodsServicesList>\n';
  items.forEach((item, idx) => {
    xml += '      <GoodService>\n';
    xml += '        <ItemSequence>' + (item.urutan || (idx + 1)) + '</ItemSequence>\n';
    xml += '        <ItemCode>' + (item.sku || 'SKU') + '</ItemCode>\n';
    xml += '        <ItemDescription>' + (item.name || '') + '</ItemDescription>\n';
    xml += '        <ItemCategory>' + (item.kategori || 'Jasa') + '</ItemCategory>\n';
    xml += '        <Quantity>' + (item.qty || 1) + '</Quantity>\n';
    xml += '        <UnitPrice>' + (item.unitPrice || 0) + '</UnitPrice>\n';
    xml += '        <Discount>' + (item.discount || 0) + '</Discount>\n';
    xml += '        <TotalAmount>' + (item.total || item.gross || 0) + '</TotalAmount>\n';
    xml += '      </GoodService>\n';
  });
  xml += '    </GoodsServicesList>\n';
  xml += '    <TaxSummary>\n';
  xml += '      <SubtotalBaseAmount>' + (summary.subtotalDpp || 0) + '</SubtotalBaseAmount>\n';
  xml += '      <TaxBaseDpp>' + (summary.totalDpp || 0) + '</TaxBaseDpp>\n';
  xml += '      <IsOtherTaxBase>' + (tax.useDppNilaiLain ? 'true' : 'false') + '</IsOtherTaxBase>\n';
  xml += '      <VatRate>' + (tax.ppnRate || 12) + '</VatRate>\n';
  xml += '      <VatAmount>' + (summary.totalPpn || 0) + '</VatAmount>\n';
  xml += '      <TotalInvoiceAmount>' + (summary.totalTagihan || 0) + '</TotalInvoiceAmount>\n';
  xml += '      <WithholdingTaxRate>' + (tax.hasPph23 ? (tax.pph23Rate || 2) : 0) + '</WithholdingTaxRate>\n';
  xml += '      <WithholdingTaxAmount>' + (summary.pph23Amount || 0) + '</WithholdingTaxAmount>\n';
  xml += '      <NetPayableAmount>' + (summary.totalDitransfer || 0) + '</NetPayableAmount>\n';
  xml += '    </TaxSummary>\n';
  xml += '  </TaxInvoice>\n';
  xml += '</TaxInvoiceBulk>';
  return xml;
}

const DEFAULT_STATIC_INVOICES = [
  {
    "invoiceNo": "INV/IBC/202610/5962",
    "invoiceDate": "2026-10-29",
    "customer": {
      "name": "PT. SUKUN WARTONO INDONESIA",
      "pic": "Bapak Chaulana R. Wartono",
      "jabatan": "Chief Of Legal HR & GA",
      "tipeWp": "BADAN",
      "npwpOrNik": "0937832202506000",
      "nitku": "0937832202506000000000",
      "address": "Jl. Raya PR Sukun, 01, Gondosari Gebog, Kab. Kudus, Jawa Tengah 59354",
      "phone": "-",
      "email": "-"
    },
    "options": {
      "ppnRate": 12,
      "kodeTransaksi": "04",
      "useDppNilaiLain": true,
      "customDppNilaiLain": 68750000,
      "hasPph23": true,
      "pph23Rate": 2
    },
    "items": [
      {
        "sku": "SRV-PAYROLL-001",
        "name": "Jasa Pembuatan Aplikasi Sistem Informasi Manajemen Payroll",
        "kategori": "Jasa",
        "qty": 1,
        "unitPrice": 75000000,
        "discount": 0
      }
    ],
    "taxCalculation": {
      "kodeTransaksi": "04",
      "ppnRate": 12,
      "isPpnIncluded": false,
      "useDppNilaiLain": true,
      "hasPph23": true,
      "pph23Rate": 2,
      "items": [
        {
          "urutan": 1,
          "sku": "SRV-PAYROLL-001",
          "name": "Jasa Pembuatan Aplikasi Sistem Informasi Manajemen Payroll",
          "kategori": "Jasa",
          "qty": 1,
          "unitPrice": 75000000,
          "discount": 0,
          "gross": 75000000,
          "netGross": 75000000,
          "total": 75000000
        }
      ],
      "summary": {
        "totalBruto": 75000000,
        "totalDiskon": 0,
        "subtotalDpp": 75000000,
        "dppNilaiLain": 68750000,
        "totalDpp": 68750000,
        "totalPpn": 8250000,
        "totalTagihan": 83250000,
        "pph23Rate": 2,
        "pph23Amount": 1500000,
        "totalDitransfer": 81750000,
        "terbilang": "Delapan Puluh Satu Juta Tujuh Ratus Lima Puluh  Ribu Rupiah"
      }
    },
    "seller": {
      "npwp16": "0328912340510000",
      "nitku": "0328912340510000000000",
      "name": "CV. ISTANA BARCODE COMPUTER",
      "address": "Ruko Istana Barcode, Jl. Otomasi Kasir No. 88, Indonesia",
      "email": "tax@istanabarcode.com",
      "phone": "0812-3456-7890"
    },
    "status": "ACTIVE",
    "id": "INV-1793247856922",
    "createdAt": "2026-10-29T04:24:16.922Z",
    "updatedAt": "2026-10-29T04:34:03.808Z"
  },
  {
    "invoiceNo": "INV/IBC/202610/8515",
    "invoiceDate": "2026-10-28",
    "customer": {
      "name": "PT. SUKUN WARTONO INDONESIA",
      "tipeWp": "BADAN",
      "npwpOrNik": "0937832202506000",
      "nitku": "0937832202506000000000",
      "address": "Jl. Raya PR Sukun, 01, Gondosari Gebog, Kab. Kudus, Jawa Tengah 59354",
      "phone": "021-4680xxxx"
    },
    "options": {
      "ppnRate": 12,
      "kodeTransaksi": "04",
      "useDppNilaiLain": true,
      "customDppNilaiLain": 68750000,
      "hasPph23": true,
      "pph23Rate": 2
    },
    "items": [
      {
        "sku": "SRV-PAYROLL-001",
        "name": "Jasa Pembuatan Aplikasi Sistem Informasi Manajemen Payroll",
        "kategori": "Jasa",
        "qty": 1,
        "unitPrice": 75000000,
        "discount": 0
      }
    ],
    "taxCalculation": {
      "kodeTransaksi": "04",
      "ppnRate": 12,
      "isPpnIncluded": false,
      "useDppNilaiLain": true,
      "hasPph23": true,
      "pph23Rate": 2,
      "items": [
        {
          "urutan": 1,
          "sku": "SRV-PAYROLL-001",
          "name": "Jasa Pembuatan Aplikasi Sistem Informasi Manajemen Payroll",
          "kategori": "Jasa",
          "qty": 1,
          "unitPrice": 75000000,
          "discount": 0,
          "gross": 75000000,
          "netGross": 75000000,
          "total": 75000000
        }
      ],
      "summary": {
        "totalBruto": 75000000,
        "totalDiskon": 0,
        "subtotalDpp": 75000000,
        "dppNilaiLain": 68750000,
        "totalDpp": 68750000,
        "totalPpn": 8250000,
        "totalTagihan": 83250000,
        "pph23Rate": 2,
        "pph23Amount": 1500000,
        "totalDitransfer": 81750000,
        "terbilang": "Delapan Puluh Satu Juta Tujuh Ratus Lima Puluh  Ribu Rupiah"
      }
    },
    "seller": {
      "npwp16": "0328912340510000",
      "nitku": "0328912340510000000000",
      "name": "CV. ISTANA BARCODE COMPUTER",
      "address": "Ruko Istana Barcode, Jl. Otomasi Kasir No. 88, Indonesia",
      "email": "tax@istanabarcode.com",
      "phone": "0812-3456-7890"
    },
    "status": "ACTIVE",
    "id": "INV-1793173967636",
    "createdAt": "2026-10-28T07:52:47.636Z",
    "updatedAt": "2026-10-28T07:53:03.537Z"
  },
  {
    "invoiceNo": "INV/IBC/202610/8480",
    "invoiceDate": "2026-10-27",
    "customer": {
      "name": "PT. SUKUN WARTONO INDONESIA",
      "tipeWp": "BADAN",
      "npwpOrNik": "0937832202506000",
      "nitku": "0937832202506000000000",
      "address": "Jl. Raya PR Sukun, 01, Gondosari Gebog, Kab. Kudus, Jawa Tengah 59354",
      "phone": "021-4680xxxx"
    },
    "options": {
      "ppnRate": 12,
      "kodeTransaksi": "04",
      "useDppNilaiLain": true,
      "customDppNilaiLain": 68750000,
      "hasPph23": true,
      "pph23Rate": 2
    },
    "items": [
      {
        "sku": "SRV-PAYROLL-001",
        "name": "Jasa Pembuatan Aplikasi Sistem Informasi Manajemen Payroll",
        "kategori": "Jasa",
        "qty": 1,
        "unitPrice": 75000000,
        "discount": 0
      }
    ],
    "taxCalculation": {
      "kodeTransaksi": "04",
      "ppnRate": 12,
      "isPpnIncluded": false,
      "useDppNilaiLain": true,
      "hasPph23": true,
      "pph23Rate": 2,
      "items": [
        {
          "urutan": 1,
          "sku": "SRV-PAYROLL-001",
          "name": "Jasa Pembuatan Aplikasi Sistem Informasi Manajemen Payroll",
          "kategori": "Jasa",
          "qty": 1,
          "unitPrice": 75000000,
          "discount": 0,
          "gross": 75000000,
          "netGross": 75000000,
          "total": 75000000
        }
      ],
      "summary": {
        "totalBruto": 75000000,
        "totalDiskon": 0,
        "subtotalDpp": 75000000,
        "dppNilaiLain": 68750000,
        "totalDpp": 68750000,
        "totalPpn": 8250000,
        "totalTagihan": 83250000,
        "pph23Rate": 2,
        "pph23Amount": 1500000,
        "totalDitransfer": 81750000,
        "terbilang": "Delapan Puluh Satu Juta Tujuh Ratus Lima Puluh  Ribu Rupiah"
      }
    },
    "seller": {
      "npwp16": "0328912340510000",
      "nitku": "0328912340510000000000",
      "name": "CV. ISTANA BARCODE COMPUTER",
      "address": "Ruko Istana Barcode, Jl. Otomasi Kasir No. 88, Indonesia",
      "email": "tax@istanabarcode.com",
      "phone": "0812-3456-7890"
    },
    "status": "ACTIVE",
    "id": "INV-1793087109482",
    "createdAt": "2026-10-27T07:45:09.482Z",
    "updatedAt": "2026-10-27T07:45:30.546Z"
  },
  {
    "invoiceNo": "INV/IBC/202610/3907",
    "invoiceDate": "2026-10-27",
    "customer": {
      "name": "PT. SUKUN WARTONO INDONESIA",
      "tipeWp": "BADAN",
      "npwpOrNik": "0937832202506000",
      "nitku": "0937832202506000000000",
      "address": "JL. RAYA PR SUKUN, 01, GONDOSARI GEBOG KAB. KUDUS JAWA TENGAH 59354",
      "phone": ""
    },
    "options": {
      "ppnRate": 12,
      "kodeTransaksi": "04",
      "useDppNilaiLain": true,
      "customDppNilaiLain": 68750000,
      "hasPph23": true,
      "pph23Rate": 2
    },
    "items": [
      {
        "sku": "SRV-PAYROLL-001",
        "name": "Jasa Pembuatan Aplikasi Sistem Informasi Manajemen Payroll",
        "kategori": "Jasa",
        "qty": 1,
        "unitPrice": 75000000,
        "discount": 0
      }
    ],
    "taxCalculation": {
      "kodeTransaksi": "04",
      "ppnRate": 12,
      "isPpnIncluded": false,
      "useDppNilaiLain": true,
      "hasPph23": true,
      "pph23Rate": 2,
      "items": [
        {
          "urutan": 1,
          "sku": "SRV-PAYROLL-001",
          "name": "Jasa Pembuatan Aplikasi Sistem Informasi Manajemen Payroll",
          "kategori": "Jasa",
          "qty": 1,
          "unitPrice": 75000000,
          "discount": 0,
          "gross": 75000000,
          "netGross": 75000000,
          "total": 75000000
        }
      ],
      "summary": {
        "totalBruto": 75000000,
        "totalDiskon": 0,
        "subtotalDpp": 75000000,
        "dppNilaiLain": 68750000,
        "totalDpp": 68750000,
        "totalPpn": 8250000,
        "totalTagihan": 83250000,
        "pph23Rate": 2,
        "pph23Amount": 1500000,
        "totalDitransfer": 81750000,
        "terbilang": "Delapan Puluh Satu Juta Tujuh Ratus Lima Puluh  Ribu Rupiah"
      }
    },
    "seller": {
      "npwp16": "0328912340510000",
      "nitku": "0328912340510000000000",
      "name": "CV. ISTANA BARCODE COMPUTER",
      "address": "Ruko Istana Barcode, Jl. Otomasi Kasir No. 88, Indonesia",
      "email": "tax@istanabarcode.com",
      "phone": "0812-3456-7890"
    },
    "status": "ACTIVE",
    "id": "INV-1793077375535",
    "createdAt": "2026-10-27T05:02:55.535Z"
  }
];

let invoiceHistoryList = [];


window.viewHistoryInvoice = function(invoiceNoEncoded) {
  const invoiceNo = decodeURIComponent(invoiceNoEncoded);
  const inv = (invoiceHistoryList || []).find(i => i.invoiceNo === invoiceNo);
  if (!inv) {
    alert('Data nota tidak ditemukan.');
    return;
  }
  currentTaxCalculation = inv.taxCalculation;
  currentTransactionMode = (inv.isNonPajak || inv.options?.isNonPajak || inv.taxCalculation?.isNonPajak) ? 'NON_PAJAK' : 'PAJAK';
  document.getElementById('invoiceNo').value = inv.invoiceNo;
  document.getElementById('invoiceDate').value = inv.invoiceDate;
  document.getElementById('customerName').value = inv.customer?.name || '';
  if (document.getElementById('customerPic')) document.getElementById('customerPic').value = inv.customer?.pic || '';
  if (document.getElementById('customerJabatan')) document.getElementById('customerJabatan').value = inv.customer?.jabatan || '';
  if (document.getElementById('customerAddress')) document.getElementById('customerAddress').value = inv.customer?.address || '';
  if (document.getElementById('npwpOrNik')) document.getElementById('npwpOrNik').value = inv.customer?.npwpOrNik || '';
  if (document.getElementById('nitku')) document.getElementById('nitku').value = inv.customer?.nitku || '';
  if (document.getElementById('invoiceNotes')) document.getElementById('invoiceNotes').value = inv.seller?.defaultNotes || '';

  openPrintModal();
};

window.downloadInvoiceXml = function(invoiceNoEncoded) {
  const invoiceNo = decodeURIComponent(invoiceNoEncoded);
  const inv = (invoiceHistoryList || []).find(i => i.invoiceNo === invoiceNo) || savedInvoiceData;
  if (!inv) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.location.href = '/api/invoices/' + encodeURIComponent(invoiceNo) + '/export-xml';
      return;
    }
    alert('Data nota tidak ditemukan untuk diekspor.');
    return;
  }
  const xml = generateClientCoretaxXML(inv);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'eFaktur_Coretax_' + invoiceNo.replace(/[\/\\]/g, '_') + '.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

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
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        sampleCustomers = data.data;
      }
    }
  } catch (err) {
    console.log('Customer API offline, fallback to local');
  }

  if (!sampleCustomers || sampleCustomers.length === 0) {
    const local = localStorage.getItem('IBC_CUSTOMERS');
    sampleCustomers = local ? JSON.parse(local) : DEFAULT_STATIC_CUSTOMERS;
  }

  const select = document.getElementById('quickCustomerSelect');
  if (select) {
    select.innerHTML = '<option value="">-- Pilih Rekanan / Customer Coretax --</option>';
    sampleCustomers.forEach(cust => {
      const opt = document.createElement('option');
      opt.value = cust.id;
      opt.textContent = `[${cust.tipeWp}] ${cust.name}`;
      select.appendChild(opt);
    });
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
  if (typeof setTransactionMode === 'function') {
    setTransactionMode('PAJAK');
  }
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
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        catalogProducts = data.data;
      }
    }
  } catch (err) {
    console.log('Products API offline, fallback to local');
  }

  if (!catalogProducts || catalogProducts.length === 0) {
    const local = localStorage.getItem('IBC_PRODUCTS');
    catalogProducts = local ? JSON.parse(local) : DEFAULT_STATIC_PRODUCTS;
  }

  const select = document.getElementById('quickCatalogSelect');
  if (select) {
    select.innerHTML = '<option value="">-- Tambah Cepat dari Katalog Produk/Jasa --</option>';
    catalogProducts.forEach(prod => {
      const opt = document.createElement('option');
      opt.value = prod.sku;
      opt.textContent = `[${prod.kategori}] ${prod.name} (${formatRupiah(prod.unitPrice)})`;
      select.appendChild(opt);
    });
  }
}

let sellerProfileData = null;

async function loadSellerProfile() {
  try {
    const res = await fetch('/api/invoices/seller-profile');
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        sellerProfileData = data.data;
      }
    }
  } catch (err) {
    console.log('Seller profile API offline, fallback to local');
  }

  if (!sellerProfileData) {
    const local = localStorage.getItem('IBC_SELLER_PROFILE');
    sellerProfileData = local ? JSON.parse(local) : DEFAULT_STATIC_SELLER;
  }

  const sData = sellerProfileData;
  document.getElementById('sellerBadge').textContent = 'NPWP: ' + sData.npwp16;

  const hLogo = document.getElementById('headerLogoImg');
  const hIcon = document.getElementById('headerDefaultIcon');
  if (hLogo) {
    hLogo.src = sData.logoBase64 || sData.logoUrl || 'assets/logo_ibc.png';
    hLogo.style.display = 'block';
    if (hIcon) hIcon.style.display = 'none';
  }

  // Isi form settings
  const sName = document.getElementById('sellerName');
  if (sName) sName.value = sData.name || '';
  const sTagline = document.getElementById('sellerTagline');
  if (sTagline) sTagline.value = sData.tagline || 'Official IT Solution & POS Barcode Hardware System';
  const sPhone = document.getElementById('sellerPhone');
  if (sPhone) sPhone.value = sData.phone || '';
  const sNpwp = document.getElementById('sellerNpwp16');
  if (sNpwp) sNpwp.value = sData.npwp16 || '';
  const sNitku = document.getElementById('sellerNitku');
  if (sNitku) sNitku.value = sData.nitku || '';
  const sAddr = document.getElementById('sellerAddress');
  if (sAddr) sAddr.value = sData.address || '';
  const sBank = document.getElementById('sellerBankName');
  if (sBank) sBank.value = sData.bankName || 'Bank BCA';
  const sAcc = document.getElementById('sellerBankAccount');
  if (sAcc) sAcc.value = sData.bankAccount || '';
  const sAccName = document.getElementById('sellerBankAccountName');
  if (sAccName) sAccName.value = sData.bankAccountName || '';
  const sEmail = document.getElementById('sellerEmailTax');
  if (sEmail) sEmail.value = sData.email || '';
  const sNotes = document.getElementById('sellerDefaultNotes');
  if (sNotes) sNotes.value = sData.defaultNotes || '';

  // Set default ke form nota jika ada
  if (sData.defaultNotes) {
    document.getElementById('invoiceNotes').value = sData.defaultNotes;
  }

  // Update logo UI jika tersimpan
  if (sData.logoBase64) {
    updateLogoInUI(sData.logoBase64);
  }

  // Update stempel UI jika tersimpan
  if (sData.stempelBase64) {
    updateStempelInUI(sData.stempelBase64);
  }

  // Isi penandatangan manager
  const mgrName = document.getElementById('sellerManagerName');
  if (mgrName) mgrName.value = sData.managerName || 'Djohan Hutagalung, S.Kom.';
  const mgrTitle = document.getElementById('sellerManagerTitle');
  if (mgrTitle) mgrTitle.value = sData.managerTitle || 'Manager CV. Istana Barcode Computer';
}


let currentTransactionMode = 'PAJAK'; // 'PAJAK' | 'NON_PAJAK'

function setTransactionMode(mode) {
  currentTransactionMode = mode;
  const btnPajak = document.getElementById('btnModePajak');
  const btnNonPajak = document.getElementById('btnModeNonPajak');
  const groupKode = document.getElementById('groupKodeTransaksi');
  const taxBox = document.getElementById('taxOptionsBox');
  const notice = document.getElementById('nonPajakNotice');
  const summaryBadge = document.getElementById('summaryModeBadge');
  const labelSubtotal = document.getElementById('labelSummarySubtotal');
  const labelGrandTotal = document.getElementById('labelGrandTotalText');
  const lineTagihan = document.getElementById('lineTotalTagihan');
  const lineDppLain = document.getElementById('lineDppNilaiLain');
  const linePpn = document.getElementById('linePpn');
  const linePph = document.getElementById('linePph23');

  if (mode === 'NON_PAJAK') {
    if (btnPajak) btnPajak.classList.remove('active-pajak');
    if (btnNonPajak) btnNonPajak.classList.add('active-nonpajak');
    if (groupKode) groupKode.style.display = 'none';
    if (taxBox) taxBox.style.display = 'none';
    if (notice) notice.style.display = 'flex';
    if (summaryBadge) {
      summaryBadge.textContent = 'Nota Biasa (Non-Pajak)';
      summaryBadge.className = 'badge badge-green';
    }
    if (labelSubtotal) labelSubtotal.textContent = 'Subtotal (Total Belanja):';
    if (labelGrandTotal) labelGrandTotal.textContent = 'TOTAL PEMBAYARAN:';
    if (lineTagihan) lineTagihan.style.display = 'none';
    if (lineDppLain) lineDppLain.style.display = 'none';
    if (linePpn) linePpn.style.display = 'none';
    if (linePph) linePph.style.display = 'none';
  } else {
    if (btnPajak) btnPajak.classList.add('active-pajak');
    if (btnNonPajak) btnNonPajak.classList.remove('active-nonpajak');
    if (groupKode) groupKode.style.display = '';
    if (taxBox) taxBox.style.display = '';
    if (notice) notice.style.display = 'none';
    if (summaryBadge) {
      summaryBadge.textContent = 'Format Coretax Rekonsiliasi';
      summaryBadge.className = 'badge badge-coretax';
    }
    if (labelSubtotal) labelSubtotal.textContent = 'Subtotal (DPP):';
    if (labelGrandTotal) labelGrandTotal.textContent = 'TOTAL DITRANSFER / DIBAYARKAN:';
    if (lineTagihan) lineTagihan.style.display = '';
  }

  triggerRecalculate();
}

function setupEventListeners() {
  document.getElementById('btnAddItem').addEventListener('click', () => addItemRow());
    // Mode Transaksi: e-Faktur Coretax vs Nota Biasa
    const btnPajak = document.getElementById('btnModePajak');
    const btnNonPajak = document.getElementById('btnModeNonPajak');
    if (btnPajak) {
      btnPajak.addEventListener('click', () => setTransactionMode('PAJAK'));
    }
    if (btnNonPajak) {
      btnNonPajak.addEventListener('click', () => setTransactionMode('NON_PAJAK'));
    }


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
        if (cust.isNonPajak) {
          setTransactionMode('NON_PAJAK');
        } else {
          setTransactionMode('PAJAK');
        }
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
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.location.href = '/api/invoices/' + encodeURIComponent(savedInvoiceData.invoiceNo) + '/export-xml';
    } else {
      downloadInvoiceXml(savedInvoiceData.invoiceNo);
    }
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
  const isNonPajak = (currentTransactionMode === 'NON_PAJAK');
  const items = getItemsFromTable();
  const ppnRate = Number(document.getElementById('ppnRate').value || 12);
  const kodeTransaksi = document.getElementById('kodeTransaksi').value;
  const useDppNilaiLain = document.getElementById('chkDppNilaiLain').checked;
  const customDppNilaiLain = document.getElementById('customDppNilaiLain').value;
  const hasPph23 = document.getElementById('chkPph23').checked;
  const pph23Rate = Number(document.getElementById('pph23Rate').value || 2);

  const calcOptions = {
    isNonPajak,
    ppnRate: isNonPajak ? 0 : ppnRate,
    kodeTransaksi: isNonPajak ? '00' : kodeTransaksi,
    useDppNilaiLain: isNonPajak ? false : useDppNilaiLain,
    customDppNilaiLain: isNonPajak ? null : (customDppNilaiLain ? Number(customDppNilaiLain) : null),
    hasPph23: isNonPajak ? false : hasPph23,
    pph23Rate: isNonPajak ? 0 : pph23Rate
  };

  try {
    const res = await fetch('/api/invoices/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        options: calcOptions
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        currentTaxCalculation = data.data;
        renderTaxSummary(data.data);
        return;
      }
    }
  } catch (err) {
    console.log('Kalkulasi API offline, fallback client math');
  }

  const clientCalc = calculateClientSide(items, calcOptions);
  currentTaxCalculation = clientCalc;
  renderTaxSummary(clientCalc);
}

// Render RINGKASAN PEMBAYARAN Persis Analogi User
function renderTaxSummary(calc) {
  const rows = document.querySelectorAll('#itemsTableBody tr');
  calc.items.forEach((item, idx) => {
    if (rows[idx]) {
      rows[idx].querySelector('.subtotal-val').textContent = formatRupiah(item.total);
    }
  });

  const { summary, useDppNilaiLain, ppnRate, hasPph23, pph23Rate, isNonPajak } = calc;

  document.getElementById('summarySubtotalDpp').textContent = formatRupiah(summary.subtotalDpp);

  const lineDppLain = document.getElementById('lineDppNilaiLain');
  const labelPpn = document.getElementById('labelPpnText');
  const linePpn = document.getElementById('linePpn');
  const lineTotalTagihan = document.getElementById('lineTotalTagihan');
  const linePph = document.getElementById('linePph23');
  const labelPph = document.getElementById('labelPph23Text');

  if (isNonPajak) {
    if (lineDppLain) lineDppLain.style.display = 'none';
    if (linePpn) linePpn.style.display = 'none';
    if (lineTotalTagihan) lineTotalTagihan.style.display = 'none';
    if (linePph) linePph.style.display = 'none';
    document.getElementById('summaryTotalDitransfer').textContent = formatRupiah(summary.totalDitransfer);
    document.getElementById('terbilangDisplay').textContent = summary.terbilang;
    return;
  }

  // e-Faktur Coretax Mode
  if (lineTotalTagihan) lineTotalTagihan.style.display = '';

  if (useDppNilaiLain && summary.dppNilaiLain) {
    if (lineDppLain) lineDppLain.style.display = 'flex';
    document.getElementById('summaryDppNilaiLain').textContent = formatRupiah(summary.dppNilaiLain);
    if (labelPpn) labelPpn.textContent = `PPN (${ppnRate}% dari DPP Nilai Lain ${formatRupiah(summary.dppNilaiLain)}):`;
  } else {
    if (lineDppLain) lineDppLain.style.display = 'none';
    if (labelPpn) labelPpn.textContent = `PPN (${ppnRate}% dari DPP):`;
  }

  if (linePpn) linePpn.style.display = 'flex';
  document.getElementById('summaryPpn').textContent = formatRupiah(summary.totalPpn);
  document.getElementById('summaryTotalTagihan').textContent = formatRupiah(summary.totalTagihan);

  if (hasPph23 && summary.pph23Amount > 0) {
    if (linePph) linePph.style.display = 'flex';
    if (labelPph) labelPph.textContent = `Potongan PPh Pasal 23 (${pph23Rate}% x Subtotal) - dipotong PT:`;
    document.getElementById('summaryPph23').textContent = `(${formatRupiah(summary.pph23Amount)})`;
  } else {
    if (linePph) linePph.style.display = 'none';
  }

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

  const isNonPajak = (currentTransactionMode === 'NON_PAJAK');
    const payload = {
      invoiceNo,
      invoiceDate,
      isNonPajak,
      customer: {
        name: customerName,
        pic: customerPic,
        jabatan: customerJabatan,
        tipeWp,
        npwpOrNik: npwpOrNik || (isNonPajak ? '-' : '0000000000000000'),
        nitku: nitku || (isNonPajak ? '-' : '0000000000000000000000'),
        address: customerAddress,
        phone: customerPhone,
        email: customerEmail
      },
      items,
      options: {
        isNonPajak,
        ppnRate: isNonPajak ? 0 : ppnRate,
        kodeTransaksi: isNonPajak ? '00' : kodeTransaksi,
        useDppNilaiLain: isNonPajak ? false : useDppNilaiLain,
        customDppNilaiLain: isNonPajak ? null : (customDppNilaiLain ? Number(customDppNilaiLain) : null),
        hasPph23: isNonPajak ? false : hasPph23,
        pph23Rate: isNonPajak ? 0 : pph23Rate
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
    console.log('Save API offline, fallback localStorage save');
    const taxCalc = calculateClientSide(payload.items, payload.options);
    savedInvoiceData = {
      ...payload,
      taxCalculation: taxCalc,
      createdAt: new Date().toISOString()
    };
    let hist = [];
    try {
      const raw = localStorage.getItem('IBC_INVOICE_HISTORY');
      if (raw) hist = JSON.parse(raw);
    } catch(e) {}
    hist = hist.filter(i => i.invoiceNo !== savedInvoiceData.invoiceNo);
    hist.unshift(savedInvoiceData);
    localStorage.setItem('IBC_INVOICE_HISTORY', JSON.stringify(hist));
    document.getElementById('btnDownloadXml').disabled = false;
    alert(`✅ Nota ${invoiceNo} berhasil disimpan (Static Local Storage)!
Ringkasan Pembayaran & Nilai Coretax tervalidasi.
File XML Coretax sekarang dapat diunduh.`);
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

  const { summary, useDppNilaiLain, ppnRate, hasPph23, pph23Rate, isNonPajak } = currentTaxCalculation;

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

  // Tipe & Badge Dokumen
  const docMainTitle = document.getElementById('printDocMainTitle');
  const docBadge = document.getElementById('printDocBadge');
  if (isNonPajak) {
    if (docMainTitle) docMainTitle.textContent = 'NOTA PENJUALAN';
    if (docBadge) {
      docBadge.textContent = 'BUKTI TRANSAKSI & PEMBAYARAN (NON-PAJAK)';
      docBadge.className = 'doc-badge badge-green';
    }
  } else {
    if (docMainTitle) docMainTitle.textContent = 'NOTA PENJUALAN';
    if (docBadge) {
      docBadge.textContent = 'DOKUMEN TRANSAKSI & FAKTUR';
      docBadge.className = 'doc-badge';
    }
  }

  // Meta Nota
  document.getElementById('printInvNo').textContent = invoiceNo || '-';
  document.getElementById('printInvDate').textContent = invoiceDate || '-';
  document.getElementById('printInvStatus').textContent = paymentStatus || 'LUNAS';

  // Customer Card
  document.getElementById('printCustName').textContent = customerName || '-';

  // PIC Pembeli & Jabatan
  const picVal = document.getElementById('customerPic') ? document.getElementById('customerPic').value.trim() : '';
  const jabVal = document.getElementById('customerJabatan') ? document.getElementById('customerJabatan').value.trim() : '';
  const printCustPicRow = document.getElementById('printCustPicRow');
  const printCustPic = document.getElementById('printCustPic');
  if (picVal) {
    if (printCustPicRow) printCustPicRow.style.display = 'flex';
    if (printCustPic) printCustPic.textContent = picVal + (jabVal ? ` (${jabVal})` : '');
  } else {
    if (printCustPicRow) printCustPicRow.style.display = 'none';
  }

  document.getElementById('printCustAddress').textContent = customerAddress || '-';
  const cPhone = document.getElementById('customerPhone')?.value;
  const pPhone = document.getElementById('printCustPhone');
  if (pPhone) pPhone.textContent = cPhone || '-';

  // Tax identifiers di customer card
  const printCustNpwpRow = document.getElementById('printCustNpwpRow');
  const printCustNitkuRow = document.getElementById('printCustNitkuRow');
  if (isNonPajak && (!npwpOrNik || npwpOrNik === '-' || npwpOrNik === '0000000000000000')) {
    if (printCustNpwpRow) printCustNpwpRow.style.display = 'none';
    if (printCustNitkuRow) printCustNitkuRow.style.display = 'none';
  } else {
    if (printCustNpwpRow) {
      printCustNpwpRow.style.display = 'flex';
      document.getElementById('printCustNpwp').textContent = npwpOrNik || '-';
    }
    if (printCustNitkuRow) {
      printCustNitkuRow.style.display = 'flex';
      document.getElementById('printCustNitku').textContent = nitku || '-';
    }
  }

  document.getElementById('printNotes').textContent = notes || '-';
  document.getElementById('printTerbilang').textContent = summary.terbilang || '-';

  // Totals Table
  const printLabelSubtotal = document.getElementById('printLabelSubtotal');
  const printRowSubtotal = document.getElementById('printRowSubtotal');
  const printRowDppLain = document.getElementById('printRowDppLain');
  const printRowPpn = document.getElementById('printRowPpn');
  const printRowTagihan = document.getElementById('printRowTagihan');
  const printRowPph = document.getElementById('printRowPph23');
  const printLabelGrandTotal = document.getElementById('printLabelGrandTotal');

  if (isNonPajak) {
    if (printLabelSubtotal) printLabelSubtotal.textContent = 'Total Belanja / Subtotal';
    document.getElementById('printSubtotalDpp').textContent = formatRupiah(summary.subtotalDpp);
    if (printRowDppLain) printRowDppLain.style.display = 'none';
    if (printRowPpn) printRowPpn.style.display = 'none';
    if (printRowTagihan) printRowTagihan.style.display = 'none';
    if (printRowPph) printRowPph.style.display = 'none';
    if (printLabelGrandTotal) printLabelGrandTotal.innerHTML = '<strong>TOTAL PEMBAYARAN</strong>';
    document.getElementById('printTotalDitransfer').textContent = formatRupiah(summary.totalDitransfer);
  } else {
    if (printLabelSubtotal) printLabelSubtotal.textContent = 'Subtotal (DPP)';
    document.getElementById('printSubtotalDpp').textContent = formatRupiah(summary.subtotalDpp);
    if (useDppNilaiLain && summary.dppNilaiLain) {
      if (printRowDppLain) printRowDppLain.style.display = 'table-row';
      document.getElementById('printDppLain').textContent = formatRupiah(summary.dppNilaiLain);
      const printLabelPpn = document.getElementById('printLabelPpn');
      if (printLabelPpn) printLabelPpn.textContent = `PPN (${ppnRate}% dari DPP Nilai Lain ${formatRupiah(summary.dppNilaiLain)})`;
    } else {
      if (printRowDppLain) printRowDppLain.style.display = 'none';
      const printLabelPpn = document.getElementById('printLabelPpn');
      if (printLabelPpn) printLabelPpn.textContent = `PPN (${ppnRate}% dari DPP)`;
    }
    if (printRowPpn) printRowPpn.style.display = 'table-row';
    document.getElementById('printPpn').textContent = formatRupiah(summary.totalPpn);

    if (printRowTagihan) printRowTagihan.style.display = 'table-row';
    document.getElementById('printTotalTagihan').textContent = formatRupiah(summary.totalTagihan);

    if (hasPph23 && summary.pph23Amount > 0) {
      if (printRowPph) printRowPph.style.display = 'table-row';
      const printLabelPph = document.getElementById('printLabelPph23');
      if (printLabelPph) printLabelPph.textContent = `Potongan PPh Pasal 23 (${pph23Rate}% x ${formatRupiah(summary.subtotalDpp)}) - dipotong PT`;
      document.getElementById('printPph23').textContent = `(${formatRupiah(summary.pph23Amount)})`;
    } else {
      if (printRowPph) printRowPph.style.display = 'none';
    }
    if (printLabelGrandTotal) printLabelGrandTotal.innerHTML = '<strong>TOTAL DITRANSFER / DIBAYARKAN</strong>';
    document.getElementById('printTotalDitransfer').textContent = formatRupiah(summary.totalDitransfer);
  }

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

  // Tanda tangan
  const sigCust = document.getElementById('printSigCustomer');
  if (sigCust) sigCust.textContent = picVal ? picVal : (customerName || 'Pembeli');

  const sigCustSub = document.getElementById('printSigCustomerSub');
  if (sigCustSub) {
    if (picVal && customerName) {
      sigCustSub.textContent = (jabVal ? jabVal + ' - ' : '') + customerName;
    } else {
      sigCustSub.textContent = customerName || 'Pelanggan';
    }
  }

  const sigMgr = document.getElementById('printSigManager');
  if (sigMgr) sigMgr.textContent = sProfile.managerName || 'Djohan Hutagalung, S.Kom.';
  const sigTitle = document.getElementById('printSigTitle');
  if (sigTitle) sigTitle.textContent = sProfile.managerTitle || 'Manager CV. Istana Barcode Computer';

  document.getElementById('printModal').classList.add('show');
}

function closePrintModal() {
  document.getElementById('printModal').classList.remove('show');
}

async function loadInvoiceHistory() {
  let list = [];
  try {
    const res = await fetch('/api/invoices/list');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) list = data.data;
    }
  } catch (err) {
    console.log('Riwayat API offline, membaca riwayat lokal');
  }

  if (!list || list.length === 0) {
    const local = localStorage.getItem('IBC_INVOICE_HISTORY');
    if (local) {
      try { list = JSON.parse(local); } catch (e) {}
    }
  }

  if (!list || list.length === 0) {
    list = [...DEFAULT_STATIC_INVOICES];
  }

  invoiceHistoryList = list;
  const tbody = document.getElementById('invoiceListBody');
  tbody.innerHTML = '';

  if (!list || list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center" style="padding: 24px; color: #64748b;">Belum ada riwayat nota yang tersimpan.</td></tr>';
    return;
  }

  list.forEach(inv => {
    const summary = inv.taxCalculation?.summary || {};
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong class="input-mono">${inv.invoiceNo}</strong><br>${(inv.isNonPajak || inv.options?.isNonPajak || inv.taxCalculation?.isNonPajak) ? '<span class="badge-mini badge-green">Nota Biasa</span>' : '<span class="badge-mini badge-blue">Coretax</span>'}</td>
      <td>${inv.invoiceDate}</td>
      <td><strong>${inv.customer?.name || '-'}</strong>${inv.customer?.pic ? `<br><small style="color: #2563eb;">👤 Up: ${inv.customer.pic}</small>` : ''}</td>
      <td class="text-right">${formatRupiah(summary.subtotalDpp)}</td>
      <td class="text-right text-success">${formatRupiah(summary.totalPpn)}</td>
      <td class="text-right text-danger">${summary.pph23Amount ? '(' + formatRupiah(summary.pph23Amount) + ')' : '-'}</td>
      <td class="text-right"><strong>${formatRupiah(summary.totalDitransfer)}</strong></td>
              <td>
          <button class="btn btn-sm btn-secondary" title="Buka & Cetak Nota" onclick="viewHistoryInvoice('${encodeURIComponent(inv.invoiceNo)}')">
            🖨️ Cetak
          </button>
          <button class="btn btn-sm btn-success" title="Download XML Coretax" onclick="downloadInvoiceXml('${encodeURIComponent(inv.invoiceNo)}')">
            📥 XML
          </button>
        </td>
    `;
    tbody.appendChild(tr);
  });
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

  if (!name) {
    alert('Nama pembeli / perusahaan / rekanan wajib diisi!');
    return;
  }

  if (npwpOrNik && npwpOrNik.length === 16 && (!nitku || nitku.length < 22)) {
    nitku = npwpOrNik + '000000';
  }

  const generatedId = id || ('CUST-' + Date.now().toString().slice(-4));
  const payload = {
    id: generatedId,
    tipeWp,
    name,
    pic,
    jabatan,
    npwpOrNik: npwpOrNik || '-',
    nitku: nitku || '-',
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
    if (res.ok) {
      console.log('Saved customer to server');
    }
  } catch (err) {
    console.log('Customer API offline, fallback localStorage');
  }

  // Always update in-memory and localStorage
  let custs = [];
  try {
    const raw = localStorage.getItem('IBC_CUSTOMERS');
    if (raw) custs = JSON.parse(raw);
  } catch (e) {}
  if (!custs || custs.length === 0) custs = [...DEFAULT_STATIC_CUSTOMERS];

  const idx = custs.findIndex(c => c.id === payload.id);
  if (idx >= 0) {
    custs[idx] = payload;
  } else {
    custs.push(payload);
  }
  localStorage.setItem('IBC_CUSTOMERS', JSON.stringify(custs));
  sampleCustomers = custs;

  closeCustomerModal();
  await renderCustomerMasterTable();
  refreshCustomerDropdown();
  alert(`✅ Master Lawan Transaksi "${payload.name}" berhasil disimpan!`);
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
    if (res.ok) {
      console.log('Deleted product from server');
    }
  } catch (err) {
    console.log('Delete product API offline, deleting from localStorage');
  }

  let prods = [];
  try {
    const raw = localStorage.getItem('IBC_PRODUCTS');
    if (raw) prods = JSON.parse(raw);
  } catch (e) {}
  if (!prods || prods.length === 0) prods = [...catalogProducts];
  prods = prods.filter(p => p.sku !== sku);
  localStorage.setItem('IBC_PRODUCTS', JSON.stringify(prods));
  catalogProducts = prods;
  await renderProductMasterTable();
  refreshProductDropdown();
  alert(`✅ SKU ${sku} berhasil dihapus.`);
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
    kodeCoretax: kodeCoretax || (tipe === 'Jasa' ? '000000 - Jasa' : '45281001 - Barcode Scanner'),
    satuan: satuan || 'Unit',
    unitPrice: isNaN(unitPrice) ? 0 : unitPrice,
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
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        console.log('Saved product to server');
      }
    }
  } catch (err) {
    console.log('Products API offline, saving to localStorage');
  }

  // Always update in-memory and localStorage
  let prods = [];
  try {
    const raw = localStorage.getItem('IBC_PRODUCTS');
    if (raw) prods = JSON.parse(raw);
  } catch (e) {}
  if (!prods || prods.length === 0) prods = [...DEFAULT_STATIC_PRODUCTS];

  const idx = prods.findIndex(p => p.sku === payload.sku);
  if (idx >= 0) {
    prods[idx] = payload;
  } else {
    prods.push(payload);
  }
  localStorage.setItem('IBC_PRODUCTS', JSON.stringify(prods));
  catalogProducts = prods;

  closeProductModal();
  await renderProductMasterTable();
  refreshProductDropdown();
  alert(`✅ Master ${payload.tipe} "${payload.name}" berhasil disimpan!`);
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
    console.log('Seller profile API offline, fallback to localStorage');
    sellerProfileData = payload;
    localStorage.setItem('IBC_SELLER_PROFILE', JSON.stringify(payload));
    document.getElementById('sellerBadge').textContent = 'NPWP: ' + payload.npwp16;
    document.getElementById('invoiceNotes').value = defaultNotes;
    const feedback = document.getElementById('sellerSaveFeedback');
    if (feedback) {
      feedback.textContent = '✅ Profil toko tersimpan secara lokal (Browser Storage)!';
      setTimeout(() => { feedback.textContent = ''; }, 4000);
    }
    alert('✅ Profil toko berhasil diperbarui secara lokal!');
  }
}
