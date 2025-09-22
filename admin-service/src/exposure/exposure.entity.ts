import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Exposure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Using any to avoid circular dependencies
  market: any;
  user: any;

  @Column()
  is_clear: string;

  @Column()
  marketType: string;

  @Column()
  exposure: string;
}