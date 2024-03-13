import { LanguageHelper } from '../helpers';
import { SystemCodeModel } from '../model/system-code-model';

const codes = new SystemCodeModel();

export const SYSTEM_CORE_CODE = LanguageHelper.createSystemCode(codes);
