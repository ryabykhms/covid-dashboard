import defaultState from '../default-state';
import { AppActions } from '../../types';
import { Dispatch } from 'redux';
import { storageCountries } from '../../utils/local-storage';

export function countriesReducer(state = defaultState, action: any) {
  const { payload, type } = action;
  switch (type) {
    case AppActions.SET_COUNTRIES:
      return {
        ...state,
        isCountriesLoaded: true,
        countries: payload,
      };
    case AppActions.SET_ACTIVE_COUNTRY:
      let covidActive = state.covidActive;

      if (payload) {
        covidActive = state.covidAllCountries[payload.toUpperCase()];
      }

      return {
        ...state,
        selectedCountry: payload,
        covidActive,
      };
    default:
      return state;
  }
}

export const setActiveCountry = (payload: string) => (dispatch: Dispatch) => {
  dispatch({ type: AppActions.SET_ACTIVE_COUNTRY, payload });
};

export const loadCountries = () => (dispatch: Dispatch) => {
  if (!storageCountries.has()) {
    fetch(
      'https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code'
    ).then(async (response) => {
      dispatch({
        type: AppActions.SET_COUNTRIES,
        payload: await response.json(),
      });
    });
  } else {
    dispatch({
      type: AppActions.SET_COUNTRIES,
      payload: storageCountries.get(),
    });
  }
};
