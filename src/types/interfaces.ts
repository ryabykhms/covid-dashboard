export interface ICountry {
  population: number;
  flag: string;
  name: string;
  alpha2Code: string;
}

export interface ICovidCase {
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface ICovidInfo {
  population?: number;
  total: ICovidCase;
  totalPer100: ICovidCase;
  lastDay: ICovidCase;
  lastDayPer100: ICovidCase;
}

export interface ICountryCovidItem {
  Country?: string /** {@link Country.name} */;
  CountryCode?: string;
  Province?: string;
  City?: string;
  CityCode?: string;
  Lat?: string;
  Lon?: string;
  Confirmed: number;
  Deaths: number;
  Recovered: number;
  ConfirmedPer100?: number;
  DeathsPer100?: number;
  RecoveredPer100?: number;
  NewConfirmed?: number;
  NewDeaths?: number;
  NewRecovered?: number;
  NewConfirmedPer100?: number;
  NewDeathsPer100?: number;
  NewRecoveredPer100?: number;
  Active?: number;
  Date: string | Date;
}

export interface IAppState {
  isCountriesLoaded: boolean;
  isCovidLoaded: boolean;
  isGlobalCovidDataLoaded: boolean;
  isCountryCovidDataLoaded: boolean;
  countries: Array<ICountry>;
  selectedCountry: string | null;
  covidActive: ICovidInfo | null;
  covidGlobal: ICovidInfo | null;
  covidAllCountries: Array<ICovidInfo>;
  globalCovidData: ICountryCovidItem[] | null;
  selectedData: ICountryCovidItem[] | null;
  selectedOptions: {
    timeInterval: string;
    activeStatus: string;
    sizeStats: string;
  };
}

export interface IAppComponentProps {
  isCountriesLoaded: boolean;
  isCovidLoaded: boolean;
  isGlobalCovidDataLoaded: boolean;
  loadCountries: () => void;
  loadCovidInfo: () => void;
  loadGlobalCovidData: () => void;
}
