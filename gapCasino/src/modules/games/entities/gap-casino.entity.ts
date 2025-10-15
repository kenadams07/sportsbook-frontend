import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

@Entity('gap_casinos')
export class GapCasino extends BaseEntity {

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

  // New fields for Studio 21 game data
  @Column({ nullable: true })
  product: string;

  @Column({ type: 'simple-array', nullable: true })
  platforms: string[];

  @Column({ nullable: true })
  freebetSupport: boolean;

  @Column({ type: 'simple-array', nullable: true })
  blockedCountries: string[];

  @Column({ nullable: true })
  releaseDate: string;

  @Column({ nullable: true })
  inGameFreebets: boolean;

  @Column({ nullable: true })
  volatility: number;

  @Column({ nullable: true })
  rtp: string;

  @Column({ type: 'simple-array', nullable: true })
  certifications: string[];

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  @Column({ type: 'simple-array', nullable: true })
  theme: string[];

  @Column({ type: 'simple-array', nullable: true })
  technology: string[];

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  tags: string;

  @Column({ nullable: true })
  features: string;

  // Note: createdAt and updatedAt are inherited from BaseEntity
  // They correspond to your Mongoose timestamps
  // createDate -> createdAt
  // updatedDate -> updatedAt
}