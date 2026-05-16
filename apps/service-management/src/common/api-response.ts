export interface ApiResponse<T = unknown> {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: T | null;
}

export interface GuruResponse {
  id: string;
  namaLengkap: string;
  nip: string;
  noTelepon: string;
  anakWali: string;
  mataPelajaran: string;
  alamat: string;
  jabatan: string;
}

export interface GuruListResponse {
  guru: GuruResponse[];
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface SiswaResponse {
  id: string;
  namaLengkap: string;
  jurusan: string;
  nisn: string;
  nis: string;
  kelas: string;
  tanggalLahir: string;
  alamat: string;
  noWaOrtu: string;
  status: string;
  raporFile: string | null;
  sklFile: string | null;
  ijazahFile: string | null;
}

export interface SiswaListResponse {
  siswa: SiswaResponse[];
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ErrorResponse {
  status: 'fail' | 'error';
  message: string;
  data: string | null;
}