import { Dispatch } from 'redux';
import { defaultState } from '@store';
import { AppActions } from '@types';
import { storage } from '@utils';

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
  if (!storage.countries.has()) {
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
      payload: storage.countries.get(),
    });
  }
};
