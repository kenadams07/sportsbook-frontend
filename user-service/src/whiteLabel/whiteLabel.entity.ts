import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WhiteLabelStatus {
  ACTIVE = '1',
  INACTIVE = '0',
}

export enum WhiteLabelType {
  B2C = 'B2C',
  B2B = 'B2B',
  // add more if needed
}

@Entity()
export class WhiteLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  clientSharing: number;

  @Column({ type: 'varchar', length: 255 })
  domainUrl: string;

  @Column({ type: 'varchar', length: 255 })
  admin_domainUrl: string;

  @Column({ type: 'varchar', length: 255 })
  logo_light: string;

  @Column({ type: 'varchar', length: 255 })
  logo_dark: string;

  @Column({
    type: 'enum',
    enum: WhiteLabelType,
  })
  whiteLabelType: WhiteLabelType;

  @Column({
    type: 'enum',
    enum: WhiteLabelStatus,
  })
  status: WhiteLabelStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
