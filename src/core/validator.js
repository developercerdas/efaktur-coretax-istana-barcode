/**
 * validator.js
 * Validasi Format Identitas Pajak Coretax DJP (NPWP 16, NIK 16, NITKU 22)
 */

function sanitizeDigits(val) {
  if (!val) return '';
  return String(val).replace(/\D/g, '');
}

/**
 * Validasi NPWP 16 Digit (Badan Usaha / OP Pasca Coretax)
 */
function isValidNPWP16(npwp) {
  const clean = sanitizeDigits(npwp);
  return clean.length === 16;
}

/**
 * Validasi NIK 16 Digit (Orang Pribadi Non-PKP / Ritel)
 */
function isValidNIK(nik) {
  const clean = sanitizeDigits(nik);
  return clean.length === 16;
}

/**
 * Memastikan format NITKU 22 digit sesuai standar Coretax DJP.
 * Jika tidak diisi secara spesifik oleh cabang, di-generate dari NPWP16 + 6 digit '000000'.
 */
function normalizeNITKU(nitku, npwp16) {
  const cleanNitku = sanitizeDigits(nitku);
  if (cleanNitku.length === 22) {
    return cleanNitku;
  }
  const cleanNpwp = sanitizeDigits(npwp16);
  if (cleanNpwp.length === 16) {
    return cleanNpwp + '000000'; // Default pusat / cabang utama
  }
  return '0000000000000000000000';
}

/**
 * Validasi keseluruhan input Nota / Faktur Pajak Coretax
 */
function validateCustomerData(customer = {}) {
  const errors = [];
  const cleanId = sanitizeDigits(customer.npwpOrNik);

  if (!customer.name || customer.name.trim().length === 0) {
    errors.push('Nama pembeli / perusahaan wajib diisi.');
  }

  const isBadan = customer.tipeWp === 'BADAN';
  if (isBadan) {
    if (cleanId.length !== 16) {
      errors.push('NPWP Badan untuk Coretax wajib 16 digit angka.');
    }
  } else {
    // Orang pribadi / Umum
    if (cleanId && cleanId.length !== 16 && cleanId !== '0000000000000000') {
      errors.push('Identitas pembeli (NPWP 16 / NIK) harus 16 digit angka.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      ...customer,
      npwpOrNik: cleanId || '0000000000000000',
      nitku: normalizeNITKU(customer.nitku, cleanId)
    }
  };
}

module.exports = {
  sanitizeDigits,
  isValidNPWP16,
  isValidNIK,
  normalizeNITKU,
  validateCustomerData
};
