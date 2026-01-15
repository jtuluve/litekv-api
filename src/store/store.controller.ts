import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { AppGuard } from '../common/guards/app.guard';
import { KeyGuard } from '../common/guards/key.guard';

@Controller()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(AppGuard)
  @UseGuards(KeyGuard)
  @Get('api/getVal/:appid/:key')
  async getVal(
    @Param('appid') appId: string,
    @Param('key') key: string,
  ): Promise<string> {
    const val = await this.storeService.getVal(appId, key);
    return val === undefined ? '' : String(val);
  }

  @UseGuards(AppGuard)
  @UseGuards(KeyGuard)
  @Get(['api/setVal/:appid/:key/:value', 'api/setVal/:appid/:key'])
  async setVal(
    @Param('appid') appId: string,
    @Param('key') key: string,
    @Param('value') value: string,
  ): Promise<boolean> {
    return await this.storeService.setVal(appId, key, value);
  }

  @UseGuards(AppGuard)
  @UseGuards(KeyGuard)
  @Get(['api/inc/:appid/:key', 'api/inc/:appid/:key/:value'])
  async incVal(
    @Param('appid') appId: string,
    @Param('key') key: string,
    @Param('value') value?: string,
  ): Promise<boolean> {
    return await this.storeService.incVal(appId, key, value);
  }

  @UseGuards(AppGuard)
  @UseGuards(KeyGuard)
  @Get(['api/dec/:appid/:key', 'api/dec/:appid/:key/:value'])
  async decVal(
    @Param('appid') appId: string,
    @Param('key') key: string,
    @Param('value') value?: string,
  ): Promise<boolean> {
    return this.storeService.decVal(appId, key, value);
  }
}
