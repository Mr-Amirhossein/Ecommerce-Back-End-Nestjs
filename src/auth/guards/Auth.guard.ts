import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Roles } from 'src/user/decorator/Role.decorator';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('شما باید وارد سیستم شوید');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.id && payload.role === 'user') {
        request['user'] = payload;
        return true;
      }

      if (
        !payload.role ||
        payload.role === '' ||
        !roles.includes(payload.role)
      ) {
        throw new UnauthorizedException(
          'شما دسترسی لازم برای انجام این عملیات را ندارید',
        );
      }
      // 💡 Nous attribuons ici le payload à l'objet de la requête
      // afin que nous puissions y accéder dans nos gestionnaires de routes
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(
        'nmشما دسترسی لازم برای انجام این عملیات را ندارید',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
