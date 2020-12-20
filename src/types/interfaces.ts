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

export interface IAppState {
  isCountriesLoaded: boolean;
  isCovidLoaded: boolean;
  countries: Array<ICountry>;
  selectedCountry: string | null;
  covidActive: ICovidInfo | null;
  covidGlobal: ICovidInfo | null;
  covidAllCountries: Array<ICovidInfo>;
  selectedData: {
    timeInterval: string;
    activeStatus: string;
    sizeStats: string;
  }
}

export interface IAppComponentProps {
  isCountriesLoaded: boolean;
  isCovidLoaded: boolean;
  loadCountries: () => void;
  loadCovidInfo: () => void;
}
