/**
 * masterStore.js
 * Penyimpanan Data Master & Profil Penjual (CV. Istana Barcode Computer)
 */

const fs = require('fs');
const path = require('path');
const { SAMPLE_CUSTOMERS, SAMPLE_PRODUCTS } = require('../core/sampleData');
const { SELLER_PROFILE } = require('../core/xmlGenerator');

const DATA_DIR = path.join(__dirname, '../../data');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SELLER_FILE = path.join(DATA_DIR, 'seller.json');

const DEFAULT_SELLER = {
  ...SELLER_PROFILE,
  bankName: 'Bank BCA',
  bankAccount: '123-456-7890',
  bankAccountName: 'CV. Istana Barcode Computer',
  defaultNotes: `1. Pembayaran ditransfer ke rekening: Bank BCA 123-456-7890 a.n CV. Istana Barcode Computer.
2. Bukti potong PPh Pasal 23 (e-Bupot Unifikasi) mohon diemail ke tax@istanabarcode.com.
3. Garansi sistem barcode 1 tahun service.`
};

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CUSTOMERS_FILE)) {
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(SAMPLE_CUSTOMERS, null, 2), 'utf-8');
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(SAMPLE_PRODUCTS, null, 2), 'utf-8');
  }
  if (!fs.existsSync(SELLER_FILE)) {
    fs.writeFileSync(SELLER_FILE, JSON.stringify(DEFAULT_SELLER, null, 2), 'utf-8');
  }
}

// --- PROFIL PENJUAL (CV. ISTANA BARCODE COMPUTER) ---

function getSellerProfile() {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(SELLER_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_SELLER;
  }
}

function saveSellerProfile(profile) {
  ensureDataFiles();
  const current = getSellerProfile();
  const updated = { ...current, ...profile, updatedAt: new Date().toISOString() };
  fs.writeFileSync(SELLER_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// --- MASTER LAWAN TRANSAKSI (CUSTOMERS) ---

function getCustomers() {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return SAMPLE_CUSTOMERS;
  }
}

function saveCustomer(customer) {
  ensureDataFiles();
  const list = getCustomers();
  const existingIdx = list.findIndex(c => c.id === customer.id);

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...customer, updatedAt: new Date().toISOString() };
  } else {
    const newId = customer.id || `CUST-${String(list.length + 1).padStart(3, '0')}`;
    list.push({
      ...customer,
      id: newId,
      createdAt: new Date().toISOString()
    });
  }

  fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return customer;
}

function deleteCustomer(id) {
  ensureDataFiles();
  let list = getCustomers();
  list = list.filter(c => c.id !== id);
  fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return true;
}

// --- MASTER BARANG & JASA ---

function getProducts() {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return SAMPLE_PRODUCTS;
  }
}

function saveProduct(product) {
  ensureDataFiles();
  const list = getProducts();
  const existingIdx = list.findIndex(p => p.sku === product.sku);

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...product, updatedAt: new Date().toISOString() };
  } else {
    list.push({
      ...product,
      createdAt: new Date().toISOString()
    });
  }

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return product;
}

function deleteProduct(sku) {
  ensureDataFiles();
  let list = getProducts();
  list = list.filter(p => p.sku !== sku);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return true;
}

module.exports = {
  getSellerProfile,
  saveSellerProfile,
  getCustomers,
  saveCustomer,
  deleteCustomer,
  getProducts,
  saveProduct,
  deleteProduct
};
