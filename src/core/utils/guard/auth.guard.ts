import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { validateJwt } from '../index';
import { Request } from 'express';

export function handleAuthentication(req: Request) {
    const getAuthorization = req.headers['authorization'] as string;
    return validateJwt(getAuthorization, req);
}

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const data = handleAuthentication(request);

        return data;
    }
}
