import defaultState from '../default-state';
import { countriesReducer } from './countries-reducer';
import { covidReducer } from './covid-reducer';

export function rootReducer(state = defaultState, action: any) {
  let currentState: any = countriesReducer(state, action);
  currentState = covidReducer(currentState, action);
  return currentState;
}
