import { PartialType } from '@nestjs/mapped-types';
import { CreateGapCasinoDto } from './create-gap-casino.dto';

export class UpdateGapCasinoDto extends PartialType(CreateGapCasinoDto) {}