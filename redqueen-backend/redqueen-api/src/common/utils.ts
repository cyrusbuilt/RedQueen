import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export default class Utils {
  public static sendOkHeaders(res: Response): void {
    res.set('Content-Length', '34');
    res.set('Date', new Date().toUTCString());
    res.set('Server', 'Express');
    res.status(HttpStatus.OK).send();
  }
}
