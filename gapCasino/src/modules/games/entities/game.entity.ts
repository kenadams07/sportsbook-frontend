import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

export enum GameType {
  SLOTS = 'slots',
  BLACKJACK = 'blackjack',
  ROULETTE = 'roulette',
  POKER = 'poker',
  BACCARAT = 'baccarat',
}

@Entity('games')
@Index(['name'])
export class Game extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({
    type: 'simple-enum',
    enum: GameType,
  })
  type: GameType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  houseEdge: number;

  @Column({ type: 'simple-json', nullable: true })
  rules: any;
}