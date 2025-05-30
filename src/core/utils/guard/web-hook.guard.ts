import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { getEnv } from '../env.util';

@Injectable()
export class WebHookGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        // Check if request headers exist
        if (!request.headers) {
            throw new UnauthorizedException('Request headers are missing');
        }

        const authHeader = request.headers.authorization;

        if (!authHeader) {
            // If no authorization header, send 401 Unauthorized along with WWW-Authenticate header
            response.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
            throw new UnauthorizedException('Authorization header is missing');
        }

        const [type, credentials] = authHeader.split(' ');

        if (type !== 'Basic' || !credentials) {
            throw new UnauthorizedException('Invalid Authorization header format');
        }

        const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');

        if (!username || !password) {
            throw new UnauthorizedException('Invalid Authorization header format');
        }

        if (this.validateCredentials(username, password)) {
            return true;
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    validateCredentials(username: string, password: string): boolean {
        // Replace these with your actual logic for validating credentials
        const validUsername = getEnv('WEB_HOOK_URL_USER_NAME');
        const validPassword = getEnv('WEB_HOOK_URL_PASSWORD');

        return username === validUsername && password === validPassword;
    }
}
