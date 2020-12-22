import { IAppState } from '@types';

export default {
  isCountriesLoaded: false,
  isCovidLoaded: false,
  isGlobalCovidDataLoaded: false,
  isCountryCovidDataLoaded: false,
  countries: [],
  selectedCountry: null,
  covidActive: null,
  covidGlobal: null,
  covidAllCountries: [],
  globalCovidData: [],
  selectedData: [],
  selectedOptions: {
    timeInterval: 'all',
    activeStatus: 'confirmed',
    sizeStats: 'all',
  },
  intensivity: null,
} as IAppState;
