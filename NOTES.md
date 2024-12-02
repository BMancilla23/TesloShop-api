## Environment variables

Las variables de entorno se cargan desde el archivo '.env`.

```bash
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=db_teslo
```

## Database

The database is hosted in a Docker container.

To start the database, run:

```bash
docker compose up -d
```

To stop the database, run:

```bash
docker compose down
```

To check the status of the database, run:

```bash
docker compose ps
```

To check the logs of the database, run:

```bash
docker compose logs -f db
```

## Using environment variables in NestJS

Instale el paquete `@nestjs/config` para acceder a las variables de entorno en la aplicación NESTJS.

```bash
pnpm install @nestjs/config
```

Para acceder a las variables de entorno en la aplicación NESTJS, puede usar la clase 'configservice`.

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
}
```

## Database connection

Instale el paquete `typeorm` para establecer la conexión con la base de datos.

```bash
pnpm install typeorm @nestjs/typeorm pg
```

En el archivo `src/app.module.ts`, importe el módulo `TypeOrmModule` y configura la conexión con la base de datos.

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

## Validation

Instale el paquete `class-validator` para validar los datos de entrada.

```bash
pnpm add class-validator class-transformer
```

En el archivo `src/main.ts`, configure la clase `ValidationPipe` para validar los datos de entrada.

```typescript
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    // Remove properties that are not in the DTO
    whitelist: true,
    // Throw an error if there are properties that are not in the DTO
    forbidNonWhitelisted: true,
  }),
);
```

Para validar los datos de entrada, se puede usar la clase `ValidationPipe`.

```typescript
import { ValidationPipe } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({}),
    },
  ],
});
```

## JWT

Instale el paquete `@nestjs/jwt` para generar y verificar tokens JWT.

```bash
pnpm add @nestjs/passport passport @nestjs/jwt  passport-jwt && pnpm add --save-dev @types/passport-jwt
```

En el archivo `src/auth/auth.module.ts`, configure el módulo `JwtModule` para usar el token JWT.

```typescript
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // Register Passport module with JWT strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Register JWT module with async configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
});
```

## Swagger

Instale el paquete `@nestjs/swagger` para documentar la API.

```bash
pnpm add @nestjs/swagger
```

En el archivo `src/main.ts`, configure el módulo `SwaggerModule` para documentar la API.

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Swagger configuration
const config = new DocumentBuilder()
  .setTitle('Teslo RESTFul API')
  .setDescription('Teslo shop endpoints')
  .setVersion('1.0')
  .build();

// Create the Swagger document
const document = SwaggerModule.createDocument(app, config);
// Setup the Swagger UI
SwaggerModule.setup('api', app, document);
```
