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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  e-Faktur Coretax System - CV. Istana Barcode Computer`);
    console.log(`  Aplikasi berjalan di: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
