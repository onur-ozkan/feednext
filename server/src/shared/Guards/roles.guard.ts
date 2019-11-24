import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { currentUserService } from '../Services/current-user.service'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const role = this.reflector.get<string>('role', context.getHandler())
        if (role === undefined ) return true

        const request = await context.switchToHttp().getRequest()

        const userRole = await currentUserService.getCurrentUser(request.headers.authorization, 'role')
        if (userRole >= role) return true

        return false
    }
}
