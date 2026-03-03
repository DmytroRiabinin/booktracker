import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

export enum ReadingStatusEnum {
  PLANNED = 'planned',
  READING = 'reading',
  COMPLETED = 'completed',
}

@Entity('reading_statuses')
export class ReadingStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'book_id' })
  bookId: string;

  @Column({ type: 'enum', enum: ReadingStatusEnum, enumName: 'reading_status' })
  status: ReadingStatusEnum;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (u) => u.readingStatuses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, (b) => b.readingStatuses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
