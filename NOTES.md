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
