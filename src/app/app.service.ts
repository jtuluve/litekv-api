import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { App } from 'src/schemas/app.schema';
import { IdService } from './id.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(App.name) private AppModel: Model<App>,
    private idService: IdService,
  ) {}

  async createApp() {
    const appId: string = await this.idService.generateId();
    const newApp = new this.AppModel({ appid: appId });
    return await newApp.save();
  }

  async exists(appId: string) {
    return await this.AppModel.findOne({ appid: appId }).lean();
  }
}
