import { LocalStorageKeys as Keys } from '../types/enums';

export const storagePopulation = createStorageObject(Keys.EARTH_POPULATION);
export const storageCountries = createStorageObject(Keys.COUNTRIES);
export const storageLastFetchDate = createStorageObject(Keys.LAST_FETCH_DATE);
export const storageCovidData = createStorageObject(Keys.COVID_DATA);
export const storageCovidGlobal = createStorageObject(Keys.COVID_GLOBAL);

function createStorageObject(key: string) {
  return {
    set(value: any) {
      localStorage.setItem(key, JSON.stringify(value));
    },

    get() {
      const value: any = localStorage.getItem(key);
      return JSON.parse(value);
    },

    has() {
      return localStorage.getItem(key) !== null;
    },
  };
}
