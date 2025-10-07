import { PartialType } from '@nestjs/mapped-types';
import { CreateGapCasinoUserTokenDto } from './create-gap-casino-user-token.dto';

export class UpdateGapCasinoUserTokenDto extends PartialType(CreateGapCasinoUserTokenDto) {}