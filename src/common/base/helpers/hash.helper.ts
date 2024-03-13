import * as crypto from 'crypto';

export class HashHelper {
  static md5(content: string) {
    return crypto.createHash('md5').update(content, 'utf8').digest('hex');
  }
}
