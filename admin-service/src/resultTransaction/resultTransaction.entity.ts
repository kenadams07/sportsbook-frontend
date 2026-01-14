import { Markets } from '../markets/markets.entity';
import { User } from '../users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CommissionStatus {
  ONE = '1',
  TWO = '2',
  THREE = '3',
}

@Entity()
export class ResultTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.resultTransaction)
  user: User;

  @ManyToOne(() => Markets)
  market: Markets;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 15, scale: 2 })
  pl: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({
    type: 'enum',
    enum: CommissionStatus,
  })
  commissionStatus: CommissionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
