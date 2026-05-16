DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'surat_status') THEN
    CREATE TYPE surat_status AS ENUM (
      'draft',
      'terbit',
      'dikirim',
      'selesai',
      'dibatalkan'
    );
  END IF;
END $$;

ALTER TABLE t_surat_panggilan
  ADD COLUMN IF NOT EXISTS status surat_status NOT NULL DEFAULT 'terbit',
  ADD COLUMN IF NOT EXISTS created_by VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255) NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_t_surat_panggilan_no_surat
  ON t_surat_panggilan(no_surat);

CREATE INDEX IF NOT EXISTS idx_t_surat_panggilan_status
  ON t_surat_panggilan(status);
