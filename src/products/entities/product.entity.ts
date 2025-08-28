import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { User } from 'src/auth/entities/auth.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from '@/products/entities/product-image.entity';

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
  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'This is a description of the product',
  })
  @Column('text', {
    nullable: false,
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
  @Column('int', {
    default: 0,
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
  /*  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true, // When the product is saved, the images are saved
    eager: true, // When the product is fetched, the images are fetched
  }) */
  // 🔹 Aquí no hacemos import directo de la clase para evitar el ciclo
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: Relation<ProductImage[]>;

  /*   @ApiProperty({
    description: 'User related to the product',
    type: User,
  }) */
  // User related to the product
  @ManyToOne(() => User, { eager: true })
  user: Relation<User>;

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
