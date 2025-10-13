import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../database/base.entity';

@Entity('studio21_user_tokens')
export class Studio21UserToken extends BaseEntity {

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  studio21_token: string;

  @Column({ nullable: true })
  expiresAt: Date;
}