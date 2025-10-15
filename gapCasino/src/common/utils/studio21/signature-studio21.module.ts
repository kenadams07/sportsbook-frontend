import { Module } from '@nestjs/common';
import { SignatureService } from './signature-studio21.service';

@Module({
  providers: [SignatureService],
  exports: [SignatureService],
})
export class SignatureModule {}