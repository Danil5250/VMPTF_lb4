import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwt: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const token = req.cookies["access_token"];
        if (!token) return false;

        try {
            req.user = this.jwt.verify(token);
            console.log(req.user);
            return true;
        } catch {
            return false;
        }
    }
}
