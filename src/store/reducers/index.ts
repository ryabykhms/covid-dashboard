import { defaultState } from '@store';
import { api } from '@api';
import { countriesReducer } from './countries-reducer';
import { covidReducer } from './covid-reducer';
import { selectedOptionsReducer } from './selected-options-reducer';

export function rootReducer(state = defaultState, action: any) {
  const { HOPKINS, RESTCOUNTRIES } = api.endpoints;
  api.setCovidDataSource(HOPKINS);
  api.setCountriesDataSource(RESTCOUNTRIES);

  let currentState: any = countriesReducer(state, action);
  currentState = covidReducer(currentState, action);
  currentState = selectedOptionsReducer(currentState, action);
  return currentState;
}

export { countriesReducer, covidReducer };

export { setActiveCountry, loadCountries } from './countries-reducer';
export { loadCovidInfo, loadGlobalCovidData } from './covid-reducer';
export * from './selected-options-reducer';
