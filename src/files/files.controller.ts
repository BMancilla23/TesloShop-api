import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('upload/:fileName')
  findFile(
    @Res() res: Response,
    @Param('fileName', ParseFilePipe) fileName: string,
  ) {
    const path = this.filesService.getStaticFile(fileName);
    res.sendFile(path);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 },
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    /* return this.filesService.uploadFile(file); */

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    /*   console.log(file); */
    /* const secureUrl = `${file.filename}`; */

    const secureUrl = `${this.configService.get('HOST_API')}/files/upload/${file.filename}`;
    return {
      secureUrl,
      /*  fileName: file.filename, */
    };
  }
}
