import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/auth.entity';
import { RolesGuard } from './guards/roles.guard';

import { UserRole } from './enums/role.enum';
import { Auth, GetUser, Roles } from './decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User was created successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User was logged in successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Route private get user
  @ApiOperation({ summary: 'Get the user' })
  @ApiResponse({
    status: 200,
    description: 'User was fetched successfully',
    type: User,
  })
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(@GetUser() user: User) {
    return user;
  }

  // Route private with roles using the decorator
  @ApiOperation({ summary: 'Get the user with roles' })
  @ApiResponse({
    status: 200,
    description: 'User was fetched successfully',
    type: User,
  })
  @ApiBearerAuth()
  @Get('private2')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @UseGuards(AuthGuard(), RolesGuard)
  testingPrivateRoute2(@GetUser() user: User) {
    return user;
  }

  // Route private with roles using the decorator composition
  @ApiOperation({ summary: 'Get the user with roles' })
  @ApiResponse({
    status: 200,
    description: 'User was fetched successfully',
    type: User,
  })
  @Get('private3')
  @Auth(UserRole.ADMIN, UserRole.SELLER)
  testingPrivateRoute3(@GetUser() user: User) {
    return user;
  }
}
