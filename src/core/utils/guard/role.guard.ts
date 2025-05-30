import { AvailableRoleEnum } from '@core/config';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly role_name: AvailableRoleEnum[] | '*') {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const roleAuthorized =
            this.role_name === '*' ? true : this.role_name.find((role) => role === request.user.role);

        if (roleAuthorized) {
            return true;
        } else {
            return false;
        }
    }
}
