import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
  user?: any;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.token as string;
    if (token) {
      const accessToken = token.split(' ')[1];
      try {
        const user = this.jwtService.verify(accessToken, {
          secret: process.env.JWT_ACCESS_KEY,
        });
        req.user = user;
        next();
      } catch (error) {
        throw new ForbiddenException('Token is not valid');
      }
    } else {
      throw new UnauthorizedException("You're not authenticated");
    }
  }
}
