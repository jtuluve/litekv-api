import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from '../schemas/app.schema';
import { IdService } from './id.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: App.name, schema: AppSchema }])],
  controllers: [AppController],
  providers: [AppService, IdService],
})
export class AppModule {}
