import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/createApp')
  async createApp(): Promise<string> {
    return (await this.appService.createApp()).appid;
  }

  @Get('api/exists/:appid')
  async exists(@Param('appid') appId: string): Promise<boolean> {
    return !!(await this.appService.exists(appId))?.appid;
  }
}
