import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';
import { Auth } from './auth.entity';

@Entity('user')
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  first_name!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  last_name!: string;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;
}
