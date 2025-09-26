import { Currency } from 'src/currency/currency.entity';
import { Sports } from 'src/sports/sports.entity';
import { WhiteLabel } from 'src/whiteLabel/whiteLabel.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SportStakeSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sports)
  sports: Sports;

  @ManyToOne(() => Currency)
  currency: Currency;

  @ManyToOne(() => WhiteLabel)
  whiteLabel: WhiteLabel;

  @Column('jsonb', { nullable: true })
  stakeSize: {
    maxExch: string;
    maxBookMaker: string;
    maxFancy: string;
  }[];

  @Column('jsonb', { nullable: true })
  commission: any[];

  @Column('jsonb', { nullable: true })
  betDelay: any[];

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  bookmakerLimit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}