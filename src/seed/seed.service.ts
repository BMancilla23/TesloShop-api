import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertNewUsers();
    await this.insertNewProducts(adminUser);
    return 'Seed executed';
  }

  // Delete all products and users
  private async deleteTables() {
    // Delete all products
    await this.productsService.deleteAllProducts();

    // Delete all users
    const queryBuilder = this.usersRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertNewUsers() {
    const users = initialData.users;

    const hashedPassword = await argon.hash(users[0].password as string);

    const newUsers = users.map((user) =>
      this.usersRepository.create({
        ...user,
        password: hashedPassword,
      }),
    );

    const dbUsers = await this.usersRepository.save(newUsers);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    // Delete all products
    await this.productsService.deleteAllProducts();

    // Get products from initial data
    const products = initialData.products;

    // Create promises to insert products
    const insertPromises = [];

    // Insert products with the user admin
    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    // Execute all promises
    await Promise.all(insertPromises);

    return true;
  }
}
