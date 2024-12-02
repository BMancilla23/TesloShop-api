import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { UserRole } from 'src/auth/enums/role.enum';
import { User } from 'src/auth/entities/auth.entity';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Add swagger documentation
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product was created successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, token related',
  })
  @Post()
  /* @Auth(UserRole.ADMIN, UserRole.SELLER) */
  @Auth()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Products were fetched successfully',
    type: [Product],
  })
  @ApiQuery({
    name: 'paginationDto',
    description: 'Pagination data',
    type: PaginationDto,
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    /* console.log(paginationDto); */
    return this.productsService.findAll(paginationDto);
  }

  // Get one product by id or slug
  @ApiOperation({ summary: 'Get one product by id or slug' })
  @ApiResponse({
    status: 200,
    description: 'Product was fetched successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiParam({
    name: 'term',
    description: 'Product id or slug',
    example: '123e4567-e89b-12d3-a456-426614174000 or t-shirt-teslo',
  })
  @Get(':term')
  findOne(@Param('term') term: string) {
    /* return this.productsService.findOne(term); */
    return this.productsService.findOnePlain(term);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'Product was updated successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Patch(':id')
  /* @Auth(UserRole.ADMIN, UserRole.SELLER) */
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'Product was deleted successfully',
    type: Product,
  })
  @Delete(':id')
  @Auth(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
