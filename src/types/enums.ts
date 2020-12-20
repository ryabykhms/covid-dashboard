export enum AppActions {
  SET_COUNTRIES = 'SET_COUNTRIES',
  SET_ACTIVE_COUNTRY = 'SET_ACTIVE_COUNTRY',
  SET_COVID_DATA = 'SET_COVID_DATA',
  SET_GLOBAL_COVID_DATA = 'SET_GLOBAL_COVID_DATA',
  SET_ACTIVE_COVID = 'SET_ACTIVE_COVID',
  SET_COUNTRY_COVID_DATA = 'SET_COUNTRY_COVID_DATA',
}

export enum LocalStorageKeys {
  COVID_DATA = 'mer_covid_data',
  COVID_GLOBAL = 'mer_covid_global',
  LAST_FETCH_DATE = 'mer_last_date',
  COUNTRIES = 'mer_countries',
  EARTH_POPULATION = 'mer_earth_population',
  GLOBAL_COVID_DATA = 'mer_global_covid_data',
}
