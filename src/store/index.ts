import { createStore, Dispatch, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import {
  IAppState,
  AppActions,
} from '../types';

const defaultState: IAppState = {
  isCountriesLoaded: false,
  countries: [],
}

function countriesReducer(state = defaultState, action: any) {
  const { payload, type } = action;
  switch (type) {
    case AppActions.SET_COUNTRIES:
      return {
        ...state,
        isCountriesLoaded: true,
        countries: payload,
      }
    default:
      return state
  }
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const AppStore = createStore(
  countriesReducer as any,
  defaultState,
  composeEnhancers(
    applyMiddleware(thunk)
  )
)

AppStore.subscribe(() => console.log(AppStore.getState()))

export const loadCountries = () => (dispatch: Dispatch) => {
  fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha3Code')
    .then(async response => {
      dispatch({ type: AppActions.SET_COUNTRIES, payload: await response.json() })
    });
};

