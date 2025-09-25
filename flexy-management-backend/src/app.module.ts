import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HoardingsModule } from './hoardings/hoardings.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [HoardingsModule, CloudinaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
