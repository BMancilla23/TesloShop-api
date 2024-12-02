import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

// Decorator to apply the auth and roles guards
// Decorators composition
export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    // Apply the auth and roles guards
    UseGuards(AuthGuard(), RolesGuard),
    // Apply the roles metadata
    Roles(...roles),
  );
}
