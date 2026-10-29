/**
 * taxCalculator.test.js
 * Verifikasi perhitungan pajak & ringkasan pembayaran sesuai analogi user
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateInvoice, terbilangRupiah } = require('../src/core/taxCalculator');
const { normalizeNITKU } = require('../src/core/validator');

test('Perhitungan Persis Sesuai Analogi User (DPP Nilai Lain + PPN 12% + PPh 23 2%)', () => {
  // Simulasi jasa/barang dengan Subtotal DPP = 75.000.000
  const items = [
    {
      sku: 'SRV-001',
      name: 'Pengadaan & Jasa Sistem Otomasi Kasir Barcode',
      qty: 1,
      unitPrice: 75000000,
      discount: 0
    }
  ];

  const result = calculateInvoice(items, {
    ppnRate: 12,
    kodeTransaksi: '04',
    useDppNilaiLain: true,
    customDppNilaiLain: 68750000, // Rp 68.750.000,00
    hasPph23: true,
    pph23Rate: 2
  });

  const { summary } = result;

  // 1. Subtotal (DPP): Rp75.000.000,00
  assert.equal(summary.subtotalDpp, 75000000);

  // 2. DPP Nilai Lain: Rp68.750.000,00
  assert.equal(summary.dppNilaiLain, 68750000);

  // 3. PPN 12% dari DPP Nilai Lain: Rp8.250.000,00
  assert.equal(summary.totalPpn, 8250000);

  // 4. Total Tagihan: Rp75.000.000 + Rp8.250.000 = Rp83.250.000,00
  assert.equal(summary.totalTagihan, 83250000);

  // 5. Potongan PPh 23 (2% x Rp75.000.000): Rp1.500.000,00
  assert.equal(summary.pph23Amount, 1500000);

  // 6. Total Ditransfer / Dibayarkan: Rp81.750.000,00
  assert.equal(summary.totalDitransfer, 81750000);
});

test('Perhitungan Otomatis Proporsi DPP Nilai Lain (11/12) jika custom nominal tidak diisi', () => {
  const items = [
    { sku: 'SRV-002', name: 'Jasa Maintenance', qty: 1, unitPrice: 75000000, discount: 0 }
  ];

  const result = calculateInvoice(items, {
    ppnRate: 12,
    kodeTransaksi: '04',
    useDppNilaiLain: true,
    // tidak memasukkan customDppNilaiLain, sistem hitung otomatis 75.000.000 * 11/12 = 68.750.000
    hasPph23: true,
    pph23Rate: 2
  });

  assert.equal(result.summary.dppNilaiLain, 68750000);
  assert.equal(result.summary.totalPpn, 8250000);
  assert.equal(result.summary.totalDitransfer, 81750000);
});

test('Normalisasi NITKU 22 Digit Coretax', () => {
  const npwp16 = '0123456789012345';
  const nitkuDefault = normalizeNITKU('', npwp16);
  assert.equal(nitkuDefault, '0123456789012345000000');
});
