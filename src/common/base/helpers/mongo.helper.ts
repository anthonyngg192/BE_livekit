import { Types } from 'mongoose';

export class MongoHelper {
  static toObjectIds(ids: string[]) {
    return ids.map((id) => this.toObjectId(id));
  }

  static toObjectId(id?: string) {
    return new Types.ObjectId(id);
  }
}
