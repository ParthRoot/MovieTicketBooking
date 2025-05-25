import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      data: {
        code: 1,
      },
      message: 'works',
    };
  }
}
