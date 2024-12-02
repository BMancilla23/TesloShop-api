import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

// Pagination DTO
export class PaginationDto {
  @ApiProperty({
    description: 'Limit of products per page',
    example: 10,
  })
  @IsOptional()
  @IsPositive()
  // Transform to number
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiProperty({
    description: 'Offset of products',
    example: 1,
  })
  @IsOptional()
  @IsPositive()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  offset?: number;
}
