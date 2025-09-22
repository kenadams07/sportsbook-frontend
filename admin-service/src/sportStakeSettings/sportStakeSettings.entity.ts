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

  // Using any to avoid circular dependencies
  sports: any;
  currency: any;
  whiteLabel: any;

  // Array of stake size objects
  @Column('jsonb', { nullable: true })
  stakeSize: {
    maxExch: string;
    maxBookMaker: string;
    maxFancy: string;
  }[];

  // Empty array - define structure if available, otherwise keep jsonb
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