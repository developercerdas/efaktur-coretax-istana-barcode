# efaktur-coretax-istana-barcode
Sistem Pembuatan Nota Penjualan & Generator e-Faktur Coretax DJP untuk **CV. Istana Barcode Computer**.

Aplikasi ini dirancang khusus untuk mempermudah operasional kasir/administrasi CV. Istana Barcode Computer dalam menerbitkan **Nota Penjualan / Invoice B2B** sekaligus secara otomatis menghitung nilai pajak (DPP, PPN 12% dari DPP Nilai Lain, Potongan PPh Pasal 23 oleh PT Rekanan) sesuai aturan **Coretax DJP** dan menghasilkan dokumen **XML e-Faktur Coretax** siap lapor/impor ke portal DJP.

---

## 💡 Contoh & Formula Perhitungan (Sesuai Analogi Bisnis)

Berikut adalah contoh riil rekonsiliasi pembayaran untuk pengadaan/jasa sistem kasir barcode dengan rekanan PT:

```
========================================================================
RINGKASAN PEMBAYARAN
========================================================================
Subtotal (DPP)                                : Rp 75.000.000,00
DPP Nilai Lain (Dasar PPN)                    : Rp 68.750.000,00  (Rasio 11/12)
PPN (12% dari DPP Nilai Lain Rp68.750.000,00) : Rp  8.250.000,00
------------------------------------------------------------------------
Total Tagihan                                 : Rp 83.250.000,00
Potongan PPh Pasal 23 (2% x Rp75.000.000,00)  : (Rp 1.500.000,00) - dipotong PT
------------------------------------------------------------------------
TOTAL DITRANSFER / DIBAYARKAN                 : Rp 81.750.000,00
========================================================================
```

### Penjelasan Logika Perpajakan:
1. **Subtotal (DPP Dasar):** Nilai komersial penyerahan barang/jasa sebelum pajak.
2. **DPP Nilai Lain (Kode Transaksi 04 Coretax):** Dihitung otomatis berbasis proporsi $\frac{11}{12} \times \text{Subtotal}$ (atau nominal kustom yang ditentukan).
3. **PPN 12%:** Dihitung dari DPP Nilai Lain: $12\% \times \text{Rp } 68.750.000,00 = \text{Rp } 8.250.000,00$.
4. **Total Tagihan (Invoice Total):** $\text{Subtotal} + \text{PPN} = \text{Rp } 83.250.000,00$.
5. **Potongan PPh 23:** Pemotongan oleh PT pembeli sebesar $2\%$ dari Subtotal jasa ($\text{Rp } 1.500.000,00$).
6. **Total Ditransfer / Net Payable:** Dana riil yang masuk ke rekening CV. Istana Barcode Computer ($\text{Rp } 81.750.000,00$). Selisih $\text{Rp } 1.500.000,00$ diselesaikan dengan Bukti Potong PPh 23 (e-Bupot Unifikasi) dari PT pembeli.

---

## 🌟 Fitur Utama

1. **Format Identitas Sesuai Coretax DJP:**
   - Mendukung **NPWP 16 Digit** untuk Badan Usaha / PT / CV.
   - Mendukung **NIK 16 Digit** untuk pembeli Orang Pribadi / Toko Kecil.
   - Mendukung **NITKU 22 Digit** (Nomor Identitas Tempat Kegiatan Usaha) untuk cabang pelanggan.

2. **Perhitungan Pajak Coretax Presisi:**
   - Mendukung **DPP Normal** dan **DPP Nilai Lain (Kode 04)**.
   - Pilihan tarif PPN 11% / 12%.
   - Withholding Tax (Potongan PPh 23 sebesar 2% oleh rekanan PT).
   - Pembulatan nominal desimal rupiah presisi.
   - Terbilang otomatis dalam bahasa Indonesia.

3. **Katalog Produk Barcode Bawaan:**
   - Barcode Scanner 1D/2D (Honeywell, Zebra, Iware).
   - Printer Barcode & Label Thermal (TSC, Zebra, Xprinter).
   - Printer Kasir Struk Thermal 80mm & 58mm (Epson, Iware).
   - Consumables: Ribbon Wax/Wax-Resin, Kertas Roll Thermal, Label Stiker Semicoat.
   - Jasa Setting, Training & Instalasi POS.

4. **Output Ganda:**
   - **Cetak Nota Kasir / Faktur Penjualan:** Desain bersih, siap cetak langsung ke printer A4 maupun printer thermal kasir (Support Print / Save to PDF).
   - **Export XML Coretax DJP:** Dokumen XML terstruktur sesuai skema Faktur Pajak Keluaran Coretax DJP untuk diunggah langsung ke portal Coretax.

5. **Penyimpanan Nota:**
   - Riwayat nota penjualan tersimpan otomatis dan dapat diekspor kapan saja.

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- npm (bawaan Node.js)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server
```bash
npm start
```
Buka peramban (browser) di alamat:
```
http://localhost:3000
```

### 4. Menjalankan Unit Tests (Verifikasi Perhitungan Pajak)
```bash
npm test
```

---

## 📂 Struktur Proyek

```
efaktur-coretax-istanabarcode/
├── src/
│   ├── core/
│   │   ├── taxCalculator.js    # Rumus perhitungan DPP Nilai Lain, PPN 12%, & PPh 23
│   │   ├── validator.js        # Validasi NPWP 16, NIK, dan NITKU 22 digit
│   │   ├── xmlGenerator.js     # Pembuat dokumen XML e-Faktur Coretax
│   │   └── sampleData.js       # Katalog master produk CV. Istana Barcode
│   ├── models/
│   │   └── invoiceStore.js     # Penyimpanan data nota lokal
│   ├── routes/
│   │   └── invoiceRoutes.js    # API endpoints
│   ├── public/                 # Tampilan Web & Antarmuka Nota
│   │   ├── index.html          # Form Nota & Pratinjau Cetak
│   │   ├── app.js              # Interaksi realtime
│   │   └── style.css           # Styling modern & layout cetak
│   └── server.js               # Entry point Express
├── tests/
│   └── taxCalculator.test.js   # Unit test verifikasi analogi rumus
├── package.json
└── README.md
```

---

## 📤 Cara Upload ke GitHub

Jalankan perintah berikut di folder proyek ini:

```bash
git init
git add .
git commit -m "feat: inisialisasi aplikasi nota & efaktur coretax istana barcode"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/efaktur-coretax-istana-barcode.git
git push -u origin main
```

---

## 📜 Lisensi
MIT License - Dibuat untuk **CV. Istana Barcode Computer**.
