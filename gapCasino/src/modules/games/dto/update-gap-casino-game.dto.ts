import { PartialType } from '@nestjs/mapped-types';
import { CreateGapCasinoGameDto } from './create-gap-casino-game.dto';

export class UpdateGapCasinoGameDto extends PartialType(CreateGapCasinoGameDto) {}