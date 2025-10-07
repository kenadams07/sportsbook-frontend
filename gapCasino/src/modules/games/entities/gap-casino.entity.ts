import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

@Entity('gap_casinos')
export class GapCasino extends BaseEntity {

  @Column({ nullable: true })
  gameId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  gameCode: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  providerName: string;

  @Column({ nullable: true })
  subProviderName: string;

  @Column({ nullable: true })
  urlThumb: string;

  @Column({ nullable: true })
  status: boolean;

  @Column({ nullable: true })
  token: string;

  // Note: createdAt and updatedAt are inherited from BaseEntity
  // They correspond to your Mongoose timestamps
  // createDate -> createdAt
  // updatedDate -> updatedAt
}