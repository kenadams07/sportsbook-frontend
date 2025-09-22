import { Markets } from '../markets/markets.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Runners {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;
  
  @Column({ type: 'varchar', length: 255 })
  runnerId: string;

  @ManyToMany(() => Markets)
  @JoinTable({
    name: 'market_runners',
    joinColumn: { name: 'runner_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'market_id', referencedColumnName: 'id' },
  })
  markets: Markets[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
export enum StatusEnum {
  ACTIVE = '1',
  INACTIVE = '0',
}