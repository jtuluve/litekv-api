import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { App } from 'src/schemas/app.schema';

@Injectable()
export class StoreService {
  constructor(@InjectModel(App.name) private AppModel: Model<App>) {}

  async getVal(appId: string, key: string): Promise<string> {
    const doc = await this.AppModel.findOne({ appid: appId })
      .select(key + ' -_id')
      .lean();

    return String(doc?.[key] ?? '');
  }

  async setVal(appId: string, key: string, value?: string) {
    return !!(
      await this.AppModel.updateOne(
        { appid: appId },
        { [key]: value ?? '' },
      ).lean()
    ).modifiedCount;
  }

  async incVal(appId: string, key: string): Promise<boolean> {
    const doc = await this.AppModel.findOne({ appid: appId }).lean();
    const current = Number(doc?.[key] ?? 0) || 0;
    const res = await this.AppModel.updateOne(
      { appid: appId },
      { $set: { [key]: current + 1 } },
    ).lean();

    return !!res.modifiedCount;
  }

  async decVal(appId: string, key: string) {
    const doc = await this.AppModel.findOne({ appid: appId }).lean();
    const current = Number(doc?.[key] ?? 0);
    const res = await this.AppModel.updateOne(
      { appid: appId },
      { $set: { [key]: current - 1 } },
    ).lean();

    return !!res.modifiedCount;
  }
}
