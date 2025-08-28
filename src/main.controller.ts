import { Controller, Get, Res } from '@nestjs/common';
import { type Response } from 'express';
import { join } from 'path';
@Controller()
export class MainController {
  @Get('')
  getHome(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
