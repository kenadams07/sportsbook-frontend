import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
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

  @Column('text')
  description: string;

  @Column('decimal', { precision: 15, scale: 2 })
  pl: number; // profit/loss

  @Column({ type: 'varchar', length: 50 })
  type: string; // e.g. 'fancy'

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