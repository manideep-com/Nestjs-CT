import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('No authorization header provided');
      throw new UnauthorizedException('Authorization header is required');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      this.logger.warn('Invalid authorization type');
      throw new UnauthorizedException('Authorization type must be Bearer');
    }

    if (!token) {
      this.logger.warn('No token provided');
      throw new UnauthorizedException('Token is required');
    }

    try {
      const isValid = await this.authService.verifyToken(token);
      
      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      request.token = token;
      return true;
    } catch (error) {
      this.logger.error('Token verification failed', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}