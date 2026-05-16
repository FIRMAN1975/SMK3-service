import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PortofolioStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
}

@Entity({ name: 'portofolio' })
export class PortofolioEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'owner_user_id', length: 255 })
  ownerUserId!: string;

  @Column({ name: 'owner_username', length: 255 })
  ownerUsername!: string;

  @Column({ name: 'file_path', length: 255, nullable: true })
  filePath!: string | null;

  @Column({ name: 'file_name', length: 255, nullable: true })
  fileName!: string | null;

  @Column({ type: 'enum', enum: PortofolioStatus, default: PortofolioStatus.DRAFT })
  status!: PortofolioStatus;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason!: string | null;

  @Column({ name: 'reviewed_by', length: 255, nullable: true })
  reviewedBy!: string | null;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
