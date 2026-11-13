/**
 * server.js
 * Server Aplikasi e-Faktur Coretax CV. Istana Barcode Computer
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/invoices', invoiceRoutes);

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('exit', (code) => {
  console.log(`[INFO] Server process exiting with code: ${code}`);
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  e-Faktur Coretax System - CV. Istana Barcode Computer`);
    console.log(`  Aplikasi berjalan di: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    console.error('[FATAL] Server socket error:', err);
  });
}

module.exports = app;
