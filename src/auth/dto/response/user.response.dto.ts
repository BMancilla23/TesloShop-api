import { UserRole } from '@/auth/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '12345',
    description: 'Unique identifier of the user',
  })
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole, /* isArray: true  */ isArray: false })
  role: UserRole;

  @ApiProperty()
  isActive: boolean;
  /* 
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date; */
}
