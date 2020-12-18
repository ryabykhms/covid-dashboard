export interface ICountry {
  population: number;
  flag: string;
  name: string;
}

export interface IAppState {
  isCountriesLoaded: boolean,
  selectedCountry: string | null,
  countries: Array<ICountry>,
}

export interface IAppComponentProps {
  isCountriesLoaded: boolean,
  loadCountries: () => void,
}


