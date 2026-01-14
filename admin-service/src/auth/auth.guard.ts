import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];
    const expectedToken = this.config.get<string>('ADMIN_API_TOKEN');

    if (!expectedToken) {
      throw new UnauthorizedException('Admin API token not configured');
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.substring('Bearer '.length).trim();
    if (token !== expectedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
