import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('gap_casino_user_tokens')
export class GapCasinoUserToken extends BaseEntity {
  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  gap_casino_token: string;
  
  // Note: createdAt and updatedAt are inherited from BaseEntity
  // They correspond to your Mongoose timestamps
}