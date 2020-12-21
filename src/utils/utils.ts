import {ICovidInfo, ISelectedOptions} from '@types';
import { SELECTED_DATA_OPTIONS } from '@constants';

export const getStatsOnCurrentOptions =
  (data: ICovidInfo | null, options: ISelectedOptions)
    : [number, string] | [undefined, undefined] => {

  const { timeInterval, activeStatus, sizeStats } = options;

  if (data === null) return [undefined, undefined];

  const all = timeInterval === SELECTED_DATA_OPTIONS.TIME_INTERVAL_ALL;
  const lastDay = timeInterval === SELECTED_DATA_OPTIONS.TIME_INTERVAL_LAST_DAY;

  const confirmed = activeStatus === SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED;
  const recovered = activeStatus === SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED;
  const deaths = activeStatus === SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS;

  const allSize = sizeStats === SELECTED_DATA_OPTIONS.SIZE_STATUS_ALL;
  const per100Size = sizeStats === SELECTED_DATA_OPTIONS.SIZE_STATUS_100k;

  if (all && confirmed && allSize) {
    return [data.total.confirmed, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED];
  }

  if (all && recovered && allSize) {
    return [data.total.recovered, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED];
  }

  if (all && deaths && allSize) {
    return [data.total.deaths, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS];
  }


  if (all && confirmed && per100Size) {
    return [data.totalPer100.confirmed, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED];
  }

  if (all && recovered && per100Size) {
    return [data.totalPer100.recovered, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED];
  }

  if (all && deaths && per100Size) {
    return [data.totalPer100.deaths, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS];
  }


  if (lastDay && confirmed && allSize) {
    return [data.lastDay.confirmed, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED];
  }

  if (lastDay && recovered && allSize) {
    return [data.lastDay.recovered, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED];
  }

  if (lastDay && deaths && allSize) {
    return [data.lastDay.deaths, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS];
  }


  if (lastDay && confirmed && per100Size) {
    return [data.lastDayPer100.confirmed, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED];
  }

  if (lastDay && recovered && per100Size) {
    return [data.lastDayPer100.recovered, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED];
  }

  if (lastDay && deaths && per100Size) {
    return [data.lastDayPer100.deaths, SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS];
  }

  throw new Error('Errors on getStatsOnCurrentOptions!');
}
