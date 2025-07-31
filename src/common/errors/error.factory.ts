import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

export const ErrorFactory = {
  auth: {
    invalidCredentials: () => new UnauthorizedException('Invalid credentials'), // genérico

    authFailed: () => new UnauthorizedException('Authentication failed'), // más general

    userInactive: () => new UnauthorizedException('Access denied'), // no dice si existe

    tokenInvalid: () => new UnauthorizedException('Invalid token'),

    // Solo si estás en contexto seguro (como en un panel privado)
    userNotFound: () => new UnauthorizedException('Invalid credentials'), // usa uno genérico
  },

  db: {
    uniqueViolation: (detail?: string) =>
      new BadRequestException(detail || 'Unique constraint violation'),
  },

  internal: {
    unexpected: () =>
      new InternalServerErrorException('Unexpected server error'),
  },
};
