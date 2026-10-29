/**
 * invoiceStore.js
 * Penyimpanan Nota & Faktur Pajak (File-based JSON storage)
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'invoices.json');

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function getAllInvoices() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Gagal membaca database invoice:', err);
    return [];
  }
}

function getInvoiceById(id) {
  const list = getAllInvoices();
  return list.find(inv => inv.id === id || inv.invoiceNo === id);
}

function saveInvoice(invoice) {
  ensureStorage();
  const list = getAllInvoices();
  const existingIdx = list.findIndex(inv => inv.id === invoice.id || inv.invoiceNo === invoice.invoiceNo);

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...invoice, updatedAt: new Date().toISOString() };
  } else {
    list.unshift({
      ...invoice,
      id: invoice.id || `INV-${Date.now()}`,
      createdAt: new Date().toISOString()
    });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return invoice;
}

function deleteInvoice(id) {
  ensureStorage();
  let list = getAllInvoices();
  list = list.filter(inv => inv.id !== id && inv.invoiceNo !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return true;
}

module.exports = {
  getAllInvoices,
  getInvoiceById,
  saveInvoice,
  deleteInvoice
};
