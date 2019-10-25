import { LoggerService } from '@nestjs/common';
import { LoggerInstance, transports, Logger as WsLogger } from 'winston';
import { configService } from '../Config/config.service';
import * as moment from 'moment';

export class AppLogger implements LoggerService {
  private logger: LoggerInstance;

  constructor(label?: string) {
    this.logger = new WsLogger({
      level: configService.get('LOG_LEVEL'),
        transports: [
          new transports.Console({
            label,
            timestamp: () => moment.locale().toString(),
            formatter: options => `${options.timestamp()} [${options.level.toUpperCase()}] ${options.label} - ${options.message}`,
          }),
        ],
    });
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  log(message: string) {
    this.logger.info(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  silly(message: string) {
    this.logger.silly(message);
  }
}
