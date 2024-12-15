import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException('No token provided');
    }
    const [type, token] = request.headers.authorization?.split(' ');

    const payload = this.jwtService.decode(token) as {
      id: string;
      isAdmin: boolean;
    };
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    if (!payload.isAdmin) {
      throw new UnauthorizedException('Only admin have the permission');
    }

    return true;
  }
}
