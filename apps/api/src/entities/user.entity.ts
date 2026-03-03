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

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role',
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ReadingStatus, (rs: ReadingStatus) => rs.user)
  readingStatuses: ReadingStatus[];

  @OneToMany(() => Review, (r: Review) => r.user)
  reviews: Review[];

  @OneToMany(() => Rating, (r: Rating) => r.user)
  ratings: Rating[];

  @OneToMany(() => Favorite, (f: Favorite) => f.user)
  favorites: Favorite[];
}
