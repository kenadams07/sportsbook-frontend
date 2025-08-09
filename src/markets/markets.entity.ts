import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

export enum MarketType {
  ODDS = 'ODDS',
}

export enum ExposureStatus {
  ONE = '1',
  TWO = '2',
  THREE = '3',
}

@Entity()
export class Markets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  marketId: string;

  @Column()
  marketName: string;

  @Column({
    type: 'enum',
    enum: MarketType,
  })
  marketType: MarketType;

  @Column({
    type: 'timestamp', // or 'date' if you don't need time part
  })
  marketTime: Date;

  @Column({
    type: 'enum',
    enum: ExposureStatus,
  })
  status: ExposureStatus;
}