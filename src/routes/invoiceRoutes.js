/**
 * invoiceRoutes.js
 * Endpoints API untuk nota, CRUD master lawan transaksi, dan master barang/jasa
 */

const express = require('express');
const router = express.Router();
const { calculateInvoice } = require('../core/taxCalculator');
const { validateCustomerData } = require('../core/validator');
const { generateCoretaxXML, SELLER_PROFILE } = require('../core/xmlGenerator');
const masterStore = require('../models/masterStore');
const invoiceStore = require('../models/invoiceStore');

// Profil Penjual CV. Istana Barcode Computer
router.get('/seller-profile', (req, res) => {
  const profile = masterStore.getSellerProfile();
  res.json({ success: true, data: profile });
});

router.post('/seller-profile', (req, res) => {
  const updated = masterStore.saveSellerProfile(req.body);
  res.json({ success: true, message: 'Profil penjual & rekening berhasil diperbarui', data: updated });
});

// --- MASTER LAWAN TRANSAKSI (CUSTOMERS) ---

router.get('/customers', (req, res) => {
  const customers = masterStore.getCustomers();
  res.json({ success: true, data: customers });
});

router.post('/customers', (req, res) => {
  const customer = req.body;
  if (!customer.name || !customer.npwpOrNik) {
    return res.status(400).json({ success: false, message: 'Nama dan NPWP 16/NIK wajib diisi!' });
  }
  const saved = masterStore.saveCustomer(customer);
  res.json({ success: true, message: 'Master Lawan Transaksi berhasil disimpan', data: saved });
});

router.delete('/customers/:id', (req, res) => {
  masterStore.deleteCustomer(req.params.id);
  res.json({ success: true, message: 'Master Lawan Transaksi berhasil dihapus' });
});

// --- MASTER BARANG & JASA (PRODUCTS & SERVICES) ---

router.get('/products', (req, res) => {
  const products = masterStore.getProducts();
  res.json({ success: true, data: products });
});

router.post('/products', (req, res) => {
  const product = req.body;
  if (!product.sku || !product.name) {
    return res.status(400).json({ success: false, message: 'Kode SKU dan Nama Barang/Jasa wajib diisi!' });
  }
  const saved = masterStore.saveProduct(product);
  res.json({ success: true, message: 'Master Barang/Jasa berhasil disimpan', data: saved });
});

router.delete('/products/:sku', (req, res) => {
  masterStore.deleteProduct(req.params.sku);
  res.json({ success: true, message: 'Master Barang/Jasa berhasil dihapus' });
});

// --- KALKULASI & NOTA PENJUALAN ---

router.post('/calculate', (req, res) => {
  const { items, options } = req.body;
  const result = calculateInvoice(items, options);
  res.json({ success: true, data: result });
});

router.post('/save', (req, res) => {
  const { invoiceNo, invoiceDate, customer, items, options } = req.body;
  const isNonPajak = Boolean(options?.isNonPajak);

  const validation = validateCustomerData(customer, isNonPajak);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  const taxCalculation = calculateInvoice(items, options);

  const invoiceRecord = {
    invoiceNo: invoiceNo || `INV-IBC-${Date.now().toString().slice(-6)}`,
    invoiceDate: invoiceDate || new Date().toISOString().split('T')[0],
    isNonPajak,
    customer: validation.sanitized,
    options: options || {},
    items,
    taxCalculation,
    seller: SELLER_PROFILE,
    status: 'ACTIVE'
  };

  invoiceStore.saveInvoice(invoiceRecord);
  res.json({ success: true, message: 'Nota berhasil disimpan', data: invoiceRecord });
});

router.get('/list', (req, res) => {
  const invoices = invoiceStore.getAllInvoices();
  res.json({ success: true, data: invoices });
});

router.get('/:id', (req, res) => {
  const invoice = invoiceStore.getInvoiceById(req.params.id);
  if (!invoice) {
    return res.status(404).json({ success: false, message: 'Nota tidak ditemukan' });
  }
  res.json({ success: true, data: invoice });
});

router.delete('/:id', (req, res) => {
  invoiceStore.deleteInvoice(req.params.id);
  res.json({ success: true, message: 'Nota berhasil dihapus' });
});

router.get('/:id/export-xml', (req, res) => {
  const invoice = invoiceStore.getInvoiceById(req.params.id);
  if (!invoice) {
    return res.status(404).send('Nota tidak ditemukan');
  }

  try {
    const xml = generateCoretaxXML(invoice);
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="eFaktur_Coretax_${invoice.invoiceNo.replace(/\//g, '_')}.xml"`);
    res.send(xml);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
