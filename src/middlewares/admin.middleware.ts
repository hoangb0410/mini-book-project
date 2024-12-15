import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomRequest } from './jwt.middleware';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.token as string;
    if (token) {
      const accessToken = token.split(' ')[1];
      try {
        const user = this.jwtService.verify(accessToken, {
          secret: process.env.JWT_ACCESS_KEY,
        });
        if (!user.isAdmin) {
          throw new ForbiddenException('Only admin has the permission');
        }
        req.user = user;
        next();
      } catch (error) {
        if (error instanceof ForbiddenException) {
          next(error);
        } else {
          next(new ForbiddenException('Token is not valid'));
        }
      }
    } else {
      throw new UnauthorizedException("You're not authenticated");
    }
  }
}
