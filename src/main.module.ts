import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { AppModule } from './app/app.module';
import { StoreModule } from './store/store.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppModule,
    StoreModule,
    MongooseModule.forRoot(process.env.DATABASE_URL!),
  ],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
