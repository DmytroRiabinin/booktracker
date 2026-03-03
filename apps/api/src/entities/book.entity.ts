import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ReadingStatus } from './reading-status.entity';
import { Review } from './review.entity';
import { Rating } from './rating.entity';
import { Favorite } from './favorite.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'external_id', unique: true })
  externalId: string;

  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true })
  author: string | null;

  @Column({ type: 'text', name: 'cover_url', nullable: true })
  coverUrl: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'avg_rating',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
    transformer: {
      from: (v: unknown) => (v != null ? Number(v) : null),
      to: (v: number | null) => v,
    },
  })
  avgRating: number | null;

  @Column({ name: 'review_count', default: 0 })
  reviewCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ReadingStatus, (rs) => rs.book)
  readingStatuses: ReadingStatus[];

  @OneToMany(() => Review, (r) => r.book)
  reviews: Review[];

  @OneToMany(() => Rating, (r) => r.book)
  ratings: Rating[];

  @OneToMany(() => Favorite, (f) => f.book)
  favorites: Favorite[];
}
