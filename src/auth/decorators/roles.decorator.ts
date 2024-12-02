import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

// Decorator to set the roles metadata
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
