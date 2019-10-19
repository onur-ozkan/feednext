import { ConfigService} from '../config/config.service';
import * as jwt from 'jsonwebtoken';

export class BaseController {

  constructor(private readonly configService: ConfigService) {}

  protected getUserIdFromToken(authorization) {
    if (!authorization) { return null; }

    const token = authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, this.configService.getSecretKey);
    return decoded.id;
  }
}
