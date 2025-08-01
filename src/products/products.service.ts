import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { ProductImage } from '@/products/entities/product-image.entity';

@Injectable()
export class ProductsService {
  // Logger
  private readonly logger = new Logger('ProductsService');

  constructor(
    // Product Repository
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    // Product Image Repository
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    // Data Source
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        user,
      });
      await this.productRepository.save(product);
      return {
        ...product,
        images,
      };
    } catch (error) {
      /* console.log(error); */
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      order: {
        id: 'ASC',
      },
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    // Return the products with the images as an array of urls
    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    // Check if term is a UUID
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      /* // Check if term is a slug
      product = await this.productRepository.findOneBy({ slug: term }); */
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('UPPER(title) = :title or slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        // Left join the images to the product
        .leftJoinAndSelect('product.images', 'productImages')
        .getOne(); // Get one product
    }

    if (!product) {
      throw new NotFoundException(`Product with id ${term} not found`);
    }

    return product;
  }

  async findOnePlain(term: string) {
    const { images, ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    // Preload product with the new data
    const product = await this.productRepository.preload({
      ...toUpdate,
      id,
    });

    // Check if the product exists
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    // Connect to the database
    await queryRunner.connect();
    // Start transaction
    await queryRunner.startTransaction();

    try {
      if (images) {
        // Delete all the images of the product
        await queryRunner.manager.delete(ProductImage, {
          product: { id },
        });
        // Create the new images of the product
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }
      product.user = user;
      // Update the product
      await queryRunner.manager.save(product);
      // await this.productRepository.save(product);
      // Commit transaction
      await queryRunner.commitTransaction();

      // Return the product
      return this.findOnePlain(id);
    } catch (error) {
      // Rollback transaction
      await queryRunner.rollbackTransaction();

      this.handleDBExceptions(error);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productRepository.remove(product);
  }

  async deleteAllProducts() {
    try {
      // Create query builder to delete all products
      const query = this.productRepository.createQueryBuilder('product');
      // Delete all products
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error.code === '23503') {
      throw new NotFoundException(error.detail);
    }

    if (error.code === '23502') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
