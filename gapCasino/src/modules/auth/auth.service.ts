import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { SignatureService } from '../../common/utils/signature.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private signatureService: SignatureService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  
  // Example method showing how to use the signature service
  async createSignatureForUser(userData: string): Promise<string> {
    try {
      return await this.signatureService.createSignature(userData);
    } catch (error) {
      throw new Error(`Failed to create signature for user: ${error.message}`);
    }
  }
  
  // Example method showing how to verify a signature
  async verifyUserSignature(signature: string, userData: string): Promise<boolean> {
    try {
      return await this.signatureService.verifySignature(signature, userData);
    } catch (error) {
      throw new Error(`Failed to verify signature for user: ${error.message}`);
    }
  }
}