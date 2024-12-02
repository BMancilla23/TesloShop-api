import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/auth/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(UserRole.ADMIN, UserRole.SELLER)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
