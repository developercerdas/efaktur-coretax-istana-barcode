/**
 * taxCalculator.js
 * Modul Perhitungan Pajak Coretax DJP & Rekonsiliasi Nota Pembayaran
 * untuk CV. Istana Barcode Computer.
 * 
 * Mendukung:
 * - DPP Normal & DPP Nilai Lain (Kode Transaksi 04)
 * - PPN 11% / 12%
 * - Potongan PPh Pasal 23 (2%) / PPh 22 / Withholding Tax oleh PT
 * - Kalkulasi Total Tagihan & Total Ditransfer / Dibayarkan
 */

function terbilangRupiah(nominal) {
  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];
  const angka = Math.floor(Math.abs(nominal));

  if (angka < 12) {
    return bilangan[angka];
  } else if (angka < 20) {
    return terbilangRupiah(angka - 10) + ' Belas';
  } else if (angka < 100) {
    return terbilangRupiah(Math.floor(angka / 10)) + ' Puluh ' + terbilangRupiah(angka % 10);
  } else if (angka < 200) {
    return 'Seratus ' + terbilangRupiah(angka - 100);
  } else if (angka < 1000) {
    return terbilangRupiah(Math.floor(angka / 100)) + ' Ratus ' + terbilangRupiah(angka % 100);
  } else if (angka < 2000) {
    return 'Seribu ' + terbilangRupiah(angka - 1000);
  } else if (angka < 1000000) {
    return terbilangRupiah(Math.floor(angka / 1000)) + ' Ribu ' + terbilangRupiah(angka % 1000);
  } else if (angka < 1000000000) {
    return terbilangRupiah(Math.floor(angka / 1000000)) + ' Juta ' + terbilangRupiah(angka % 1000000);
  } else if (angka < 1000000000000) {
    return terbilangRupiah(Math.floor(angka / 1000000000)) + ' Miliar ' + terbilangRupiah(angka % 1000000000);
  } else {
    return terbilangRupiah(Math.floor(angka / 1000000000000)) + ' Triliun ' + terbilangRupiah(angka % 1000000000000);
  }
}

/**
 * Menghitung detail nilai per item dan kalkulasi total nota/faktur
 * 
 * @param {Array} items - Daftar barang [{ name, sku, qty, unitPrice, discount }]
 * @param {Object} options - {
 *    ppnRate: 11 | 12,
 *    isPpnIncluded: false,
 *    kodeTransaksi: '01' | '04',
 *    useDppNilaiLain: boolean,
 *    customDppNilaiLain: number | null,
 *    hasPph23: boolean,
 *    pph23Rate: number (default 2)
 * }
 */
function calculateInvoice(items = [], options = {}) {
  const ppnRate = Number(options.ppnRate ?? 12);
  const isPpnIncluded = Boolean(options.isPpnIncluded ?? false);
  const kodeTransaksi = options.kodeTransaksi || '01';
  const useDppNilaiLain = Boolean(options.useDppNilaiLain || kodeTransaksi === '04');
  const hasPph23 = Boolean(options.hasPph23 ?? false);
  const pph23Rate = Number(options.pph23Rate ?? 2);

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
      sku: item.sku || `ITEM-${index + 1}`,
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

  // Subtotal (Dasar Tagihan sebelum PPN)
  const subtotalDppDasar = Math.max(0, totalBruto - totalDiskon);

  // Penentuan DPP untuk perhitungan PPN Coretax:
  // Jika menggunakan DPP Nilai Lain (Kode 04):
  // Bisa menggunakan input nominal langsung atau rasio formula (misal 11/12)
  let dppPajak = subtotalDppDasar;
  if (useDppNilaiLain) {
    if (options.customDppNilaiLain && Number(options.customDppNilaiLain) > 0) {
      dppPajak = Number(options.customDppNilaiLain);
    } else {
      // Default rasio DPP Nilai Lain penyesuaian tarif efektif: 11/12
      dppPajak = Math.round(subtotalDppDasar * (11 / 12));
    }
  } else if (isPpnIncluded) {
    dppPajak = Math.round(subtotalDppDasar / (1 + (ppnRate / 100)));
  }

  // PPN Terutang dihitung dari DPP Pajak (DPP Nilai Lain jika aktif)
  const totalPpn = isPpnIncluded && !useDppNilaiLain
    ? subtotalDppDasar - dppPajak
    : Math.round(dppPajak * (ppnRate / 100));

  // Total Tagihan (Invoice Total): Subtotal DPP + PPN
  const totalTagihan = subtotalDppDasar + totalPpn;

  // Potongan PPh Pasal 23 (Dipotong oleh PT pembeli)
  let pph23Amount = 0;
  if (hasPph23) {
    // PPh 23 dihitung dari Subtotal Jasa / DPP Dasar
    pph23Amount = Math.round(subtotalDppDasar * (pph23Rate / 100));
  }

  // Total Ditransfer / Dibayarkan oleh Pelanggan (Net Cash Settlement)
  const totalDitransfer = totalTagihan - pph23Amount;

  const nominalTerbilang = terbilangRupiah(totalDitransfer).trim() + ' Rupiah';

  return {
    kodeTransaksi,
    ppnRate,
    isPpnIncluded,
    useDppNilaiLain,
    hasPph23,
    pph23Rate,
    items: processedItems,
    summary: {
      totalBruto,
      totalDiskon,
      subtotalDpp: subtotalDppDasar,
      dppNilaiLain: useDppNilaiLain ? dppPajak : null,
      totalDpp: dppPajak,
      totalPpn,
      totalTagihan,
      pph23Rate,
      pph23Amount,
      totalDitransfer,
      terbilang: nominalTerbilang
    }
  };
}

module.exports = {
  calculateInvoice,
  terbilangRupiah
};
