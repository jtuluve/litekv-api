import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { AppGuard } from 'src/common/guards/app.guard';

@Controller()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(AppGuard)
  @Get('api/getVal/:appid/:key')
  async getVal(
    @Param('appid') appId: string,
    @Param('key') key: string,
  ): Promise<string> {
    const val = await this.storeService.getVal(appId, key);
    return val === undefined ? '' : String(val);
  }

  @UseGuards(AppGuard)
  @Get(['api/setVal/:appid/:key/:value', 'api/setVal/:appid/:key'])
  async setVal(
    @Param('appid') appId: string,
    @Param('key') key: string,
    @Param('value') value: string,
  ): Promise<boolean> {
    return await this.storeService.setVal(appId, key, value);
  }

  @UseGuards(AppGuard)
  @Get('api/inc/:appid/:key')
  async incVal(
    @Param('appid') appId: string,
    @Param('key') key: string,
  ): Promise<boolean> {
    return await this.storeService.incVal(appId, key);
  }

  @UseGuards(AppGuard)
  @Get('api/dec/:appid/:key')
  async decVal(
    @Param('appid') appId: string,
    @Param('key') key: string,
  ): Promise<boolean> {
    return this.storeService.decVal(appId, key);
  }
}
