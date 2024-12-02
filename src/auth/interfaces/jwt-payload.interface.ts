import { UserRole } from '../enums/role.enum';

export interface IJwtPayload {
  id: string;
  rol: UserRole;
}
