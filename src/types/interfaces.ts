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
  total: ICovidCase;
  totalPer100: ICovidCase;
  lastDay: ICovidCase;
  lastDayPer100: ICovidCase;
}

export interface IGlobalCovidItem {
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
  Data?: Date;
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
  globalCovidData: ICountryCovidItem[];
  selectedData: ICountryCovidItem[] | null;
}

export interface IAppComponentProps {
  isCountriesLoaded: boolean;
  isCovidLoaded: boolean;
  isGlobalCovidDataLoaded: boolean;
  loadCountries: () => void;
  loadCovidInfo: () => void;
  loadGlobalCovidData: () => void;
}
