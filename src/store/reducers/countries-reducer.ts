import { Dispatch } from 'redux';
import { defaultState } from '@store';
import { AppActions, ICountryCovidItem } from '@types';
import { storage, func } from '@utils';

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
      let population: any = 0;
      let selectedCountry: any = state.selectedCountry;

      if (selectedCountry) {
        population = state.covidAllCountries[selectedCountry].population;
      }

      if (!payload.isError) {
        selectedData = formatCovidData(population, payload.data);
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

function addNewAndPer100ThousandData(
  population: number,
  props: ICountryCovidItem,
  prevDayProps: ICountryCovidItem
) {
  if (!prevDayProps) {
    return {};
  }

  const NewConfirmed = props.Confirmed - prevDayProps.Confirmed;
  const NewDeaths = props.Deaths - prevDayProps.Deaths;
  const NewRecovered = props.Recovered - prevDayProps.Recovered;

  const result = {
    ConfirmedPer100: func.calcPer100Thousand(population, props.Confirmed),
    DeathsPer100: func.calcPer100Thousand(population, props.Deaths),
    RecoveredPer100: func.calcPer100Thousand(population, props.Recovered),
    NewConfirmed,
    NewDeaths,
    NewRecovered,
    NewConfirmedPer100: func.calcPer100Thousand(population, NewConfirmed),
    NewDeathPer100: func.calcPer100Thousand(population, NewDeaths),
    NewRecoveredPer100: func.calcPer100Thousand(population, NewRecovered),
  };

  return result;
}

function formatCovidData(population: number, data: ICountryCovidItem[]) {
  return data.map(({ Date: date, ...props }, i) => ({
    ...props,
    ...addNewAndPer100ThousandData(population, data[i], data[i - 1]),
    Date: new Date(date),
  }));
}

export const setActiveCountry = (payload: string | null) => (
  dispatch: Dispatch
) => {
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
