import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  /** 🔥 FIX: slug unique */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author: string; // display only

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /** 🔥 FIX: explicit foreign key */
  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.news, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  /** 🔥 AUDIT */
  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}