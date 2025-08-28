import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { App, AppDocument } from 'src/schemas/app.schema';
import { randomBytes } from 'crypto';

@Injectable()
export class IdService {
  private readonly chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor(
    @InjectModel(App.name) private readonly appModel: Model<AppDocument>,
  ) {}

  private generateRandomId(length: number = 10): string {
    const bytes = randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += this.chars[bytes[i] % this.chars.length];
    }
    return result;
  }

  async generateId(): Promise<string> {
    let id: string;
    let exists = true;
    let retries = 0;

    // Collision check just in case XD !
    do {
      id = this.generateRandomId();
      exists = !!(await this.appModel.exists({ appid: id }));
      retries++;
      if (retries > 5) {
        throw new Error('Failed to generate unique ID after 5 retries');
      }
    } while (exists);

    return id;
  }
}
