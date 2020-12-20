import { Dispatch } from 'redux';
import { defaultState } from '@store';
import { AppActions, ICountryCovidItem } from '@types';
import { storage } from '@utils';

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

      if (payload) {
        covidActive = state.covidAllCountries[payload.toUpperCase()];
      } else {
        covidActive = state.covidGlobal;
      }

      return {
        ...state,
        isCountryCovidDataLoaded: false,
        selectedCountry: payload,
        covidActive,
      };

    case AppActions.SET_COUNTRY_COVID_DATA:
      let selectedData = state.selectedData;

      if (!payload.isError) {
        selectedData = formatCovidData(payload.data);
      } else {
        selectedData = null;
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

function formatCovidData(data: ICountryCovidItem[]) {
  return data.map(({ Date: date, ...props }) => ({
    ...props,
    Date: new Date(date),
  }));
}

export const setActiveCountry = (payload: string | null) => (dispatch: Dispatch) => {
  dispatch({ type: AppActions.SET_ACTIVE_COUNTRY, payload });
  return fetch(`https://api.covid19api.com/country/${payload}`)
    .then(async (response) => {
      dispatch({
        type: AppActions.SET_COUNTRY_COVID_DATA,
        payload: {
          isError: false,
          data: await response.json(),
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: AppActions.SET_COUNTRY_COVID_DATA,
        payload: {
          isError: true,
          data: error,
        },
      });
    });
};

export const loadCountries = () => (dispatch: Dispatch) => {
  if (!storage.countries.has()) {
    fetch(
      'https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code'
    )
      .then(async (response) => {
        dispatch({
          type: AppActions.SET_COUNTRIES,
          payload: {
            isFetch: true,
            isError: false,
            data: await response.json(),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: AppActions.SET_COUNTRIES,
          payload: {
            isFetch: true,
            isError: true,
            data: error,
          },
        });
      });
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
