/**
 * xmlGenerator.js
 * Generator Dokumen XML e-Faktur Coretax DJP
 * CV. Istana Barcode Computer
 */

const { create } = require('xmlbuilder2');

const SELLER_PROFILE = {
  npwp16: '0328912340510000', // NPWP 16 Digit Resmi CV. Istana Barcode
  nitku: '0328912340510000000000', // NITKU 22 Digit
  name: 'CV. ISTANA BARCODE COMPUTER',
  address: 'Ruko Istana Barcode, Jl. Otomasi Kasir No. 88, Indonesia',
  email: 'tax@istanabarcode.com',
  phone: '0812-3456-7890'
};

function generateCoretaxXML(invoiceData) {
  const { invoiceNo, invoiceDate, customer, taxCalculation, seller = SELLER_PROFILE } = invoiceData;

  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('TaxInvoiceBulk', {
      xmlns: 'http://djp.pajak.go.id/coretax/efaktur/v1',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
    })
    .ele('TaxInvoice')
      // Header Informasi Faktur
      .ele('InvoiceHeader')
        .ele('InvoiceNumber').txt(invoiceNo).up()
        .ele('InvoiceDate').txt(invoiceDate).up()
        .ele('TransactionCode').txt(taxCalculation.kodeTransaksi || '01').up()
        .ele('TaxPeriod').txt(invoiceDate.substring(5, 7)).up()
        .ele('TaxYear').txt(invoiceDate.substring(0, 4)).up()
        .ele('ReferenceDocNumber').txt(invoiceNo).up()
        .ele('Currency').txt('IDR').up()
      .up()

      // Identitas Penjual
      .ele('Seller')
        .ele('Tin16').txt(seller.npwp16).up()
        .ele('Nitku').txt(seller.nitku).up()
        .ele('Name').txt(seller.name).up()
        .ele('Address').txt(seller.address).up()
        .ele('Email').txt(seller.email).up()
        .ele('Phone').txt(seller.phone).up()
      .up()

      // Identitas Pembeli
      .ele('Buyer')
        .ele('Tin16').txt(customer.npwpOrNik).up()
        .ele('Nitku').txt(customer.nitku).up()
        .ele('Name').txt(customer.name).up()
        .ele('Address').txt(customer.address || '-').up()
        .ele('Email').txt(customer.email || '-').up()
        .ele('Phone').txt(customer.phone || '-').up()
        .ele('CustomerType').txt(customer.tipeWp || 'BADAN').up()
      .up()

      // Daftar Barang / Jasa
      .ele('GoodsServicesList');

  taxCalculation.items.forEach((item) => {
    doc.ele('GoodService')
      .ele('ItemSequence').txt(String(item.urutan)).up()
      .ele('ItemCode').txt(item.sku).up()
      .ele('ItemDescription').txt(item.name).up()
      .ele('ItemCategory').txt(item.kategori).up()
      .ele('Quantity').txt(String(item.qty)).up()
      .ele('UnitPrice').txt(String(item.unitPrice)).up()
      .ele('Discount').txt(String(item.discount)).up()
      .ele('TotalAmount').txt(String(item.total)).up()
    .up();
  });

  // Ringkasan Pajak Coretax
  doc.up()
    .ele('TaxSummary')
      .ele('SubtotalBaseAmount').txt(String(taxCalculation.summary.subtotalDpp)).up()
      .ele('TaxBaseDpp').txt(String(taxCalculation.summary.totalDpp)).up()
      .ele('IsOtherTaxBase').txt(taxCalculation.useDppNilaiLain ? 'true' : 'false').up()
      .ele('VatRate').txt(String(taxCalculation.ppnRate)).up()
      .ele('TotalVatPpn').txt(String(taxCalculation.summary.totalPpn)).up()
      .ele('InvoiceGrandTotal').txt(String(taxCalculation.summary.totalTagihan)).up()
      .ele('WithholdingIncomeTax23').txt(String(taxCalculation.summary.pph23Amount)).up()
      .ele('NetPayableTransferred').txt(String(taxCalculation.summary.totalDitransfer)).up()
      .ele('AmountInWords').txt(taxCalculation.summary.terbilang).up()
    .up()
  .up();

  return doc.end({ prettyPrint: true });
}

module.exports = {
  SELLER_PROFILE,
  generateCoretaxXML
};
