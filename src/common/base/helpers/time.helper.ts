import * as moment from 'moment';
import { I18nContext } from 'nestjs-i18n';

export class TimeHelper {
  static async getRelativeTime(i18n: I18nContext, time: number | Date) {
    const minuteDiff = moment().diff(time, 'minute');
    if (minuteDiff < 1) {
      return await i18n.translate('time.justNow');
    }

    const hourDiff = moment().diff(time, 'hour');
    if (hourDiff < 1) {
      return await i18n.translate('time.minuteAgo', { args: { diff: minuteDiff } });
    }

    const dayDiff = moment().diff(time, 'day');
    if (dayDiff < 1) {
      return await i18n.translate('time.hourAgo', { args: { diff: hourDiff } });
    }

    const weekDiff = moment().diff(time, 'week');
    if (weekDiff < 1) {
      return await i18n.translate('time.dayAgo', { args: { diff: dayDiff } });
    }

    const yearDiff = moment().diff(time, 'year');
    if (yearDiff < 1) {
      return await i18n.translate('time.weekAgo', { args: { diff: weekDiff } });
    }

    return await i18n.translate('time.yearAgo', { args: { diff: yearDiff } });
  }
}
