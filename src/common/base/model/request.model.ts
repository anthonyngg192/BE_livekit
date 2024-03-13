import { Request } from 'express';

export interface RequestModel<T extends { _id?: string } = any> extends Request {
  user?: T;
}
