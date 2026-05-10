import { Module } from '@nestjs/common';
import { FilesService } from './infrastructure/files.service';
import { FilesController } from './presentation/controllers/files.controller';
import { FilesApi } from './infrastructure/files.api';
import { CategoryModule } from '../category/category.module';
import { PrismaModule } from '../shared/persistence/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    CategoryModule,
    PrismaModule,
  ],
  controllers: [FilesController],
  providers: [FilesApi, FilesService],
})
export class FilesModule {}
