import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { App, AppDocument } from '../../schemas/app.schema';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    @InjectModel(App.name) private readonly appModel: Model<AppDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const appId = request.params?.appid;
    if (!appId) {
      throw new ForbiddenException('App ID is required');
    }

    const appExists = await this.appModel.exists({ appid: appId });

    if (!appExists) {
      throw new NotFoundException(`App with ID ${appId} not found`);
    }

    return true;
  }
}
