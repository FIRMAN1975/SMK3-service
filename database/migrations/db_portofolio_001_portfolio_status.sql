DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'portfolio_status') THEN
    CREATE TYPE portfolio_status AS ENUM (
      'draft',
      'pending_review',
      'published',
      'rejected'
    );
  END IF;
END $$;

ALTER TABLE portofolios
  ADD COLUMN IF NOT EXISTS status portfolio_status NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT NULL,
  ADD COLUMN IF NOT EXISTS "reviewedBy" VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP NULL;

CREATE INDEX IF NOT EXISTS idx_portofolios_status ON portofolios(status);
CREATE INDEX IF NOT EXISTS idx_portofolios_owner_user_id ON portofolios("ownerUserId");
