import * as slug from 'slug';
import { cloneDeep } from 'lodash';

export class SlugHelper {
  static makeSlug(value: string | object) {
    if (!value) return value;

    if (typeof value === 'object') {
      const slugs = cloneDeep(value);
      Object.keys(slugs).forEach((key) => {
        slugs[key] = slug(slugs[key], {
          lower: true,
        });
      });

      return slugs;
    }

    return slug(value, {
      lower: true,
    });
  }
}
