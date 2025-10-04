import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { User } from '../../users/entities/user.entity';
import { Game } from '../../games/entities/game.entity';

export enum BetStatus {
  PENDING = 'pending',
  SETTLED = 'settled',
  CANCELLED = 'cancelled',
}

@Entity('bets')
@Index(['userId', 'createdAt'])
@Index(['gameId'])
export class Bet extends BaseEntity {
  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Game, game => game.id)
  game: Game;

  @Column()
  gameId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  payout: number;

  @Column({
    type: 'simple-enum',
    enum: BetStatus,
    default: BetStatus.PENDING,
  })
  status: BetStatus;

  @Column({ type: 'simple-json', nullable: true })
  details: any;

  @Column({ nullable: true })
  settledAt: Date;
}