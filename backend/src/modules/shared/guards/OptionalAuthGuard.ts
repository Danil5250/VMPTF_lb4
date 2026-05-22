import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp().getRequest();
        const token = req.cookies?.['access_token'];

        if (!token) {
            req.user = null;
            return true;
        }

        try {
            req.user = this.jwt.verify(token);
        } catch {
            req.user = null;
        }

        return true;
    }
}
