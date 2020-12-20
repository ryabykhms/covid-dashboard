import defaultState from '../default-state';
import { countriesReducer } from './countries-reducer';
import { covidReducer } from './covid-reducer';
import { selectedDataReducer } from './selected-data-reducer';

export function rootReducer(state = defaultState, action: any) {
  let currentState: any = countriesReducer(state, action);
  currentState = covidReducer(currentState, action);
  currentState = selectedDataReducer(currentState, action);
  return currentState;
}
