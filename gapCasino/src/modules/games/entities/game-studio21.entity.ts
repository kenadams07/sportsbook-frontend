import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

@Entity('studio21_games')
export class Studio21Game extends BaseEntity {

  @Column({ nullable: true })
  gameId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  gameCode: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  providerName: string;

  @Column({ nullable: true })
  subProviderName: string;

  @Column({ nullable: true })
  urlThumb: string;

  @Column({ nullable: true })
  status: boolean;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  rtp: number;

  @Column({ nullable: true })
  volatility: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  tags: string;

  @Column({ nullable: true })
  features: string;
}