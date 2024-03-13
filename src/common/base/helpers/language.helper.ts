import * as _ from 'lodash';
import { LANGUAGE } from '../enums';
import { LanguageFieldModel } from '../model/language-field.model';
import { SystemCodeModel } from '../model';
export class LanguageHelper {
  static getLanguageFromHeader(language: string) {
    if (!language) {
      return LANGUAGE.DEFAULT;
    }
    const defaultLang = (language || '').split(';')[0].split(',')[0] as LANGUAGE;
    return defaultLang ?? LANGUAGE.DEFAULT;
  }

  static createSystemCode<T extends SystemCodeModel>(translateJsonData: T) {
    const systemCodes = _.cloneDeep(translateJsonData);
    Object.keys(systemCodes).forEach((key) => (systemCodes[key] = key));
    return systemCodes;
  }

  static nonAccentVietnamese(str: string) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, '');
    return str.replace(/[^a-z0-9\_\.][\\\[\]\`^]?/g, '');
  }

  static escapeRegex(value: string) {
    return value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  }

  static accentVietnamese(str: string) {
    str = str.replace(/\s/g, '_');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, '');
    str = str.replace(/[^A-zÀ-úÀ-Úạ-ỵẠ-Ỵ\ă\Ă\ơ\Ơ\ũ\Ũ\ư\Ư\ĩ\Ĩ\ỷ\Ỷ\ỹ\Ỹ\ý\Ý\đ\Đ\d][\\\[\]\`^]?/g, '');
    str = str.replace(/\[|\]/g, '');
    return str.replace(/\\/g, '');
  }

  static translate(data: LanguageFieldModel, lang: string = LANGUAGE.VI) {
    return data && (data[lang] || data[LANGUAGE.VI]);
  }
}
