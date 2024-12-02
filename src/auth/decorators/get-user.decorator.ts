import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

// Custom decorator to get the user from the request
export const GetUser = createParamDecorator(
  // Data is the property of the user object that we want to extract
  (data: string, ctx: ExecutionContext) => {
    // Get the request from the context
    const request = ctx.switchToHttp().getRequest();
    // Get the user from the request
    const user = request.user;
    // If the user is not found, throw an error
    if (!user) throw new InternalServerErrorException('User not found');
    // Return the user or the property of the user if data is provided
    return data ? user?.[data] : user;
  },
);
