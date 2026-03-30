// libs/common/src/utils/toolsUtil.ts
import fs from "fs";
import path from "path";

/**
 * Memastikan direktori sebuah file ada, jika tidak maka dibuat.
 */
export const ensureDirectoryExistence = async (filePath: string): Promise<void> => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

/**
 * Mendapatkan timestamp untuk penamaan file backup.
 */
export const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, "-");
};

/**
 * Format Tanggal Indonesia (Contoh: 21 Januari 2026)
 * Sangat berguna untuk isi Surat Panggilan.
 */
export const formatTanggalIndo = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Normalize file path dari multer agar bisa diakses browser.
 * Windows menyimpan path dengan backslash: uploads\folder\file.png
 * Browser butuh forward slash:             uploads/folder/file.png
 */
export const normalizePath = (filePath: string): string => {
  return filePath.replace(/\\/g, '/');
};