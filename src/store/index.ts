import { createStore, Dispatch, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import {
  IAppState,
  AppActions,
} from '../types';
import {dispatch} from "jest-circus/build/state";

const defaultState: IAppState = {
  isCountriesLoaded: false,
  selectedCountry: null,
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
    case AppActions.SET_ACTIVE_COUNTRY:
      return {
        ...state,
        selectedCountry: payload,
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

export const setActiveCountry = (payload: string) => (dispatch: Dispatch) => {
  dispatch({ type: AppActions.SET_ACTIVE_COUNTRY, payload})
}

AppStore.subscribe(() => console.log(AppStore.getState()))

export const loadCountries = () => (dispatch: Dispatch) => {
  fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha3Code')
    .then(async response => {
      dispatch({ type: AppActions.SET_COUNTRIES, payload: await response.json() })
    });
};
