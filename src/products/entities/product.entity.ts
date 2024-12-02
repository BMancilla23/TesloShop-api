import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/auth.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  // Add swagger documentation
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product title',
    example: 'T-shirt Teslo',
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: 10.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'This is a description of the product',
  })
  description: string;

  @ApiProperty({
    description: 'Product slug',
    example: 't-shirt-teslo',
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    description: 'Product stock',
    example: 10,
  })
  stock: number;

  @ApiProperty({
    description: 'Product sizes',
    example: ['M', 'L', 'XL'],
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    description: 'Product gender',
    example: 'men',
  })
  @Column('text')
  gender: string;

  // Tags
  @ApiProperty({
    description: 'Product tags',
    example: ['tag1', 'tag2', 'tag3'],
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // Images
  @ApiProperty({
    description: 'Product images',
    example: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  })
  /* @Column('text', {
    array: true,
  })
  images: string[]; */
  // Relations
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true, // When the product is saved, the images are saved
    eager: true, // When the product is fetched, the images are fetched
  })
  images?: ProductImage[];

  /*   @ApiProperty({
    description: 'User related to the product',
    type: User,
  }) */
  // User related to the product
  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
