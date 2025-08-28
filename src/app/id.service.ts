import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { App, AppDocument } from 'src/schemas/app.schema';

@Injectable()
export class IdService {
  private readonly chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private nanoid: () => string;

  constructor(
    @InjectModel(App.name) private readonly appModel: Model<AppDocument>,
  ) {}

  private async getNanoid() {
    const { customAlphabet } = await import('nanoid');
    return customAlphabet(this.chars, 10);
  }

  async generateId(): Promise<string> {
    if (!this.nanoid) {
      this.nanoid = await this.getNanoid();
    }
    let id: string;
    let exists = true;
    let retries = 0;

    // Collision check just in case XD !
    do {
      id = this.nanoid();
      exists = !!(await this.appModel.exists({ appid: id }));
      retries++;
      if (retries > 5) {
        throw new Error('Failed to generate unique ID after 5 retries');
      }
    } while (exists);

    return id;
  }
}
