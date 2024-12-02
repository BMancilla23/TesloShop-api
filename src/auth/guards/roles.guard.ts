import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../enums/role.enum';
import { User } from '../entities/auth.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Inject the reflector to get the roles from the metadata
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the roles from the metadata
    const requiredRoles: string[] = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    // If there are no roles, return true
    if (!requiredRoles) return true;

    // If there are no roles, return true
    if (requiredRoles.length === 0) return true;

    // Get the user from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    // If the user is not found, throw an error
    if (!user) throw new BadRequestException('User not found');

    // Check if the user has the required roles
    const hasRole = requiredRoles.some((role) => user.role.includes(role));

    // If the user does not have the required roles, throw an error
    if (!hasRole)
      throw new ForbiddenException(
        `User ${user.fullName} needs a valid role: [${requiredRoles}]`,
      );

    // If the user has the required roles, return hasRole
    return hasRole;
  }
}
