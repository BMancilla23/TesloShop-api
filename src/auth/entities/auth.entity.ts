import { IsEmail, IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../enums/role.enum';
import { Product } from 'src/products/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Column('text')
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @Column('text', { unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @Column('text', { select: false })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User active status',
    example: true,
  })
  @Column('boolean', { default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'User role',
    example: UserRole.USER,
  })
  @Column('enum', { enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({
    description: 'Products related to the user',
    type: [Product],
  })
  // Products related to the user
  @OneToMany(() => Product, (product) => product.user)
  products?: Product[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
