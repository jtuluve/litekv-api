import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class KeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key: string | undefined = request.params?.key;
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (
      typeof key !== 'string' ||
      key === '' ||
      key === '_id' ||
      key === 'appid' ||
      key === 'createdAt' ||
      key === 'updatedAt' ||
      !regex.test(key)
    )
      throw new ForbiddenException('Invalid key');
    return true;
  }
}
