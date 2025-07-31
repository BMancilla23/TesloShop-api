import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { AuthResponseDto, CreateUserDto, LoginUserDto } from '@/auth/dto';
import { InvalidCredentialsException } from '@/common/exceptions/invalid-crendentials.exception';
import { User } from './entities/auth.entity';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  //  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    /*   try { */
    // Extract password from createUserDto and create a new object without it
    const { password, ...userData } = createUserDto;
    // Hash password
    const hashPassword = await argon2.hash(password);
    // Create user
    const user = this.userRepository.create({
      ...userData,
      password: hashPassword,
    });
    // Save user
    await this.userRepository.save(user);

    delete user.password;

    const token = this.generateJwtToken({ id: user.id, rol: user.role });

    return {
      user,
      token,
    };
    /*  } catch (error) {
      this.handleDBExceptions(error);
    } */
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const { email, password } = loginUserDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        fullName: true,
      },
    });
    // If user not found, throw an error
    /*  if (!user) throw new UnauthorizedException('Credentials are not valid'); */
    if (!user) throw new InvalidCredentialsException();

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid)
      /* throw new UnauthorizedException('Credentials are not valid'); */
      throw new InvalidCredentialsException();

    // Delete password from user
    delete user.password;

    const token = this.generateJwtToken({ id: user.id, rol: user.role });

    return {
      user,
      token,
    };
  }

  async checkAuthStatus(user: User): Promise<AuthResponseDto> {
    delete user.password;

    return {
      user: user,
      token: this.generateJwtToken({ id: user.id, rol: user.role }),
    };
  }

  private generateJwtToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // Duplicate code function
  /*   private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  } */
}
