import { IAppState } from '../types';

export default {
  isCountriesLoaded: false,
  isCovidLoaded: false,
  countries: [],
  selectedCountry: null,
  covidActive: null,
  covidGlobal: null,
  covidAllCountries: [],
  selectedData: {
    timeInterval: 'all',
    activeStatus: 'confirmed',
    sizeStats: 'all',
  }
} as IAppState;
