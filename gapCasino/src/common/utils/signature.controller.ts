import { Controller, Post, Body, Get } from '@nestjs/common';
import { SignatureService } from './signature.service';

@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Post('sign')
  async createSignature(@Body('data') data: string): Promise<{ signature: string }> {
    try {
      const signature = await this.signatureService.createSignature(data);
      return { signature };
    } catch (error) {
      throw new Error(`Failed to create signature: ${error.message}`);
    }
  }

  @Post('verify')
  async verifySignature(
    @Body('signature') signature: string,
    @Body('data') data: string,
  ): Promise<{ valid: boolean }> {
    try {
      const valid = await this.signatureService.verifySignature(signature, data);
      return { valid };
    } catch (error) {
      throw new Error(`Failed to verify signature: ${error.message}`);
    }
  }
}