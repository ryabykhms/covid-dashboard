import { Dispatch } from 'redux';
import { defaultState } from '@store';
import { AppActions, IFetchResult } from '@types';
import { storage } from '@utils';
import { api } from '@api';

let populationMain: any = 0;

export function countriesReducer(state = defaultState, action: any) {
  const { payload, type } = action;
  switch (type) {
    case AppActions.SET_COUNTRIES:
      let countries = state.countries;

      if (payload.isError) {
        countries = [];
      } else {
        countries = payload.data;
      }

      return {
        ...state,
        isCountriesLoaded: true,
        countries,
      };

    case AppActions.SET_ACTIVE_COUNTRY:
      let covidActive = state.covidActive;
      let selected = state.selectedData;

      if (payload) {
        populationMain =
          state.covidAllCountries[payload.toUpperCase()].population;
        covidActive = state.covidAllCountries[payload.toUpperCase()];
      } else {
        covidActive = state.covidGlobal;
        selected = state.globalCovidData;
      }

      return {
        ...state,
        isCountryCovidDataLoaded: false,
        selectedCountry: payload,
        covidActive,
        selectedData: selected,
      };

    case AppActions.SET_COUNTRY_COVID_DATA:
      let selectedData = state.selectedData;
      let selectedCountry: any = state.selectedCountry;

      if (!payload.isError) {
        selectedData = payload.data;
      } else {
        selectedData = null;
      }

      if (selectedCountry) {
        populationMain = state.covidAllCountries[selectedCountry].population;
      }

      return {
        ...state,
        isCountryCovidDataLoaded: true,
        selectedData,
      };

    default:
      return state;
  }
}

export const setActiveCountry = (payload: string | null) => (
  dispatch: Dispatch
) => {
  dispatch({ type: AppActions.SET_ACTIVE_COUNTRY, payload });

  return api.fetchCovidCountryData(
    AppActions.SET_COUNTRY_COVID_DATA,
    (resultObject: IFetchResult) => {
      dispatch(resultObject);
    },
    (errorObject: IFetchResult) => dispatch(errorObject),
    { country: payload, population: populationMain }
  );
};

export const loadCountries = () => (dispatch: Dispatch) => {
  if (!storage.countries.has()) {
    api.fetchCountries(
      AppActions.SET_COUNTRIES,
      (resultObject: IFetchResult) => {
        dispatch(resultObject);
      },
      (errorObject: IFetchResult) => dispatch(errorObject)
    );
  } else {
    dispatch({
      type: AppActions.SET_COUNTRIES,
      payload: {
        isFetch: false,
        isError: false,
        data: storage.countries.get(),
      },
    });
  }
};
