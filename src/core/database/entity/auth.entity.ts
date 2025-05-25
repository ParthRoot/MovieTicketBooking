import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity('auth')
export class Auth extends Base {
  @PrimaryGeneratedColumn('uuid')
  auth_id!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 300 })
  password_hash!: string;

  @Column({ type: 'varchar', length: 300 })
  salt!: string;

  @OneToOne(() => User, (user) => user.auth, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) // This side owrole_idns the relationship
  user: User;
}
