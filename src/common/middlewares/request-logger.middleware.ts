import { AppEnvironmentService } from '../environment';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { LogRepository } from '../log/repository/log.repository';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly envService: AppEnvironmentService,
    private readonly logRepository: LogRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const log = {
      app: this.envService.ENVIRONMENT.APP_NAME,
      url: req.originalUrl,
      method: req.method,
      requestBody: JSON.stringify(req.body),
      time: new Date(),
      header: JSON.stringify(req.headers),
      duration: 0,
      responseBody: '',
      status: 200,
    };
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks = [];

    res.write = (...args) => {
      chunks.push(args[0]);

      return oldWrite.apply(res, args);
    };

    res.end = (...args) => {
      if (args[0]) {
        chunks.push(args[0]);
      }

      const body = Buffer.concat(chunks).toString('utf8');
      log.responseBody = body;
      log.duration = Date.now() - log.time.getTime();
      log.status = res.statusCode;
      if (this.isValid(req)) {
        this.logRepository.insert(log);
      }
      oldEnd.apply(res, args);
    };

    res.on('error', (err: Error) => {
      this.logger.error(`Error: ${err.message}`);
    });

    next();
  }

  isValid(_request: Request) {
    return true;
  }
}
