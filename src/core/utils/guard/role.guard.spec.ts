import { RoleGuard } from './role.guard';

describe('Role Guard', () => {
    const request: any = {
        switchToHttp: () => ({
            getRequest: () => ({
                user: {
                    role: 'SUPER ADMIN',
                },
            }),
        }),
    };

    it('will check the role guard', () => {
        const role = new RoleGuard('*');
        const is = role.canActivate(request);
        expect(typeof is === 'boolean').toBe(true);
        expect(is).toBe(true);
    });
});
